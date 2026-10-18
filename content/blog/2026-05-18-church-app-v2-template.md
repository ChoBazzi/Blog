---
title: 성당 앱 v2 업그레이드 프로젝트
description: 상3동성당 주보앱을 성당 생활 허브로 확장하기 위한 v2 업그레이드 프로젝트 기록입니다.
date: 2026-05-18
tags: ["React Native", "Spring Boot", "PostgreSQL", "Mobile", "Church App"]
category: study
cover: /covers/2026-05-09-sang3dong-bulletin-app.jpg
published: true
---

## 프로젝트 개요

기존 상3동성당 주보앱을 v2로 업그레이드하고 있다. v1은 종이 주보를 모바일에서 확인하는 앱이었다. v2에서는 주보에 더해 전례력, 미사 정보, 본당 소식을 한곳에서 제공하려 한다. 아래는 이를 위한 목표와 설계 초안이며, 구현·출시 결과를 정리한 글은 아니다.

- 기간: 진행 중
- 구분: 개인 프로젝트
- 역할: 기획, 모바일 앱 개발, 백엔드 개발, 배포, 운영
- 주요 기술: React Native, Spring Boot, PostgreSQL, Docker

## v1에서 확인한 문제

v1에서는 최신 주보를 빠르게 확인할 수 있었지만, 그 밖의 정보는 보기 어려웠다. 미사 시간, 전례력, 본당 일정도 앱에서 제공하려면 콘텐츠를 갱신하고 보여주는 방식을 다시 정해야 했다.

- 주보 외 핵심 정보 접근성이 낮음
- 콘텐츠 업데이트 흐름이 운영자 친화적이지 않음
- 모바일 화면 구조가 장기 확장에 적합하지 않음
- 공지, 일정, 전례 데이터의 출처와 갱신 정책이 명확하지 않음

## v2 목표

연령대가 높은 사용자도 헤매지 않도록 홈에서 핵심 정보를 바로 보여주고, 각 기능까지의 이동 경로를 짧게 잡으려 한다.

- 홈에서 오늘 필요한 정보를 먼저 보여주기
- 주보, 전례력, 미사, 더보기 중심의 단순한 정보 구조 유지
- 콘텐츠 관리와 앱 표시 로직 분리
- 서버 API 기반으로 데이터 갱신 흐름 안정화
- v1 사용 경험을 해치지 않는 단계적 마이그레이션

## 핵심 사용자 흐름

### 홈

앱을 열면 먼저 확인할 정보를 홈에 모은다.

- 최신 주보 바로가기
- 오늘의 전례 정보
- 다음 미사 시간
- 중요 공지

### 주보

주보에 쉽게 접근할 수 있도록 하면서 지난 주보를 찾고 보관하는 기능을 개선하려 한다.

- 최신 주보 보기
- 지난 주보 목록
- PDF 또는 이미지 기반 열람
- 다운로드 실패, 로딩 실패 상태 처리

### 전례력

전례력은 날짜별 정보이므로 오늘 화면과 월별 목록을 나눈다.

- 오늘의 전례
- 월별 전례 목록
- 축일, 기념일, 전례 색상
- 데이터 출처와 갱신 주기

### 미사

미사 시간은 평소 일정과 임시 변경을 구분해 보여준다.

- 평일 미사 시간
- 주일 미사 시간
- 특별 미사와 변경 공지
- 본당 사정에 따른 임시 변경 안내

### 더보기

더보기에는 본당 정보와 앱 설정을 모은다.

- 본당 소개
- 문의 정보
- 앱 버전 정보
- 알림 설정

## 기능 범위

### 이번 버전에 포함할 것

- 홈 화면 개편
- 주보 목록과 상세 보기 정리
- 전례력 화면 추가
- 미사 정보 화면 추가
- 서버 API 기반 콘텐츠 조회
- 운영자가 관리하기 쉬운 데이터 구조 설계

### 이번 버전에서 제외할 것

- 사용자 계정
- 게시판
- 채팅
- 헌금, 결제, 개인정보가 필요한 기능
- 관리자 페이지의 과도한 기능 확장

## 데이터 설계 메모

앱에서 외부 페이지를 직접 파싱하는 대신, 백엔드가 콘텐츠를 관리하거나 캐싱한 뒤 앱에 제공하는 방향이다.

- `bulletins`: 주보 제목, 발행일, 파일 경로, 공개 여부
- `announcements`: 공지 제목, 본문, 중요도, 게시 기간
- `mass_schedules`: 미사 유형, 요일, 시간, 예외 일정
- `liturgical_days`: 날짜, 전례명, 등급, 전례 색상
- `app_versions`: 최소 지원 버전, 업데이트 안내

