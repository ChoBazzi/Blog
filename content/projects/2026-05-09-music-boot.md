---
title: 음원 스트리밍 서비스 Music Boot
description: Spring Boot 기반 음원 스트리밍 서비스에서 이용권과 결제 시스템을 담당하며 배운 백엔드 협업 회고입니다.
date: 2026-04-30
tags: ["Spring Boot", "Java", "Oracle", "JPA", "KakaoPay"]
category: project
cover: /covers/2026-05-09-music-boot.jpg
published: true
---

## 프로젝트 개요

Music Boot는 Java와 Spring Boot를 학습하고 Git 기반 팀 협업을 경험하기 위해 만든 음원 스트리밍 웹 서비스이다.

- 기간: 2021-07 ~ 2021-07
- 구분: 팀 프로젝트, 4인
- 역할: 이용권 서비스 및 결제 시스템 백엔드 개발
- 성과: Spring Boot 기반 백엔드 개발과 Git 협업 경험 확보
- 링크: [GitHub](https://github.com/ChoBazzi/team6_v2sbm3c_git)

![Music Boot 화면](/projects/music-boot/screen-1.jpg)

## 문제

4명이 같은 코드베이스에서 작업하며 기능별로 역할을 나눴다. 혼자 구현하던 때와 달리 팀원의 변경사항을 함께 고려해야 했다.

나는 이용권과 결제 파트를 맡았다. 사용자가 이용권을 구매하면 구독 상태를 바꾸고, 그 상태에 따라 음원 접근 권한을 제어하는 것이 핵심이었다.

## 구현

백엔드는 Java, Spring Boot, Spring Security, JPA를 사용했다. 데이터베이스는 Oracle, 빌드 도구는 Gradle을 사용했다.

이용권 DB 설계, 결제 API 연동, 사용자 구독 상태 관리를 담당했다. KakaoPay API로 결제를 요청하고 승인 결과를 받아 서비스 내부의 이용권 상태에 반영했다.

구독 상태에 따라 음원 접근 권한이 달라지므로 인증·권한 처리와도 연결해야 했다.

![Music Boot 상세 화면](/projects/music-boot/screen-2.jpg)

## 배운 점

결제 상태가 바뀌면 이용권과 음원 접근 권한도 영향을 받는다. 이 흐름을 다루며 컨트롤러, 서비스, 데이터 모델의 책임을 나눌 필요를 느꼈다.

외부 결제 API의 정상 응답뿐 아니라 예외가 이용권 상태와 권한에 미칠 영향도 고려해야 했다. 작은 예외가 사용자의 음원 이용을 막을 수 있기 때문이다.

Git 기반 협업에서는 역할을 나누는 것에 더해 변경사항을 팀원에게 공유하는 일도 중요했다.
