---
title: Markdown 작성 워크플로
description: Obsidian에서 작성한 Markdown을 웹페이지 콘텐츠로 사용하기 위한 기본 규칙입니다.
date: 2026-05-04
tags: ["Markdown", "Obsidian", "Writing"]
category: study
cover: /covers/markdown-writing-workflow.jpg
published: false
---

## 기본 규칙

모든 글은 파일 상단에 frontmatter를 둔다. 웹사이트는 이 값을 읽어서 목록, 날짜, 태그를 만든다.

```md
---
title: "글 제목"
description: "짧은 설명"
date: "2026-05-04"
tags: ["Markdown"]
category: "study"
published: true
---
```

## 링크

일반 링크는 표준 Markdown 문법을 사용한다.

위키 링크는 `[[markdown-writing-workflow]]`처럼 쓸 수 있지만, 웹에서는 `/notes/markdown-writing-workflow`로 연결된다.
