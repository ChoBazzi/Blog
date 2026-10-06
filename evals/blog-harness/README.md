# 근거 중심 블로그 하네스 평가

이 디렉터리는 게시물이 아닌 **합성 평가 자료**이다. `content/`에 복사하거나 게시하지 않는다. 신규 의존성, 전역 설정, `package.json`, 기존 `scripts/harness.mjs` 변경은 없다.

## 정적 검사 CLI

저장소 루트에서 실행하는 명령이다.

```sh
node scripts/blog-check.mjs <path-or-slug> [--before path] [--build] [--links]
node scripts/blog-check.mjs --help
```

- 경로는 현재 작업 디렉터리 기준이다. slug는 `content/blog`, `content/notes`, `content/projects`에서 유일해야 한다. 충돌 시 명시적인 `.md` 경로를 사용한다.
- 기본 동작은 읽기 전용이다. 글, 주장 장부, 근거, URL, `published` 값을 수정하지 않는다. 기본 네트워크 요청도 없다.
- 출력은 색상·스피너 없는 JSONL이다. 각 행은 `status` (`PASS`, `FAIL`, `SKIP`), `target`, `check`, `reason`, `mandatory`를 가진다. `reason`은 실패 원인과 다음 조치를 설명한다. 이 형식은 TTY와 파이프에서 같다.
- 종료 코드 `0`은 **요청한 정적 검사** 통과이다. `1`은 필수 검사의 실패 또는 수행 불가이다. `2`는 잘못된 CLI 사용이다. 옵션 미요청으로 생긴 `mandatory: false`인 `SKIP`은 종료 코드를 올리지 않는다.
- `semantic-review`는 항상 별도 검토가 필요하다는 `SKIP`이다. 정적 검사 종료 코드 `0`을 출판 승인이나 사실 검증으로 해석하면 안 된다.

### 검사 범위와 한계

| 검사 | 동작 |
| --- | --- |
| Frontmatter | 기존 `validate-content.mjs`의 필수 `title`, `description`, `date`, `tags`, `published`와 동일한 단일 행 파싱·형식 기준이다. 날짜의 달력 유효성이나 YAML 전체 문법을 검증하는 도구가 아니다. |
| 로컬 링크·이미지 | Markdown 인라인 링크, 이미지, `cover`, `/posts`·`/blog`·`/notes`·`/projects` 글 경로, 렌더러의 2·3단계 제목 anchor, `/notes/{slug}`로 변환되는 wiki 링크의 대상을 확인한다. 공개 글 링크의 `published`도 확인한다. 상대 경로는 문서 파일 기준이다. 실제 게시용 이미지는 `/public`에 대응하는 `/...` URL을 사용하고 상대 경로의 브라우저 해석은 별도 렌더링 검토한다. |
| 미지원 링크 문법 | Obsidian 임베드 `![[...]]`와 reference-style 링크 정의는 현재 렌더러에서 지원하지 않으므로 실패한다. 임의 HTML 전체를 분석하는 파서는 아니다. |
| 미완성 | `TODO`, `TBD`, `FIXME`, `작성 예정`, `추후 작성`, `[확인 필요]`, `[근거 필요]`, `(URL)` 자리표시자와 닫히지 않은 삼중 백틱을 차단한다. 코드 예제의 의도적인 표식도 사람이 검토해야 한다. |
| 주장 장부 | 필수 열, 고유 ID, 상태·우선순위, 근거 링크와 로컬 파일 존재를 확인한다. 핵심 주장의 `미확인`·`근거와 충돌`은 차단한다. 장부 밖 누락 주장이나 거짓 상태 선언은 의미 검토 대상이다. |
| 비밀 의심 | 글과 장부의 일반적인 키·토큰·개인키·자격 증명 URL 패턴을 찾는다. 줄 번호만 출력하고 값은 재출력하지 않는다. 탐지 없음이 비밀 없음의 증명은 아니다. 근거 파일 전체를 재귀 스캔하는 보안 도구도 아니다. |
| 편집 비교 | `--before`의 코드, 숫자, 버전, URL, Markdown 참조가 바뀌면 `protected-diff: FAIL`과 사람 검토 요구를 출력한다. 값은 출력하지 않는다. 근거와 원본 diff를 검토하고 별도 `review.md`에 판단을 기록한다. 검토를 위장하는 자동 승인 옵션은 없다. |
| 의미 변화 | 확신 강화, 수치의 실제 의미, 버전 적용 가능성, 튜토리얼 전제, 인과관계, 근거의 신뢰성은 정규식으로 증명할 수 없다. 코드·숫자·URL이 동일한 편집도 의미가 달라질 수 있다. |

