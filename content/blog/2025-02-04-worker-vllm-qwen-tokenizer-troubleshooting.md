---
title: "RunPod vLLM Qwen 토크나이저 충돌 해결"
description: "RunPod worker-vLLM 환경에서 Qwen 계열 토크나이저와 vLLM V0/V1 API 충돌을 해결한 트러블슈팅 기록입니다."
date: "2026-02-04"
tags: ["카테부", "vLLM", "RunPod", "Qwen", "Transformers", "Troubleshooting"]
category: "트러블슈팅"
published: true
---

## 에러 내용

RunPod Serverless에서 vLLM 기반 OpenAI 호환 엔드포인트를 운영하던 중, Qwen 계열 모델을 사용하는 인스턴스가 아래 에러와 함께 정상 동작하지 않았다.

```text
AttributeError: Qwen2Tokenizer has no attribute all_special_tokens_extended
```

처음에는 단순한 토크나이저 문제처럼 보였지만, 실제로는 `transformers`, `vLLM`, OpenAI 호환 serving 계층의 버전과 API 경계가 함께 어긋난 문제였다.

- 레포지토리: [worker-vllm](https://github.com/ChoBazzi/worker-vllm)
- 환경: RunPod Serverless, vLLM, Qwen 계열 모델
- 영향: OpenAI compatible chat/completions 요청 실패

## 원인 분석

vLLM은 내부 토크나이저 처리 과정에서 `all_special_tokens_extended` 속성이 있다고 가정했다. 하지만 현재 설치된 `transformers` 조합의 `Qwen2Tokenizer`에는 해당 속성이 없어 AttributeError가 발생했다.

단기적으로는 vLLM이 참조하는 토크나이저 래퍼에서 `all_special_tokens_extended`가 없을 때 `all_special_tokens`를 fallback으로 제공하는 방식도 가능했다. 하지만 이 방식은 증상만 막는 패치에 가깝고, 이후 vLLM OpenAI serving 계층에서 V0/V1 API 충돌이 이어질 가능성이 있었다.

그래서 최종 방향은 토크나이저만 우회하는 것이 아니라, `transformers`와 `vLLM` 버전 궁합을 맞추고 엔진 레이어를 vLLM V1 구조에 맞게 정리하는 것으로 잡았다.

## 해결 방법

먼저 Docker 빌드 환경에서 vLLM과 관련 라이브러리 버전을 고정했다. Qwen2 토크나이저가 vLLM이 기대하는 속성과 동작을 제공할 수 있도록 `transformers` 버전을 맞추고, 런타임에서 사용하는 vLLM 버전도 명시했다.

```text
vLLM: 0.14.0
transformers: 4.51.3
torch: 2.6.0
```

그 다음 OpenAI 호환 서버 계층에서 발생하던 V0/V1 API 충돌을 해결하기 위해 엔진 초기화 코드를 V1 방식으로 마이그레이션했다.

- `AsyncLLMEngine` 대신 `vllm.v1.engine.async_llm.AsyncLLM`을 사용했다.
- `AsyncEngineArgs`를 기준으로 환경변수를 필터링해, 현재 vLLM 버전에서 허용되는 인자만 넘기도록 했다.
- V0 전용이거나 deprecated된 인자들을 기본값 구성에서 제거했다.
- V1에서 제거되거나 위치가 바뀐 import를 정리했다.
- `OpenAIServingModels`, `OpenAIServingChat`, `OpenAIServingCompletion` 초기화에서 더 이상 사용하지 않는 `model_config` 전달을 제거했다.
- OpenAI compatible route(`/v1/models`, `/v1/chat/completions`, `/v1/completions`)는 별도 엔진 래퍼에서 처리하도록 분리했다.

## 수정한 구조

최종 구조는 RunPod handler가 요청을 받고, 입력 형태에 따라 일반 vLLM 엔진 또는 OpenAI 호환 엔진으로 분기하는 방식이다.

```text
RunPod handler
  -> JobInput 파싱
  -> OpenAI route 여부 확인
  -> vLLMEngine 또는 OpenAIvLLMEngine 선택
  -> AsyncLLM generate
  -> streaming/non-streaming 응답 반환
```

일반 요청은 `vLLMEngine`에서 처리하고, OpenAI 호환 요청은 `OpenAIvLLMEngine`이 `OpenAIServingChat`과 `OpenAIServingCompletion`을 통해 처리한다. 이렇게 분리하니 일반 vLLM 호출과 OpenAI compatible API 호출의 책임이 명확해졌다.

## 배운 점

이번 문제는 단순히 "없는 속성을 하나 추가하면 되는 문제"가 아니었다. 토크나이저, `transformers`, vLLM 엔진, OpenAI serving 계층이 모두 연결되어 있어서 한 부분의 버전이 어긋나면 전혀 다른 위치에서 AttributeError나 초기화 오류가 터질 수 있었다.

특히 vLLM은 버전 변화에 따라 엔진 클래스, 설정 인자, serving 초기화 방식이 빠르게 바뀐다. 그래서 모델만 교체하는 작업처럼 보여도 실제로는 런타임 버전, 토크나이저 구현, OpenAI 호환 계층까지 함께 확인해야 한다.

이 트러블슈팅을 통해 RunPod에서 vLLM을 올릴 때는 버전 고정과 엔진 초기화 구조를 먼저 확인해야 한다는 기준이 생겼다. 앞으로 모델을 바꾸거나 vLLM을 업그레이드할 때도 릴리스 노트와 지원 `transformers` 조합을 먼저 확인하고, deprecated 인자가 남아 있지 않은지 점검할 것이다.
