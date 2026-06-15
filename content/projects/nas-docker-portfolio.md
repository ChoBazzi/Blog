---
title: NAS Docker 포트폴리오 배포
description: 개인 NAS, Docker, Cloudflare DNS를 이용해 포트폴리오 블로그를 배포하는 프로젝트입니다.
date: 2026-05-04
tags: ["Next.js", "Docker", "NAS", "Cloudflare"]
category: portfolio
cover: /covers/nas-docker-portfolio.jpg
published: false
---

## 문제

포트폴리오와 블로그를 외부 서비스에만 의존하지 않고 직접 배포하고 운영해보고 싶었다.

## 구현

- Next.js App Router로 페이지를 구성한다.
- `content/`에 있는 Markdown 파일을 읽어 블로그와 노트를 만든다.
- Dockerfile은 standalone Next.js 서버를 생성한다.
- NAS 리버스 프록시는 컨테이너의 `3000` 포트로 트래픽을 전달한다.

## 배운 점

개인 웹페이지도 운영 관점에서는 DNS, HTTPS, 리버스 프록시, 컨테이너 재시작 정책을 함께 고려해야 한다.
