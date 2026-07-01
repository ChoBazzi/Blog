---
title: NAS Docker 포트폴리오 배포
description: 개인 포트폴리오 블로그의 공개 속도와 직접 운영 학습 문제를 나누기 위해 Vercel 배포와 NAS Docker 실험을 분리한 기록입니다.
date: 2026-05-04
tags: ["Next.js", "Docker", "NAS", "Cloudflare"]
category: portfolio
cover: /covers/nas-docker-portfolio.jpg
published: false
---

## 프로젝트 개요

이 글은 개인 포트폴리오 블로그를 만들면서 공개 배포와 직접 운영 실험을 어떻게 나눴는지 정리한 기록입니다.

- 구분: 개인 프로젝트
- 역할: Next.js 앱 구성, Markdown 콘텐츠 구조 설계, Docker 배포 실험
- 현재 공개 배포: Vercel
- 운영 실험: Docker, NAS reverse proxy, Cloudflare DNS

## 문제

포트폴리오와 블로그는 빠르게 공개되어야 했지만, 동시에 Docker와 NAS 기반 운영 흐름도 직접 이해하고 싶었습니다. 처음부터 NAS 운영만 선택하면 배포와 네트워크 설정에 시간이 오래 걸리고, 글을 공개하는 목적이 늦어질 수 있었습니다.

그래서 공개 배포와 운영 학습을 분리했습니다. 사용자가 보는 블로그는 Vercel로 안정적으로 배포하고, NAS Docker 배포는 같은 애플리케이션을 다른 환경에서 실행해보는 실험으로 남겼습니다.

## 맡은 역할과 범위

이 프로젝트는 개인 프로젝트이므로 요구사항 정리, 콘텐츠 구조, Next.js 구현, 배포 방식 비교를 모두 직접 진행했습니다. 다만 NAS 관리자 화면, SSH, Docker 관리자 UI를 외부에 노출하는 구성은 범위에서 제외했습니다.

목표는 복잡한 CMS를 붙이는 것이 아니라, Obsidian에서 작성한 Markdown을 그대로 읽어 정적 페이지로 만드는 것이었습니다.

## 구현

- Next.js App Router로 페이지를 구성한다.
- `content/`에 있는 Markdown 파일을 읽어 블로그와 노트를 만든다.
- Dockerfile은 standalone Next.js 서버를 생성한다.
- NAS 리버스 프록시는 컨테이너의 `3000` 포트로 트래픽을 전달한다.

```text
Obsidian Markdown
  -> content/
  -> Next.js static build
  -> Vercel public deploy
  -> Docker/NAS deploy experiment
```

## 판단과 트레이드오프

Vercel은 정적 페이지 배포가 빠르고 HTTPS, CDN, 빌드 로그를 바로 사용할 수 있다는 장점이 있습니다. 대신 NAS 운영 경험을 직접 쌓기에는 추상화가 많습니다. 반대로 NAS Docker 배포는 reverse proxy, 포트, 컨테이너 재시작 정책을 직접 다룰 수 있지만, 공개 포트와 관리자 접근 통제를 더 신중하게 설계해야 합니다.

그래서 현재 블로그의 공개 경로는 Vercel을 우선하고, NAS 배포는 운영 구조를 이해하기 위한 별도 경로로 두었습니다. 이 선택은 블로그 공개 속도를 유지하면서도 Docker 기반 운영 학습을 포기하지 않는 절충안입니다.

## 배운 점

개인 웹페이지도 운영 관점에서는 DNS, HTTPS, 리버스 프록시, 컨테이너 재시작 정책을 함께 고려해야 합니다. 특히 공개 서비스와 관리자 도구는 분리해야 하며, 포트 하나를 여는 결정도 배포 편의성과 보안 사이의 트레이드오프를 만든다는 점을 확인했습니다.

다음 단계에서는 NAS 배포를 실제 공개 경로로 전환하기보다, Vercel 배포를 유지한 상태에서 Docker 이미지 빌드와 reverse proxy 설정을 문서화하는 방향이 더 적절하다고 판단했습니다.