`--before` 파일이 없거나 읽을 수 없으면 필수 `SKIP`과 종료 코드 `1`이다. 편집 작업에서는 비교 파일을 저장소 밖에 먼저 보존해야 한다.

### 주장 장부 계약

대상 `article.md`에 대해 먼저 `article.claims.md`, 없으면 같은 디렉터리의 `claims.md`를 읽는다. 여러 글이 있는 컬렉션에서는 글별 `<slug>.claims.md`를 사용하고, 단일 작업 자료 묶음에서는 `claims.md`를 사용한다. 본문 frontmatter에 장부를 삽입하거나 동일한 주장을 JSON으로 이중 관리하지 않는다.

```markdown
| 주장 ID | 본문 위치 | 주장 | 유형 | 근거 위치·URL·버전 | 근거 상태 | 불확실성·한계 | 본문 처리 | 필수 여부 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C1 | 결과 문단 | 관측 범위의 결과이다 | 관측 | [기록](measurement.txt) L1-L4, fixture-v1 | 실행 검증 | 단일 합성 관측이다 | 범위를 한정한다 | 핵심 |
```

- 모든 열은 비어 있으면 안 된다. 셀 내부 `|`는 이 간단한 표 파서에서 지원하지 않으므로 문장으로 풀어 쓴다.
- `필수 여부`: `핵심`, `보조` 중 하나이다.
- `근거 상태`: `작성자 진술`, `원문 확인`, `실행 검증`, `미확인`, `근거와 충돌` 중 하나이다. 이는 **작성자의 상태 선언**이며 checker가 해당 실행·확인을 했다는 뜻이 아니다.
- `미확인` 외의 행은 근거 열에 `[설명](파일 또는 URL)`이 필요하다. 로컬 근거는 장부 기준 경로이며 줄·절·버전 등의 위치를 함께 쓴다. 링크가 존재한다고 주장을 뒷받침한다고 판정하지 않는다.
- `핵심`이면서 `미확인`·`근거와 충돌`이면 `본문 처리`를 삭제라고 써도 차단한다. 실제 본문 주장을 제거하거나 근거를 보완하고, 삭제 이력은 `review.md`로 옮겨 활성 장부를 정리한다.
- 출처를 읽을 수 없다는 이유로 제한된 URL을 삭제하거나 숫자·성과·실행 결과를 만들어 넣으면 안 된다.

### 외부 링크는 명시적 선택이다

`--links`를 지정한 경우에만 credential-free HTTPS `HEAD` 요청을 한다. 요청당 제한은 8초이며 리디렉션은 따라가지 않는다. 쿼리, 사용자 정보, 비기본 포트가 있는 URL은 요청하지 않는다. 임의 내부 호스트로의 요청을 피하기 위해 다음 **정확한 호스트**만 허용한다. 하위 도메인을 자동 허용하지 않는다.

`nextjs.org`, `react.dev`, `nodejs.org`, `typescriptlang.org`, `developer.mozilla.org`, `docs.github.com`, `github.com`, `docs.docker.com`, `docs.python.org`

