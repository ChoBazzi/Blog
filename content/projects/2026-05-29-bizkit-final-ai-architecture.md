---
title: BizKit AI 서버 아키텍처 설계
description: 카카오테크 부트캠프 파이널 프로젝트에서 FastAPI, Redis Streams, RunPod, vLLM, SDXL, Milvus를 조합해 AI 기능을 비동기 파이프라인으로 설계한 기록입니다.
date: 2026-05-29
tags: ["카테부", "FastAPI", "Redis Streams", "RunPod", "vLLM", "Milvus", "AI Architecture"]
category: AI 백엔드
cover: /covers/2026-05-14-18team-ai.jpg
published: true
---

## 프로젝트 개요

BizKit은 팀 CARO가 개발한 서비스로, 개발자의 이력과 활동 데이터를 바탕으로 명함 생성, 명함 OCR, 직무 기반 자기소개 생성, GitHub 기반 6각 차트 분석, 자연어 검색을 제공하는 카카오테크 부트캠프 파이널 프로젝트입니다.

저는 이 프로젝트에서 AI 서버 영역을 맡아 FastAPI 기반 오케스트레이터, 비동기 작업 처리 구조, 모델 선택 근거, 기능별 API 계약을 설계했습니다. 이 글은 Wiki에 정리했던 API 설계와 모델 벤치마크, 모듈화 설계를 바탕으로 AI 서버를 어떻게 나눴는지 정리한 글입니다.

이 글은 [BizKit AI 서버 메인글](/projects/2026-05-14-18team-ai)의 상세 설계 기록입니다. 프로젝트 전체 맥락을 먼저 보고 싶다면 메인글을 먼저 읽는 편이 좋습니다.

