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

개인 포트폴리오 블로그는 Vercel로 공개하고, 같은 앱을 Docker와 NAS에서 실행하는 실험을 별도로 진행했다.

- 구분: 개인 프로젝트
- 역할: Next.js 앱 구성, Markdown 콘텐츠 구조 설계, Docker 배포 실험
- 현재 공개 배포: Vercel
- 운영 실험: Docker, NAS reverse proxy, Cloudflare DNS

## 문제

블로그를 빠르게 공개하고 싶었지만 Docker와 NAS 운영도 직접 익히고 싶었다. 처음부터 NAS로만 배포하면 네트워크 설정에 시간을 쓰느라 글 공개가 늦어질 수 있었다.

그래서 공개 서비스는 Vercel에 두고, NAS Docker 배포는 같은 앱을 다른 환경에서 운영해보는 실험으로 나눴다.

## 맡은 역할과 범위

요구사항 정리, 콘텐츠 구조, Next.js 구현, 배포 방식 비교를 직접 진행했다. NAS 관리자 화면, SSH, Docker 관리자 UI를 외부에 노출하는 구성은 제외했다.

CMS를 추가하지 않고 Obsidian에서 작성한 Markdown을 그대로 읽어 정적 페이지로 만드는 것이 목표였다.

## 구현

- Next.js App Router로 페이지를 구성한다.
- `content/`에 있는 Markdown 파일을 읽어 블로그와 노트를 만든다.
- Dockerfile은 standalone Next.js 서버를 생성한다.
- NAS 리버스 프록시는 컨테이너의 `3000` 포트로 트래픽을 전달한다.

![공개 배포와 NAS 운영 실험을 별도 경로로](/diagrams/blog-publishing.svg)

## 판단과 트레이드오프

Vercel은 정적 페이지를 빠르게 배포하고 HTTPS, CDN, 빌드 로그를 바로 사용할 수 있다는 장점이 있다. NAS Docker 배포에서는 reverse proxy, 포트, 컨테이너 재시작 정책을 직접 다룰 수 있다. 그만큼 운영을 익힐 수 있지만 공개 포트와 관리자 접근 통제도 직접 설계해야 한다.

## 배운 점

개인 웹페이지라도 직접 운영하려면 DNS, HTTPS, 리버스 프록시, 컨테이너 재시작 정책을 함께 살펴야 했다. 특히 서비스를 공개하는 포트와 관리자 도구에 접근하는 경로는 분리해야 한다.

다음에는 Vercel 공개 배포를 유지하면서 Docker 이미지 빌드와 reverse proxy 설정을 문서화하려 한다. NAS를 실제 공개 경로로 전환하는 일은 이번 범위에 포함하지 않는다.