허용 목록 밖 주소, 401·403·405·429, 리디렉션, 네트워크 실패는 필수 `SKIP`이다. 404 등 다른 실패 응답은 `FAIL`이다. 모두 종료 코드 `1`이며 URL은 보존한다. 일반 브라우저에서 권한을 가진 사람이 확인하고 제한 사유를 기록한다. `PASS`는 접근 가능 여부만 뜻한다. 내용의 사실성이나 버전 적합성은 별도 검토이다. 비밀 의심이 있으면 모든 외부 요청을 차단한다.

### 최종 빌드

`--build`는 최종 검증을 요청하는 옵션이다. 실행 직전에 `package.json`을 읽어 `build`가 기존의 `next build`이고 `prebuild`·`postbuild` hook이 없는지 확인한다. 다르면 자동 실행하지 않고 필수 `SKIP`을 반환한다. 의존성이 없을 때도 필수 `SKIP`이며 `npm ci` 후 재실행을 안내한다. 허용된 경우에만 `shell: false`로 기존 `npm run build`를 실행한다.

Next 빌드는 `.next`, `next-env.d.ts`, TypeScript 캐시 등 생성물을 쓸 수 있으므로 옵션 없이 실행한 읽기 전용 검사와 다르다. Next 설정·빌드 단계에서 호출하는 코드가 바뀌었다면 먼저 부작용을 검토해야 한다. 하위 빌드 출력은 비밀 값 노출을 피하려고 전달하지 않는다. 실패 원문이 필요하면 로컬에서 직접 `npm run build`를 실행한다. 누락 의존성이나 실패를 성공처럼 처리하지 않는다. 기존 `npm run harness`가 수행한 실제 `npm run build` 결과도 최종 검증 기록으로 사용할 수 있다. 같은 변경에 빌드를 중복 실행할 필요는 없다.

## 합성 사례와 기대 결과

`cases.json`은 가상 데이터, 원문, 주장 장부, 근거 자료, 별도의 기대 판정을 가진다. 존재하지 않는 실서비스 측정이나 실제 공식 문서 조회를 한 것처럼 주장하지 않는다.

| ID | 정적 checker 예상 | 의미 검토 예상 | 실제 검토에서 확인할 내용 |
| --- | --- | --- | --- |
| `good-evidence` | exit 0 | PASS | 합성 단일 관측의 수치·범위·한계가 근거와 일치한다. 실제 운영 성과로 확대하지 않는다. |
| `unsupported-metric` | exit 1, 핵심 미확인 | BLOCK | 계획 메모뿐인데 운영 성과를 수치로 단정했다. 수치를 만들지 말고 근거 요청 또는 삭제가 필요하다. |
| `version-mismatch` | exit 0 | BLOCK | 글의 가상 라이브러리 2.0과 원문의 3.0 동작이 다르다. 파일 존재와 원문 확인 표기만으로 승인하면 안 된다. |
| `missing-prerequisites` | exit 0 | BLOCK | 설치·런타임·DB·환경변수·마이그레이션 전제가 빠져 절차를 재현할 수 없다. |
| `certainty-strengthened` | exit 0, 보호 토큰 동일 | BLOCK | 편집 전 가능성을 편집 후 유일 원인 입증으로 강화했다. 원문·근거와 의미 비교가 필요하다. |
| `incomplete-secret` | exit 1, 미완성+비밀 의심 | BLOCK | 미완성과 가짜 자격 증명 패턴을 모두 차단하고 비밀 모양 값은 재인용하지 않는다. |

### 정적 평가 실행

```sh
node evals/blog-harness/run.mjs --static
```

임시 디렉터리에 합성 입력만 만들고 실제 checker를 실행한다. 각 checker의 종료 코드와 필수 결과를 비교하며 입력 불변성과 비밀 모양 값의 비노출도 확인한다. 임시 파일은 제거한다. 네트워크, 프로젝트 빌드, 본문 작성·게시는 없다. 정상 실행은 여섯 정적 사례의 `PASS`, 의미 검토의 명시적 `SKIP`, 종료 코드 `0`이다. **의미 판정 여섯 개가 통과했다는 결과가 아니다.**