## Spring 백엔드 보강 설계

v1은 최신 주보를 보여주는 기능이 중심이어서 백엔드 역할이 비교적 단순했다. v2에서는 주보, 공지, 전례력, 미사 시간, 앱 버전 정책을 함께 다뤄야 한다. 이 데이터를 앱에 직접 넣으면 정보가 바뀔 때마다 앱을 업데이트해야 하고, 외부 페이지 구조가 바뀌면 앱도 직접 영향을 받는다.

그래서 Spring Boot 백엔드에서 콘텐츠를 관리하려 한다. 앱은 화면 표시를 맡고, 서버는 콘텐츠 정규화, 공개 상태, 파일 메타데이터와 조회 API를 담당하도록 나눴다.

![성당 앱 v2: 콘텐츠와 파일의 책임 분리](/diagrams/church-v2.svg)

계획한 Spring 백엔드의 책임은 다음과 같다.

| 책임 | 내용 |
|---|---|
| 콘텐츠 소유 | 주보, 공지, 미사 시간, 전례력 데이터를 앱과 분리해 관리 |
| 공개 상태 관리 | `draft`, `published`, `archived` 상태와 게시 기간 관리 |
| 파일 메타데이터 관리 | PDF나 이미지 파일 자체는 저장소에 두고, DB에는 경로와 크기, 타입, 공개 여부 저장 |
| 모바일 API 제공 | 홈, 주보, 전례력, 미사, 더보기 화면에 맞춘 읽기 전용 API 제공 |
| 운영 안정성 | 외부 데이터 수집 실패나 파일 누락을 앱 오류가 아니라 서버 상태로 다룸 |

### API 초안

앱은 화면마다 필요한 정보만 조회하도록 설계한다. 첫 화면을 빠르게 보여주고, 조회에 실패했을 때도 상태를 분명하게 안내하려는 목적이다.

| 화면 | API | 응답 목적 |
|---|---|---|
| 홈 | `GET /api/v1/home` | 최신 주보, 오늘 전례, 다음 미사, 중요 공지 요약 |
| 주보 | `GET /api/v1/bulletins/current` | 현재 주보 상세와 파일 정보 |
| 주보 목록 | `GET /api/v1/bulletins?cursor=&limit=` | 지난 주보 목록 페이지네이션 |
| 공지 | `GET /api/v1/announcements?cursor=&limit=` | 공개 중인 공지 목록 |
| 전례력 | `GET /api/v1/liturgical-days?from=&to=` | 월별 전례 정보 |
| 미사 | `GET /api/v1/schedules` | 평일, 주일, 특별 미사 시간 |
| 본당 정보 | `GET /api/v1/church-info` | 본당 소개, 위치, 문의 정보 |
| 앱 버전 | `GET /api/v1/app-version` | 최소 지원 버전과 업데이트 안내 |

### PostgreSQL 테이블 방향

주보, 공지, 미사 일정은 조회 조건이 명확해 PostgreSQL의 정규화된 테이블로 관리하려 한다. 외부 출처의 원문이나 확장 가능한 메타데이터만 `jsonb`로 제한적으로 둔다.

| 테이블 | 주요 필드 | 설계 포인트 |
|---|---|---|
| `bulletins` | `id`, `title`, `published_date`, `file_id`, `status`, `visible_from`, `visible_until` | 최신 주보와 아카이브 조회 기준 |
| `files` | `id`, `storage_key`, `content_type`, `size_bytes`, `checksum`, `public_url` | PDF/이미지 파일 메타데이터만 저장 |
| `announcements` | `id`, `title`, `body`, `priority`, `status`, `visible_from`, `visible_until` | 중요 공지와 게시 기간 관리 |
| `mass_schedules` | `id`, `mass_type`, `day_of_week`, `time`, `note`, `status` | 반복 미사 시간 관리 |
| `mass_exceptions` | `id`, `date`, `title`, `time`, `reason`, `status` | 성탄, 부활, 행사 등 예외 일정 관리 |
| `liturgical_days` | `id`, `date`, `name`, `rank`, `color`, `metadata` | 날짜 기반 전례 정보 조회 |
| `church_info` | `id`, `name`, `address`, `phone`, `links`, `updated_at` | 더보기 화면의 본당 정보 |
| `app_versions` | `id`, `platform`, `minimum_version`, `latest_version`, `message` | 강제/권장 업데이트 판단 |

