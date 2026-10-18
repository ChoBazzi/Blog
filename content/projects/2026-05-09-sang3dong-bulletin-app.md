---
title: 상3동성당 주보앱 개발
description: 종이 주보의 정보 전달 문제를 해결하기 위해 React Native 앱을 기획, 개발, 배포, 운영한 개인 프로젝트 회고입니다.
date: 2026-05-09
tags: ["React Native", "Django", "Python", "Mobile"]
category: project
cover: "/covers/2026-05-09-sang3dong-bulletin-app.jpg"
published: true
---

## 프로젝트 개요

상3동성당 주보앱은 매주 배포되는 종이 주보를 모바일에서 확인할 수 있도록 만든 개인 프로젝트이다.

- 기간: 2023-08 ~ 2023-10
- 구분: 개인 프로젝트
- 역할: 기획, 백엔드 개발, 모바일 앱 개발, 배포, 운영
- 성과: Google Play Store 출시 및 실사용자 130명 확보
- 링크: [Play Store](https://play.google.com/store/apps/details?id=com.sang3dong)

![상3동성당 주보앱 화면](/projects/sang3dong-bulletin-app/portfolio.jpg)

## 문제

성당에서는 매주 종이 주보로 소식을 전달했다. 인쇄 비용과 자원 낭비가 있었고, 특히 젊은 교우들은 주보를 잘 챙겨 보지 않아 소식을 놓치기도 했다.

주보를 받거나 보관하지 않아도 스마트폰에서 성당 소식을 확인할 수 있도록 앱을 만들기 시작했다.

## 구현

프론트엔드는 React Native와 JavaScript로 구현했다. PDF 주보를 보여주기 위해 React-Native-PDF를 사용했고, 앱을 열면 최신 주보를 빠르게 확인할 수 있도록 했다.

백엔드는 Python과 Django로 구성했다. 주보 데이터를 관리하고 앱에 필요한 형태로 제공하는 역할을 맡겼다. 일부 데이터 수집과 정리에는 Cheerio를 활용했다.

혼자 진행한 프로젝트여서 배포와 운영도 직접 맡았다. Google Play Store 등록을 위해 앱을 패키징하고 심사를 거쳤으며, 배포 후에는 사용자 피드백을 확인했다.

## 배운 점

사용자로부터 "덕분에 편리하다"는 피드백을 받았다. 주보를 스마트폰으로 확인하게 만든 작은 변화가 실제 사용자에게 도움이 된다는 것을 느꼈다.

혼자 개발할 때는 기술 선택과 일정뿐 아니라 배포 후 피드백까지 직접 챙겨야 했다. 이후 프로젝트에서도 기능 구현과 함께 사용자가 접근하는 흐름, 배포 뒤 운영할 방법을 살피게 됐다.
