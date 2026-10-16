# 근거 중심 블로그 하네스

## 적용 범위와 기존 환경

2026-10-04 기준 OMP 18.3.5를 대상으로 구축했다. Next.js App Router + 로컬 Markdown + Obsidian 구조이며 `content/`가 게시 원본이다. 루트 AGENTS의 기술 글 `이다` 문체를 우선한다. 기존 글을 수정하거나 실제 글을 생성하지 않았다. `docs/architecture.md`는 NAS Docker 배포를 설명하지만 기존 회고에는 Vercel 공개 배포가 언급된다. 실제 호스팅 상태는 확인하지 않았으며 배포하지 않는다.

기존 `package.json`, `scripts/harness.mjs`, 콘텐츠, Mermaid/UI 및 사용자의 미커밋 변경은 보존한다. 전역 모델 역할은 그대로 두고 프로젝트의 블로그 작업 기본값만 high로 지정했다. 루트 AGENTS와 `.omp/AGENTS.md`는 별개로 적용되며 후자가 전자를 무효화하지 않는다.

## 실제 경로

- `.omp/config.yml`: 모델 역할·fallback·effort·prewalk 정책.
- `.omp/AGENTS.md`: 상시 원칙과 진입점.
- `.omp/agents/blog-{researcher,tech-reviewer,ko-editor,reader}.md`: 수집/기술 검토/교정/독자 검토.
- `.omp/commands/blog-{capture,draft,review,check}.md`: 사용자 정의 명령. OMP 내장 명령이 아니다.
- `.agents/skills/{ko-tech-blog,k-humanizer,blog-evidence}/`: 독립 작성한 프로젝트 지침과 근거 템플릿. 루트 지침에 따라 `.omp/skills` 대신 기존 정식 위치를 사용한다.
- `editorial/style-guide.md`, `editorial/templates/`: 문체·유형별 구조.
- `scripts/blog-check.mjs`, `evals/blog-harness/`: 결정적 검사와 합성 검증 사례.
- `.blog-work/<slug>/`: brief, sources, claims, outline, draft, review, article. article도 비공개 후보이다.
- `.blog-work/harness-setup/`: 구축 원자료·검증 기록·외부 임시 백업 위치. 공개 문서에 계정·원문·개인 경로를 옮기지 않는다.

## 모델과 권한

`omp models find astra --json`에서 `openai-codex/gpt-6-astra`와 low/medium/high/xhigh/max 지원을 확인했다.

| 작업 | 역할 | 추론 |
| --- | --- | --- |
| 메인: 기획·판단·작성·반영 | default / blog-core | high |
| blog-researcher: 기계적 수집만 | blog-collect | low |
| blog-tech-reviewer | blog-core | high |
| blog-ko-editor | blog-core | high |
| blog-reader | blog-core | high |

모두 같은 Astra 모델이다. 별도 작성 에이전트는 없다. 연구자는 원문 위치를 전달할 뿐 신뢰성·해석·추천을 하지 않는다. 기술 검토자는 read/grep/glob, 교정자는 read, 독자는 도구 없이 전달된 초안·독자·선행 지식만 받는다. 수집자는 read/grep/glob/web_search를 받는다. OMP의 반환용 yield는 자동 추가된다. 셸·쓰기·추가 에이전트 권한은 없다. 이는 프롬프트 약속뿐 아니라 tools/spawns 제한이다. read 권한은 파일 경로 샌드박스가 아니므로 비공개 자료를 필요한 범위만 전달한다.

설정 우선순위는 환경 > 런타임 > overlay > 프로젝트 > 전역 > 기본값이다. 작업 모델은 invocation-local eval override > task.agentModelOverrides > 에이전트 model > 부모 모델 순서다. 이 하네스는 task의 agent 이름만 사용하고 eval 모델 override를 사용하지 않는다. `task.enableEffort: false`, 각 blog agent prewalk off, 세션 prewalk false, `retry.modelFallback: false`로 자동 하향 전환을 막는다. 별도 CLI override를 주면 프로젝트 정책을 우회할 수 있으므로 실행 상태도 확인한다. 기존 비블로그 역할은 변경하지 않았다.

현재 부모 대화의 모델 표시는 Astra이나 이미 실행 중인 대화의 추론 강도를 파일 수정으로 바꿨다고 주장하지 않는다. 새 RPC 세션의 get_state에서 Astra/high를 확인했다. 새 대화 시작 명령:

```sh
omp --model openai-codex/gpt-6-astra --thinking high --no-prewalk
```

`--continue`로 예전 세션을 재개하지 않는다. 명령 목록은 시작 시 로딩되므로 기존 TUI에서는 재시작한다. 설치본 내장 `omp://config-usage.md`, `task-agent-discovery.md`, `skills.md`, `slash-command-internals.md`, `rpc.md`, `settings.md`를 기준으로 설정했다. main 문서만 보고 키를 추측하지 않았다.

## 사용 순서

```text
/blog-capture 로컬 실험 기록 경로
/blog-draft cache-experiment
/blog-review cache-experiment
/blog-check cache-experiment
```

또는 “이 자료로 초안부터 검토까지 진행해줘”라고 요청한다. 자료 → 근거 → 목차 → 초안 → 기술/필요 시 독자 검토 → 교정 → 재검증 → 본인 검토 순서이다. 짧은 교정은 전체 팀을 호출하지 않는다. 초안만 요청하면 초안에서 멈춘다. 질문은 한 번에 최대 3개, 수정·검토는 기본 2회 이내다.

상태는 초안 / 검토 중 / 본인 검토 대기 / 차단됨이다. 핵심 미확인 주장·필수 검사 실패가 남으면 본인 검토 대기로 올리지 않는다. 사람 검토 대기는 발행 승인이 아니다.

## 검사

```sh
node scripts/blog-check.mjs .blog-work/cache-experiment/article.md --before .blog-work/cache-experiment/draft.md --build
npm run harness
```

정확한 합성 사례 실행법은 `evals/blog-harness/README.md`를 따른다. PASS/FAIL/SKIP에는 대상과 이유가 출력된다. 필수 실패·수행 불가는 비정상 종료한다. 기본 검사는 읽기 전용이고 외부 링크는 `--links`로만 확인한다. 링크 접근 제한은 삭제 이유가 아니다. build 실행은 기존 next build 설정을 확인한 뒤 수행한다. 코드 예제는 자동 실행하지 않는다.

정규식·장부 검사는 사실성 전체, 모든 Markdown 문법, 비밀정보 부재를 보증하지 않는다. 코드·숫자·버전·URL의 차이는 검토 후보이지 오류 확정이 아니다. 의미 변화·기여 범위·출처의 적합성은 핵심 모델과 본인이 원문을 대조한다. LLM 검토 결과를 정적 검사로 대체하지 않는다.

## 비공개·발행 경계

`.blog-work/`는 Git ignore에 추가했고 기존 추적 파일은 발견되지 않았다. Docker context에서도 `.blog-work`, `.omp`, `.agents`, editorial, evals를 제외한다. 백업은 저장소 밖 임시 디렉터리에 있다. 사이트 입력은 `content/{blog,notes,projects}`와 public이며 작업 폴더는 별개다. Git ignore는 원격 호스팅의 업로드 제외를 보증하지 않는다. 실제 원격 배포/플랫폼 업로드는 검증하지 않았다.

로그·코드·이미지의 공개 권한과 마스킹을 확인한다. 비공개 원문을 검색 쿼리에 넣지 않는다. 작성자가 최종 문장·근거·자기 기여를 설명할 수 있는지 검토한 뒤 별도 승인을 받아야만 게시 경로 이동이나 published 변경을 할 수 있다. 이 하네스는 커밋·푸시·배포·플랫폼 API 호출을 하지 않는다.

## 업데이트와 복구

외부 스킬은 자동 업데이트하지 않는다. `blog-harness-sources.md`의 출처와 라이선스를 재확인하고 새 버전 차이를 검토한 다음 로컬 원칙과 테스트를 유지하며 수동 병합한다. `.agents/`는 기존 Git ignore 정책을 보존했으므로 로컬 전용이다. 다른 개발 환경으로 옮길 때 이 디렉터리도 별도로 전달해야 한다.

되돌릴 때 이번에 새로 만든 위 파일만 삭제하고, `.gitignore`의 `.blog-work/` 추가 블록과 `.dockerignore`의 이번 5개 항목만 제거한다. 기존 파일의 변경 전 사본 위치는 비공개 구축 폴더에 있다. 이후 사용자 변경이 있으면 전체 백업 복원 대신 해당 줄만 병합한다. reset/clean/강제 체크아웃은 사용하지 않는다. 비공개 작업 자료는 사용자 동의 없이 삭제하지 않는다.

## 구축 검증 결과