파일 자체는 PostgreSQL에 넣지 않고 NAS 볼륨이나 객체 저장소에 둘 계획이다. DB에는 파일을 찾기 위한 `storage_key`, `content_type`, `size_bytes`, `checksum`을 저장한다. 이렇게 나누면 DB 백업에 파일을 포함하지 않아도 되고, 파일 저장소를 바꾸더라도 API 계약을 유지할 수 있다.

### Spring 패키지 구조 초안

패키지는 도메인별로 나누고, 각 도메인 안에서 API·유스케이스·규칙·외부 연동을 구분하려 한다.

![Spring 패키지 초안: 여섯 도메인](/diagrams/church-packages.svg)

![bulletin 내부의 네 가지 책임](/diagrams/church-bulletin-layers.svg)

- `api`: Controller와 request/response DTO
- `application`: 화면 단위 use case와 transaction 처리
- `domain`: Entity, enum, 도메인 규칙
- `infrastructure`: Repository, 파일 저장소 adapter, 외부 데이터 수집 adapter

앱에는 JPA Entity 대신 화면용 DTO를 반환한다. 홈 화면은 `Bulletin`, `Announcement`, `MassSchedule` 전체가 아니라 필요한 정보만 모은 `HomeResponse`를 받도록 설계했다.

```text
HomeResponse
  latestBulletin
  todayLiturgy
  nextMass
  importantNotices[]
```

## 기술 선택

모바일은 기존 React Native를 이어 쓰고, 서버는 장기 운영과 데이터 관리를 고려해 Spring Boot와 PostgreSQL 조합을 검토한다.

- 모바일: React Native
- 백엔드: Spring Boot
- 데이터베이스: PostgreSQL
- 배포: Docker, NAS reverse proxy
- 운영: Cloudflare, NAS reverse proxy

v2의 중심은 운영자가 관리하고 사용자가 조회하는 콘텐츠다. 공개 상태, 게시 기간, 파일 메타데이터와 마이그레이션 이력을 관리하기 위해 Spring Boot와 PostgreSQL 조합을 검토했다.

초기에는 모바일 조회 API부터 만들고, 운영에 필요한 관리자 입력 API나 화면은 같은 도메인 모델을 바탕으로 추가할 수 있다.

## 구현 계획

### 1단계: v2 정보 구조 확정

- 홈 / 주보 / 전례력 / 미사 / 더보기 탭 구조 확정
- v1 기능 중 유지할 화면과 제거할 화면 정리
- 콘텐츠별 원본 데이터와 갱신 주기 정의

### 2단계: 백엔드 기반 데이터 조회

- 주보, 공지, 미사, 전례력 API 설계
- PostgreSQL 스키마 설계
- 파일 저장 정책 정리
- 관리자 입력 또는 데이터 수집 방식 결정
- Flyway 기반 DB migration 도입
- 공개 상태, 게시 기간, 최신 주보 조회 기준 구현
- 모바일 홈 화면용 `GET /api/v1/home` 응답 DTO 설계

### 3단계: 모바일 화면 개편

- 홈 화면 우선 구현
- 주보 화면 마이그레이션
- 전례력과 미사 화면 추가
- 로딩, 빈 상태, 오류 상태 정리

### 4단계: 배포와 운영

- Docker 기반 서버 배포
- NAS reverse proxy 연결
- 모바일 앱 테스트 배포
- 사용자 피드백 반영

## 검증 체크리스트

- 앱 첫 화면에서 최신 주보와 오늘 정보가 바로 보이는가
- 연령대가 높은 사용자도 주요 기능을 1~2번 탭 안에 찾을 수 있는가
- 네트워크 실패 시 빈 화면이 아니라 이해 가능한 상태가 보이는가
- 주보 파일이 느리게 열리거나 실패할 때 복구 흐름이 있는가
- 본당 일정 변경을 앱 업데이트 없이 반영할 수 있는가
- 개인정보나 관리자 기능이 불필요하게 노출되지 않는가
- Spring API 응답이 화면 단위로 충분히 작고 안정적인가
- 게시 기간이 지난 공지나 비공개 주보가 모바일에 노출되지 않는가
- 파일이 누락되었을 때 앱이 깨지는 대신 대체 상태를 보여주는가

## 남은 설계 질문

- v1을 유지하면서 v2로 전환하는 방법
- 주보 PDF를 계속 사용할지, 구조화된 콘텐츠로 전환할지
- 관리자 기능을 어디까지 만들지
- 전례력 데이터를 어떤 방식으로 검증하고 갱신할지
- Spring 백엔드를 어디까지 먼저 만들고, 어떤 기능은 정적 데이터나 수동 입력으로 시작할지
- 파일 저장소를 NAS 볼륨으로 시작할지, 객체 저장소로 바로 분리할지