### 실제 LLM 검토 평가

```sh
node evals/blog-harness/run.mjs --list
node evals/blog-harness/run.mjs --case good-evidence
node evals/blog-harness/run.mjs --reviews /tmp/blog-review-results.json
```

1. 각 `--case <id>`가 출력한 packet을 별도 LLM reviewer에게 전달한다. packet에는 입력 파일과 SHA-256 `inputDigest`가 있고 정답은 없다. 기술 검토자는 자료·버전·수치를, 독자 검토자는 재현 전제를, 편집 검토자는 before/after의 의미 보존을 직접 확인한다.
2. 실제 응답을 아래 형식의 JSON 배열로 저장한다. 실행하지 않은 reviewer를 기입하거나 예상 정답을 복사해 실제 결과로 둔갑시키면 안 된다. 원본 응답도 검토 기록으로 보존한다.
3. `--reviews`가 현재 packet의 digest, reviewer·시각, 근거 위치, 예상 결정과 발견 유형을 비교한다. 각 사례는 정확히 한 개의 결과가 필요하다.
4. runner는 인용의 실제 함의나 reviewer의 진위를 자동 증명하지 않는다. `PASS`는 제출된 실제 검토가 명시적 rubric에 맞는다는 뜻이며, 근거가 결론을 지지하는지는 사람이 원본 응답과 함께 확인한다.

review artifact의 항목 계약은 다음과 같다. 아래는 스키마 설명이며 실행 결과 파일이 아니다.

```text
id: --list에 있는 사례 ID
inputDigest: --case가 출력한 입력 SHA-256
reviewer: 실제 model/agent ID 또는 사람 이름
reviewedAt: 실제 검토 시각 (ISO 8601)
decision: PASS 또는 BLOCK
summary: 실제 판단과 한계 요약
findings: [
  {
    issue: unsupported-metric | version-mismatch | missing-prerequisites |
           certainty-strengthened | incomplete | secret-suspicion,
    rationale: 근거와 본문을 비교한 실제 이유 및 수정 방향,
    evidence: [{file: packet 안 파일명, location: 줄 또는 절}]
  }
]
```

정상 사례는 `findings: []`이다. 차단 사례는 해당 발견마다 본문·원문 등 구체적인 근거 위치를 든다. `--reviews` 파일이 없거나 실행 자료가 빠졌으면 `SKIP`과 종료 코드 `1`이다. 인자 없는 runner도 정적 검사 후 의미 검토 수행 불가를 알리고 `1`로 끝난다. 실제 모델을 호출하지 않는 정규식 검사로 의미 평가 성공을 흉내 내지 않는다.

## 기존 워크플로와 통합

1. 조사·초안·검토 자료는 저장소 밖 작업 디렉터리 또는 별도 명시적 자료 공간에서 관리한다. 실제 글 작성은 별도 요청이 있을 때만 한다.
2. 작업별 `article.md`와 `claims.md`를 준비한 뒤 checker를 실행한다. 편집은 보존한 원문으로 `--before`를 추가한다.
3. 기술·독자·편집 reviewer가 의미 검사 `SKIP`을 해소하고 근거와 사람 판단을 `review.md`에 기록한다. checker의 비밀 의심, 필수 수행 불가, 보호 토큰 변경을 성공으로 덮어쓰지 않는다.
4. 모든 변경이 합쳐진 뒤 위 정적 평가를 한 번 실행한다. 기존 `npm run harness`는 그대로 유지하고 통합 담당자가 한 번 실행한다. 본문 변경이 있으면 기존 `npm run validate:content`도 적용한다.
5. 최종 검증이 요청되면 실제 `npm run build` 결과와 제한 사항을 기록한다. 이 평가 디렉터리나 checker가 자동 게시·커밋·전역 설정 변경을 수행하지 않는다.
