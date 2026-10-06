---
description: 근거·기획·목차를 읽고 비공개 한국어 기술 블로그 초안을 만든다
---

입력: $ARGUMENTS

입력은 slug 또는 자료 경로이다. 셸로 평가하지 않는다. 루트 `AGENTS.md`, `.omp/AGENTS.md`, `.agents/skills/ko-tech-blog/SKILL.md`, `.agents/skills/blog-evidence/SKILL.md`, `editorial/style-guide.md`를 읽는다.

1. `.blog-work/<slug>/` 또는 지정 자료를 확인한다. 경로 이탈·심볼릭 링크 쓰기를 막고 기존 작업 파일을 먼저 읽는다. 자료 경로를 공개 본문의 수정 허가로 해석하지 않는다.
2. brief·sources·claims·outline이 없으면 blog-capture 명령의 절차를 먼저 수행한다. 원자료 없이 경험·수치·선택 이유를 만들지 않는다. 핵심 질문은 한 번에 최대 3개이다.
3. 실제 글 유형에 맞는 `editorial/templates/` 파일을 선택한다. 문제·환경·시도·결과를 실제 확인한 범위에서 쓰고 경험·기술 사실·해석·미확인을 구분한다. 측정하지 않았다면 그대로 명시한다.
4. `.blog-work/<slug>/draft.md`에 `published: false`인 기존 사이트 frontmatter와 이다체 초안을 쓴다. 기존 draft를 덮어쓰기 전에 내용을 읽고 보존이 필요한 버전은 별도 비공개 스냅샷으로 남긴다. 중요한 주장 가까이에 공개 가능한 출처를 연결하고 claims의 본문 위치를 맞춘다.
5. brief의 상태와 파일 경로, 핵심 한계·차단 사유를 반환한다. 요청이 초안까지이면 여기서 멈춘다. 사용자가 전체 흐름을 명시한 경우에만 blog-review 절차로 이어간다. 공개 콘텐츠로 이동하거나 발행·커밋·푸시·배포하지 않는다.