2026-10-04, 실제 실행 결과이다.

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `omp --version`, `omp --help`, 모델 목록·개별 설정 조회 | PASS | 18.3.5, Astra 및 high/low 지원, 프로젝트 역할과 fallback off |
| 새 RPC `get_state` | PASS | 메인 Astra/high. 기존 부모 세션의 강도 변경 증명은 아님 |
| 새 RPC `get_available_commands` | PASS | blog 명령 4개와 새 skill 명령 3개를 실제 발견 |
| `omp read skill://blog-evidence/templates/claims.md` | PASS | 발견된 스킬의 참조 파일 접근 |
| 실제 blog 역할 4종 호출·launch 기록 | PASS | 수집 low, 나머지 high, fallback false, readOnly 및 도구 제한 |
| 독자 최소 컨텍스트 테스트 | PASS | 초안·독자·선행 지식만 전달, 도구는 yield뿐. Redis 예제의 설치·서버·import·실행 조건 누락 발견 |
| 교정자 의미 보존 테스트 | PASS | 가능성을 개선 완료로 바꾼 교정안을 거부하고 미측정 상태 보존 |
| `node evals/blog-harness/run.mjs --reviews .blog-work/harness-setup/review-results.json` | PASS | 정적 기대 결과 6/6, 실제 Astra/high 검토 결과와 rubric 6/6 일치 |
| `npm run harness` | PASS | content 검증, 기존 테스트 3개, lint, typecheck, 실제 Next 15.5.18 build |
| Git 비공개 제외 | PASS | check-ignore 및 추적 파일 없음 확인 |
| 로컬 배포 결과 검사 | PASS | public 및 `.next/standalone`에 작업 폴더·claims/sources 파일 없음. server/static/standalone/public에서 구축 근거 파일 표식도 발견되지 않음 |
| 원격 배포·Docker 이미지 실행·외부 링크 전체 검사 | SKIP | 배포/외부 접근은 이번 실행 범위가 아님. 실제 업로드 제외까지 검증한 것은 아님 |

정적 평가 PASS는 정상 글은 통과하고 문제 fixture는 예상대로 실패했다는 뜻이다. 버전 불일치·선행 조건 누락·확신 강화는 정적 검사만으로 통과할 수 있고 실제 LLM 검토에서 차단됐다. 평가용 공식 문서·측정 자료는 모두 합성이다. 실제 검토 원문, 입력 digest, 정규화한 결과와 역할 launch 기록은 비공개 구축 폴더에 보존했다.

기존 프로젝트 경고는 남겨 두었다: wiki 링크 확인 안내, `<img>` lint 경고 5건, 복수 lockfile로 인한 Next tracing root 추론 경고이다. 별도 기존 글 checker smoke에서는 cover 참조 누락과 주장 장부 부재를 FAIL로 보고했으며 기존 글은 고치지 않았다. 새 하네스 검사 통과를 기존 게시글 전체의 검증으로 확대하지 않는다.

사용자 명령 실행 smoke도 수행했다. 첫 일반 print 실행은 120초 제한으로 완료하지 못했다. 이후 확장·규칙 자동 발견을 끄고 블로그 스킬 3개와 read/bash만 허용한 새 세션에서 `/blog-check .blog-work/harness-smoke/article.md`가 실제 템플릿 확장 → 스킬 로딩 → checker 실행 → 결과 보고까지 완료했다(83.22초, exit 0, 정적 PASS 5 / FAIL 0 / 선택 검사 SKIP 4). 루트 지침에 따라 이 실행에서도 `npm run harness`가 수행되어 통과했다. 테스트의 approval override는 프로세스 한정이며 전역 설정을 변경하지 않았다.

```sh
omp --no-session --no-title --no-extensions --no-rules \
  --skills blog-evidence,ko-tech-blog,k-humanizer \
  --model openai-codex/gpt-6-astra --thinking high --no-prewalk \
  --tools read,bash --approval-mode yolo --max-time 180 --mode json \
  -p '/blog-check .blog-work/harness-smoke/article.md'
```

위 명령은 내용을 확인한 합성 fixture smoke용이다. 일반 작업에서 무조건 승인 옵션을 사용하지 않는다. capture/draft/review는 실제 등록과 참조를 확인했지만 글을 생성하는 전체 흐름은 실행하지 않았다. 실제 글 작성은 사용자가 자료를 제공하는 별도 작업에서 시작한다. 기존 확장·규칙을 모두 켠 print 실행의 시간 초과 원인은 이번 검증으로 확정하지 못했다.
