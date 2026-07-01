---
title: "개인 포트폴리오 블로그를 시작하며"
description: "Markdown 기반으로 프로젝트 기록과 회고를 쌓는 개인 웹페이지를 만들기로 한 이유를 정리합니다."
date: "2026-05-04"
tags: ["Retrospective", "Portfolio", "Docker"]
category: "retrospective"
cover: "/covers/2026-05-04-first-retrospective.jpg"
published: true
---

## 배경

신입 개발자로 지원하기 위해 프로젝트 결과물뿐 아니라 공부 과정과 회고를 함께 보여줄 수 있는 공간이 필요했다.

## 선택한 구조

- 글 작성은 Obsidian에서 Markdown으로 관리한다.
- 웹은 Next.js가 `content/` 폴더를 읽어 정적 페이지로 만든다.
- 현재 공개 배포는 Vercel을 사용한다.
- Docker와 NAS 배포는 운영 환경을 직접 이해하기 위한 별도 실험으로 남겨둔다.

## 기대하는 효과

코드와 기록이 한 저장소 안에 남는다. 단순히 완성된 화면만 보여주는 대신 문제를 어떻게 정리하고 개선했는지 설명할 수 있다.