- 구분: 카카오테크 부트캠프 파이널 팀 프로젝트
- 역할: AI 서버 설계, API 명세 작성, 모델 벤치마크, 기능별 파이프라인 설계
- 주요 기술: FastAPI, Redis Streams, RunPod Serverless, vLLM, SDXL, Milvus, BGE-m3-ko
- 링크: [AI Repo](https://github.com/100-hours-a-week/18-team-18TEAM-ai), [AI Wiki](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/AI-Wiki)

## 문제

BizKit의 AI 기능은 일반적인 CRUD API처럼 요청을 받고 바로 DB를 읽어 응답하는 구조와 달랐습니다. 명함 생성은 Diffusion 모델과 텍스트 렌더링을 거쳐야 했고, 직무 분석과 6각 차트 분석은 LLM 호출과 외부 API 호출이 필요했습니다. 임베딩 검색은 Vector DB와 모델 추론이 함께 필요했습니다.

이 기능들을 Spring 도메인 서버 안에 직접 넣으면 세 가지 문제가 생깁니다.

- AI 모델과 프롬프트 변경이 도메인 서버 배포 리스크로 이어짐
- Diffusion, LLM, Embedding처럼 자원 특성이 다른 기능을 한 방식으로 확장해야 함
- 오래 걸리는 AI 작업이 HTTP 요청 시간을 늘리고 실패 처리도 불명확해짐

그래서 AI 서버의 목표는 단순히 모델을 호출하는 것이 아니라, 도메인 서버와 분리된 AI 워크플로우 영역을 만들고 긴 작업을 작업 단위로 추적하는 것이었습니다.

## 설계 방향

전체 구조는 Spring Backend가 도메인, 권한, 정책을 담당하고 FastAPI가 AI 워크플로우를 담당하는 방식으로 나눴습니다. FastAPI는 요청을 받으면 작업을 만들고, Queue와 Worker를 통해 모델 호출과 후처리를 실행합니다.

::architecture bizkit-ai

위 다이어그램은 두 층으로 나눠 읽을 수 있습니다. 상단은 서버와 모델 서빙의 큰 책임 경계이고, 하단은 기능별 데이터 이동 과정입니다. OCR은 Frontend가 FastAPI로 직접 요청하지만, 명함 생성, 직무 분석, 6각 차트 분석처럼 사용자 데이터와 도메인 정책이 필요한 기능은 Spring을 거쳐 FastAPI 작업으로 이동합니다.

이 구조에서 Spring은 명함, 사용자, 리뷰, 검색 같은 도메인 계약을 유지합니다. FastAPI는 AI 기능의 실행 순서, 모델 호출, 결과 파싱, 실패 상태 기록을 담당합니다. GitHub 원천 데이터는 FastAPI가 직접 수집하고, 리뷰와 사용자 컨텍스트는 Spring이 전달하는 방식으로 경계를 정했습니다.

## 맡은 역할

제가 맡은 영역은 AI 서버의 기능 구현 이전에 먼저 책임 경계를 정하는 일이었습니다. 특히 다음 항목을 설계 문서로 정리했습니다.

- 명함 생성 API 설계
- 명함 OCR API 설계
- 직무 분석 API 설계
- 6각 차트 분석 API 설계
- 이미지 생성 모델 선택 근거
- LLM 모델 선택 근거
- 임베딩 모델 선택 근거
- AI 모듈별 책임 분리
- 모듈화 설계가 팀 서비스 시나리오에 맞는 이유

## API 설계

AI API는 대부분 비동기 방식으로 설계했습니다. Diffusion, LLM, GitHub API, Vector DB 호출은 응답 시간이 길거나 실패 가능성이 있기 때문에, 클라이언트가 요청 결과를 즉시 받는 구조보다 `task_id`를 받고 상태를 조회하는 구조가 더 안전했습니다.

다만 모든 AI API를 Spring Backend 뒤에 숨기지는 않았습니다. 명함 생성, 직무 분석, 6각 차트 분석처럼 사용자 데이터, 권한, 도메인 정책이 필요한 기능은 Spring을 통해 FastAPI로 전달했습니다. 반면 명함 OCR은 업로드한 이미지에서 연락처 필드를 추출하는 독립 작업이고, 별도 인증/인가가 필요하지 않다고 판단했습니다. 그래서 OCR은 Frontend가 FastAPI OCR API를 직접 호출하는 흐름으로 설계했습니다.

공통 상태는 다음과 같이 정의했습니다.

```text
pending
  -> running
  -> completed
  -> failed
```

### 명함 OCR

명함 OCR은 사용자가 업로드한 명함 이미지에서 이름, 회사, 직책, 전화번호, 이메일 같은 후보 필드를 추출하는 기능입니다. 이 기능은 Spring의 사용자 권한이나 도메인 데이터 조회가 필요하지 않았기 때문에, Frontend와 FastAPI를 직접 연결하는 API로 설계했습니다.

```text
Frontend
  -> FastAPI OCR API
  -> OCR Pipeline
  -> field normalization
  -> Frontend
```

API 계약은 파일 업로드와 구조화된 필드 반환을 중심으로 잡았습니다.

```text
POST /ai/ocr/card
  -> multipart/form-data image 업로드
  -> task_id 반환

GET /ai/tasks/{task_id}
  -> pending / running / completed / failed

GET /ai/tasks/{task_id}/result
  -> name, company, position, phone, email, address, raw_text, confidence 반환
```

OCR을 Spring 경유로 만들 수도 있었지만, 이 경우 Spring이 단순 프록시 역할만 하게 됩니다. 인증/인가가 필요하지 않은 작업에서 Spring을 거치면 API 경로만 길어지고 장애 지점도 늘어납니다. 그래서 OCR은 FastAPI가 직접 이미지 검증, OCR 실행, 필드 정규화, 실패 상태 기록을 담당하도록 나눴습니다.

대신 응답은 프론트엔드가 바로 폼에 채울 수 있는 구조로 제한했습니다. OCR 결과를 원문 텍스트 그대로 반환하면 사용자가 다시 정리해야 하므로, 전화번호와 이메일처럼 형식이 명확한 값은 정규화하고, 확신이 낮은 필드는 `confidence`와 함께 내려주는 방식으로 설계했습니다.

### 명함 생성

명함 생성은 사용자의 명함 정보와 스타일 요청을 받아 배경 이미지를 만들고 텍스트를 오버레이하는 기능입니다.

```text
POST /ai/card/generate
  -> task_id 반환

GET /ai/tasks/{task_id}
  -> pending / running / completed / failed

GET /ai/tasks/{task_id}/result
  -> image_data_url, image_url, width, height, style_tag
```

명함 생성은 한 번의 모델 호출로 끝내지 않았습니다. LLM이 자연어 스타일 설명을 SDXL 프롬프트와 레이아웃 힌트로 바꾸고, SDXL이 배경 이미지를 생성한 뒤, 텍스트는 별도 렌더링 단계에서 확정하도록 설계했습니다.

이렇게 나눈 이유는 명함의 전화번호, 이메일, 주소는 한 글자만 틀려도 사용할 수 없기 때문입니다. 이미지 생성 모델에게 텍스트까지 맡기면 오탈자와 레이아웃 흔들림이 생길 수 있으므로, 배경 생성과 텍스트 렌더링을 분리했습니다.

### 직무 분석

직무 분석은 회사, 부서, 직무, 프로젝트 정보를 받아 자기소개 문단과 검색 신뢰도를 반환하는 기능입니다.

```text
POST /ai/job/analyze
  -> task_id 반환

Worker
  -> 검색 쿼리 생성
  -> 웹 검색
  -> search_confidence 계산
  -> LLM 호출
  -> JSON 결과 저장
```

진행 단계는 `building_search_query`, `searching_web`, `calculating_confidence`, `calling_llm`, `done`처럼 나눴습니다. 단순히 "처리 중"만 알려주는 것이 아니라, 어느 단계에서 지연되는지 확인할 수 있게 하기 위해서였습니다.

### 6각 차트 분석

6각 차트 분석은 GitHub 활동, 사용자 역량 정보, 동료 리뷰를 바탕으로 협업, 소통, 기술, 문서화, 신뢰도, 재협업 선호도를 계산하는 기능입니다.

```text
POST /ai/hex/analyze
  -> GitHub 데이터 수집
  -> 규칙 기반 점수 계산
  -> LLM 해석 생성
  -> radar_chart, confidence_level, analysis_summary 반환
```

핵심은 점수 계산과 LLM 해석을 분리한 점입니다. 점수는 GitHub 활동과 리뷰 데이터를 바탕으로 결정론적으로 계산하고, LLM은 점수와 근거를 설명하는 역할만 맡겼습니다. 이렇게 해야 같은 입력에 대해 점수가 재현 가능하고, LLM이 근거 없이 점수를 만들어내는 위험을 줄일 수 있습니다.

## 모듈 책임 분리

AI 서버는 하나의 큰 서비스가 아니라 여러 책임을 가진 모듈로 나눴습니다.

- AI Orchestrator: 기능별 파이프라인 라우팅, 입력 정규화, 모델 호출 순서 제어
- Job Manager: 작업 생성, 상태 전이, 결과 메타데이터 기록
- Queue Worker: Redis Streams 작업 소비, 실패 재시도, 모델별 동시성 제어
- Redis Cache Layer: 진행률, 중간 결과, GitHub 응답, 동일 요청 캐시
- Card Generation Pipeline: SDXL 배경 생성, LLM 레이아웃 힌트, 텍스트 렌더링
- OCR Pipeline: 명함 이미지에서 필드 후보 추출과 정규화
- Hex Analysis Pipeline: GitHub 수집, 규칙 기반 점수 계산, LLM 해석
- Semantic Search Pipeline: 임베딩 생성, Vector DB 조회, top-k 후보 반환
- Short Bio Generator: 사용자 데이터 기반 소개문 생성

이 분리는 팀 작업에도 필요했습니다. Spring 팀은 도메인 정책과 데이터 무결성에 집중하고, AI 서버는 모델 호출과 AI 후처리에 집중할 수 있습니다. API 계약만 유지하면 프롬프트, 후처리, 모델 버전을 FastAPI 영역에서 독립적으로 바꿀 수 있습니다.

## 모델 선택 요약

모델 선택은 별도 글인 [BizKit AI 모델 선택과 벤치마크](/projects/2026-05-29-bizkit-ai-model-benchmark)에서 자세히 다룹니다. 이 아키텍처 글에서는 모델별 세부 비교보다, 왜 모델을 Spring 내부가 아니라 FastAPI와 RunPod 경로로 분리했는지를 중심으로 정리합니다.

최종 조합은 명함 배경 생성에 SDXL Base, LLM 분석에 Qwen2.5 7B Instruct, 임베딩 검색에 BGE-m3-ko와 Milvus IVF_FLAT을 사용하는 방향이었습니다.

- SDXL Base: 명함 배경 생성 담당, 텍스트는 별도 렌더러가 확정
- Qwen2.5 7B Instruct: 6각 차트와 직무 분석의 JSON 응답 생성
- BGE-m3-ko: 직무 필터링, 자연어 검색, 시맨틱 캐시 담당
- Milvus IVF_FLAT: 프로젝트 규모에서 검색 품질과 운영 단순성의 균형 확보

이 선택의 핵심은 "가장 강한 모델을 하나 고르는 것"이 아니라, 기능별 실패 조건을 기준으로 모델 역할을 제한한 점입니다. 명함 텍스트는 이미지 모델에게 맡기지 않았고, 6각 차트 점수는 LLM이 아니라 규칙 기반 계산으로 만들었습니다. 임베딩도 모델 단독 성능이 아니라 Milvus 통합 후의 검색 품질을 기준으로 봤습니다.

## 왜 모듈화가 필요했는가

AI 기능은 요구사항 변경이 잦습니다. 명함 생성은 스타일 프롬프트를 계속 바꿀 수 있고, OCR은 전화번호 정규화 규칙을 수정해야 할 수 있습니다. 6각 차트는 점수 산출식과 리뷰 반영 정책이 바뀔 수 있습니다.

모듈화하지 않으면 이런 변경이 도메인 서버 배포와 엮입니다. 반대로 AI 파이프라인을 FastAPI와 RunPod 모델 서빙으로 분리하면, 프롬프트나 계산식 변경을 AI 서버 단독 배포로 처리할 수 있습니다.

또한 기능마다 자원 특성이 다릅니다.

- Diffusion: 고비용, 장시간 작업
- VLM OCR: 이미지 처리 중심
- LLM: 토큰 처리와 동시성 관리
- Embedding: 짧고 호출량이 많은 요청

RunPod에서 모델 엔드포인트를 분리하면 특정 기능의 트래픽만 늘어났을 때 해당 모델만 확장할 수 있습니다. 검색이 늘어나면 Embedding/Vector DB 경로를 확장하고, 명함 생성이 늘어나면 Queue Worker와 Diffusion 엔드포인트를 확장하는 방식입니다.

## 트레이드오프

이 설계는 단순한 동기 API보다 구현할 것이 많습니다. 작업 ID, 상태 저장, 결과 조회, Queue, Worker, 실패 상태, 캐시 정책을 모두 설계해야 합니다. 팀 프로젝트 규모에서는 과해 보일 수도 있습니다.

하지만 AI 기능은 외부 의존성과 지연 시간이 크기 때문에, 단순 동기 API가 오히려 운영 리스크가 큽니다. 특히 GitHub API rate limit, RunPod cold start, LLM timeout 같은 문제는 반드시 실패 상태로 기록되어야 합니다.

모델을 직접 운영하는 것도 비용과 관리 부담이 있습니다.  GPT,  Claude, Gemini 같은 API를 쓰면 초기 구현은 더 빠릅니다. 하지만 명함처럼 개인정보와 정확한 텍스트 렌더링이 중요한 기능에서는 외부 API에 모든 정보를 보내고 결과 텍스트를 모델에 맡기는 방식이 맞지 않았습니다.

그래서 이 프로젝트에서는 빠른 구현보다 서비스 데이터의 통제 가능성을 더 중요하게 보았습니다.

## 검증과 결과

이 설계에서 가장 의미 있었던 검증은 모델 선택을 감이 아니라 수치로 정리한 점입니다.

- 이미지 생성: SDXL Base가 약 2.86~2.88초, 9.21GB VRAM으로 명함 배경 생성에 적합
- LLM: Qwen2.5 7B가 HEX 0.98, Job 0.86, 36.8 tokens/sec로 종합 점수 우위
- 임베딩: BGE-m3-ko가 Recall@5 1.0, MRR 0.9551, Milvus E2E 147.5ms로 안정적

API도 명함 생성, 직무 분석, 6각 차트 분석을 모두 비동기 작업 모델로 통일했습니다. 덕분에 프론트엔드와 Spring Backend는 `task_id`, 상태 조회, 결과 조회라는 일관된 계약으로 AI 기능을 다룰 수 있습니다.

## 아쉬웠던 점

설계 문서에는 모델 벤치마크와 API 흐름을 정리했지만, 실제 운영 관측 지표까지 충분히 연결하지는 못했습니다. 예를 들어 기능별 성공률, 평균 처리 시간, 재시도 횟수, 모델별 비용을 대시보드로 남겼다면 설계의 효과를 더 명확하게 보여줄 수 있었을 것입니다.

또한 JobDB와 Redis Streams의 책임 경계는 더 구체화할 여지가 있었습니다. Redis는 진행률과 단기 결과에 적합하지만, 장기 이력과 재처리를 위해서는 별도 영속 저장소가 필요합니다. 이 부분은 이후 운영 단계에서 더 명확한 기준이 필요합니다.

## 배운 점

AI 서버 설계에서 중요한 것은 모델을 붙이는 속도가 아니라, 모델 출력을 서비스가 신뢰할 수 있는 형태로 제한하는 것입니다. LLM은 설명과 요약에 강하지만 점수 계산을 맡기기에는 변동성이 큽니다. Diffusion은 배경 생성에 강하지만 명함 텍스트를 정확히 보장하기에는 위험합니다. 임베딩 모델은 벤치마크가 좋아도 실제 Vector DB 통합 후 성능이 유지되는지 확인해야 합니다.

이번 프로젝트를 통해 AI 기능도 일반 백엔드처럼 책임 경계, API 계약, 실패 상태, 배포 단위, 관측 가능성을 먼저 설계해야 한다는 점을 배웠습니다. 특히 신입 개발자 관점에서는 "어떤 모델을 썼다"보다 "왜 그 모델을 선택했고, 서비스 제약 때문에 어떤 구조로 나눴는지"를 설명하는 것이 더 중요하다는 것을 체감했습니다.

## 참고한 설계 문서

- [BizKit AI 서버 메인글](/projects/2026-05-14-18team-ai)
- [BizKit AI 모델 선택과 벤치마크](/projects/2026-05-29-bizkit-ai-model-benchmark)
- [AI Wiki](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/AI-Wiki)
- [명함 생성 API](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/%5BAPI%5D%EB%AA%85%ED%95%A8%EC%83%9D%EC%84%B1)
- [직무 분석 API](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/%5BAI%5D-%EC%A7%81%EB%AC%B4%EB%B6%84%EC%84%9D)
- [6각 차트 리뷰 API](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/%5BAPI%5D6%EA%B0%81-%EC%B0%A8%ED%8A%B8-%EB%A6%AC%EB%B7%B0)
- [이미지 생성 모델](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%83%9D%EC%84%B1%EB%AA%A8%EB%8D%B8)
- [LLM](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/LLM)
- [임베딩 모델](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/%EC%9E%84%EB%B2%A0%EB%94%A9%EB%AA%A8%EB%8D%B8)
- [각 모듈의 책임과 기능](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/%5BAI%5D-%EA%B0%81-%EB%AA%A8%EB%93%88%EC%9D%98-%EC%B1%85%EC%9E%84%EA%B3%BC-%EA%B8%B0%EB%8A%A5%EC%97%90-%EB%8C%80%ED%95%9C-%EC%84%A4%EB%AA%85)
- [모듈화로 기대되는 효과와 근거](https://github.com/100-hours-a-week/18-team-18TEAM-wiki/wiki/%5BAI%5D-%EB%AA%A8%EB%93%88%ED%99%94%EB%A1%9C-%EA%B8%B0%EB%8C%80%EB%90%98%EB%8A%94-%ED%9A%A8%EA%B3%BC%EC%99%80-%EC%9E%A5%EC%A0%90-%EA%B7%B8%EB%A6%AC%EA%B3%A0-%ED%8C%80%EC%9D%98-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%8B%9C%EB%82%98%EB%A6%AC%EC%98%A4%EC%97%90-%EC%99%9C-%EB%B6%80%ED%95%A9%ED%95%9C-%EA%B7%BC%EA%B1%B0)
