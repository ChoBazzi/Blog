# 개인 포트폴리오 블로그

Next.js와 TypeScript로 만든 개인 포트폴리오·기술 블로그이다. 글은 `content/`의 Markdown으로 관리하며, 해당 폴더를 Obsidian Vault로 열어 편집할 수 있다.

## 로컬 실행

Node.js 24와 npm을 준비한 뒤 저장소 루트에서 실행한다.

```sh
npm ci
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 연다.

## 변경 사항 검사

```sh
npm run harness
```

콘텐츠 형식 검사, 테스트, lint, 타입 검사, 프로덕션 빌드를 순서대로 실행한다. 먼저 `npm ci`로 의존성을 설치해야 전체 검사가 실행된다.

글의 형식만 빠르게 확인하려면 다음 명령을 사용한다.

```sh
npm run validate:content
```

## 글과 문서 위치

- `content/blog/`: 회고·트러블슈팅 등 개발 기록
- `content/projects/`: 프로젝트 소개와 설계 기록
- `content/notes/`: 학습 노트
- [프로젝트 구조와 배포](docs/architecture.md)
- [글 작성·검토 흐름](docs/blog-harness.md)
