---
name: korean-tech-portfolio-writing
description: Use when writing, rewriting, or reviewing Korean junior-developer portfolio posts, project retrospectives, architecture notes, troubleshooting articles, or technical introductions using patterns from Korean tech blogs such as Toss Tech, Kakao Tech, Woowahan Tech Blog, LINE Engineering, and Naver D2.
---

# Korean Tech Portfolio Writing

## Goal

Help a junior developer turn project experience into credible portfolio writing. The output should read like a compact Korean tech blog post: problem-led, evidence-based, technically specific, and honest about scope.

## Workflow

1. Classify the article:
   - `project-retrospective`: what I built, why, tradeoffs, result, learning
   - `architecture-note`: system shape, responsibilities, data flow, failure modes
   - `troubleshooting`: symptom, hypothesis, investigation, fix, prevention
   - `technical-introduction`: concept, motivation, implementation notes, limitations
2. Read the target Markdown and nearby project posts before editing.
3. Use `references/korean-tech-blog-patterns.md` for detailed source-derived patterns when structure or tone is unclear.
4. Rewrite around decisions, not chronology. Prefer:
   - problem and context
   - role and scope
   - constraints
   - alternatives considered
   - implementation or architecture
   - validation and result
   - retrospective and next step
5. Keep claims defensible. If a metric, user count, performance number, or production status is not in the repo or user prompt, mark it as needed input instead of inventing it.
6. After editing content, run:
   - `npm run validate:content`
   - `npm run harness:portfolio -- --strict <changed-markdown-file>`

## Writing Rules

- Start with the actual problem, not the stack list.
- Explain why the selected approach was reasonable under the project constraints.
- Show ownership with specific verbs: designed, implemented, separated, measured, migrated, debugged, validated.
- For team projects, separate `team outcome` from `my responsibility`.
- Include failure, limitation, or next-step sections when the project is unfinished or learning-focused.
- Put architecture/data flow in a short diagram or list before deep implementation details.
- Use plain Korean. Avoid inflated claims like "완벽한", "혁신적인", "압도적인" unless proven.
- Prefer a concise Korean `이다` style for technical posts. Use `다`, `했다`, `느꼈다`, `볼 수 있다`, and `필요하다` rather than polite `습니다` endings.
- Use polite `습니다` style only when the page is explicitly reader-facing, such as About, contact, or formal introduction copy.
- Keep the tone firm but not stiff: technical judgment should use `이다`; personal retrospectives can use natural past-tense expressions like `배웠다`, `아쉬웠다`, and `느꼈다`.

## Preferred Structures

### Project Retrospective

```md
## 프로젝트 개요
## 맡은 역할
## 문제
## 해결 방향
## 구현
## 검증과 결과
## 아쉬웠던 점
## 배운 점
```

### Architecture Note

```md
## 설계 목표
## 전체 구조
## 컴포넌트 책임
## 데이터 흐름
## 실패 처리
## 트레이드오프
## 개선할 점
```

### Troubleshooting

```md
## 증상
## 영향 범위
## 원인 후보
## 확인 과정
## 해결
## 재발 방지
```

## Harness

Use the portfolio harness as a writing-quality gate:

```bash
npm run harness:portfolio -- --strict content/projects/my-post.md
```

The harness checks whether the post has project context, role/scope, problem framing, technical implementation, tradeoffs, evidence/results, and retrospective learning. It is not a grammar checker; it catches portfolio-writing omissions.

## Guardrails

- Do not turn a small toy project into production-scale experience.
- Do not bury the user's contribution under generic team descriptions.
- Do not replace technical explanation with resume keywords.
- Do not add backend, architecture, or metrics that are not supported by evidence.
