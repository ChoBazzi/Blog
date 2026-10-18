---
title: Django 기반 크롤링 서버와 카카오톡 알림 봇
description: 게임 커뮤니티 공지 누락 문제를 해결하기 위해 Django, Celery, Redis 기반 알림 시스템을 구축한 개인 프로젝트 회고입니다.
date: 2026-05-01
tags: ["Django", "Celery", "Redis", "MySQL", "Nginx"]
category: project
cover: /covers/2026-05-09-django-crawling-kakaotalk-bot.jpg
published: true
---

## 프로젝트 개요

게임 커뮤니티의 새 공지를 확인해 카카오톡 채팅방에 알림을 보내는 개인 자동화 시스템이다.

- 기간: 2022-02 ~ 2022-08
- 구분: 개인 프로젝트
- 역할: 기획, 서버 구축, 백엔드 개발, 배포, 최적화
- 성과: 비동기 처리 도입을 통한 시스템 안정화

![Django 크롤링 서버 화면](/projects/django-crawling-kakaotalk-bot/portfolio.jpg)

## 문제

게임 길드원들이 중요한 공지를 놓치는 일이 반복됐다. 공지는 웹 커뮤니티에 올라왔지만, 직접 사이트를 열어 확인해야 했다.

매번 공지를 찾아보는 대신 새 글을 자동으로 감지해 채팅방으로 전달하도록 만들기로 했다.

## 구현

백엔드는 Python, Django, Django REST Framework로 구성했다. 공지 수집, 저장, 알림 전달을 서버에서 처리했다.

처음에는 공지 확인과 알림을 동기 방식으로 처리했다. 크롤링과 메시지 전송이 요청 흐름에 묶이면서 응답성과 안정성에 한계가 생겼다. 이후 Celery와 Redis를 도입해 주기적인 크롤링과 알림 전송을 비동기 작업으로 분리했다.

데이터는 MySQL에 저장했고, CentOS 환경에서 Nginx와 uWSGI를 직접 설정했다. 개인 NAS에 서버를 구성하면서 요청이 Nginx, uWSGI, Django 애플리케이션으로 전달되는 흐름을 확인했다.

![크롤링 서버 상세 화면](/projects/django-crawling-kakaotalk-bot/portfolio-2.jpg)

![카카오톡 알림 봇 화면](/projects/django-crawling-kakaotalk-bot/portfolio-3.jpg)

## 배운 점

24시간 동작해야 하는 알림 서버에서는 API 외에도 작업 큐, 재시도, 서버 프로세스, 웹 서버 설정, 데이터베이스를 함께 고려해야 했다.

Celery와 Redis로 작업을 나눈 뒤에는 같은 크롤링·알림 기능이라도 응답과 장애를 다루는 방식이 달라졌다. 이후에는 기능을 구현할 때 배포 환경과 운영 중 문제가 생길 지점도 함께 살피게 됐다.
