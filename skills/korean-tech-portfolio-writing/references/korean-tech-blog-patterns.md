# Korean Tech Blog Patterns For Portfolio Writing

This reference summarizes writing patterns observed from Korean tech blogs. Use it to shape posts, not to imitate company voice.

## Sources Reviewed

- Toss Tech engineering category: https://toss.tech/tech
- Toss Design System article: https://toss.tech/article/toss-design-system
- Kakao Tech TSCoke development story: https://tech.kakao.com/posts/531
- Kakao Tech harmful image classification system: https://tech.kakao.com/posts/740
- Woowahan Tech Blog UI regression testing: https://techblog.woowahan.com/6460/
- Woowahan Tech Blog AI test automation plugin: https://techblog.woowahan.com/24568/
- LINE infra scaleout article: https://engineering.linecorp.com/ko/blog/challenges-and-solutions-of-line-infra-scaleout/
- LINE technical debt article: https://engineering.linecorp.com/ko/blog/about-messaging-hub-1/
- Naver D2 live player UI improvement: https://d2.naver.com/helloworld/0203261
- Naver D2 shopping category auto-classification: https://d2.naver.com/helloworld/1264836
- Naver D2 Pinpoint: https://d2.naver.com/helloworld/1194202

## Common Shape

Strong Korean tech posts usually do this:

1. Introduce the business or user context briefly.
2. State the concrete problem and why it mattered.
3. Explain constraints before explaining the solution.
4. Show alternatives, principles, or decision criteria.
5. Walk through implementation in responsibility/data-flow order.
6. Include measurable result, operational effect, or limitation.
7. Close with a learning or future improvement.

## Patterns To Reuse

### Problem-First Opening

Observed in Toss, Kakao, LINE, and Naver posts. The article starts by naming a real pain: operational load, scaling limits, inconsistent review quality, slow UI, ambiguous ownership, or impossible manual work.

Portfolio application:

- Bad: "Spring Boot와 PostgreSQL을 사용한 프로젝트입니다."
- Better: "매주 바뀌는 본당 정보를 앱 업데이트 없이 반영해야 했고, PDF 중심 v1 구조로는 전례력과 미사 변경 공지를 함께 다루기 어려웠습니다."

### Role And Scope

Company posts naturally have author/team context. Junior portfolios need it more explicitly.

Include:

- team size or personal project
- my role
- what I owned
- what was outside scope
- links to repository/demo if available

### Constraints Before Decisions

LINE and Kakao posts often explain why a simple option was not enough before introducing the chosen architecture. This is useful for portfolio writing because it proves judgment.

Good constraints:

- latency
- update frequency
- external API instability
- deployment environment
- team size
- deadline
- cost
- user age/accessibility
- privacy/security

### Alternatives And Tradeoffs

Do not only say what you built. Explain what you rejected or limited.

Useful phrasing:

- "처음에는 X를 고려했지만, Y 때문에 Z로 바꿨습니다."
- "이 선택은 A를 단순하게 만들지만, B라는 비용이 있습니다."
- "프로젝트 규모상 X는 과했고, 대신 Y로 충분하다고 판단했습니다."

### Evidence

Naver D2 and LINE posts are strong because they include scale, architecture, test conditions, or measurable outcome.

For junior projects, acceptable evidence includes:

- Play Store release
- active users or installs
- measured latency/build size if available
- before/after manual steps
- failure rate examples
- API contract or schema
- screenshot of result
- test command output
- operational deployment path

If evidence is missing, write `확인 필요:` instead of inventing numbers.

### Honest Retrospective

Good retrospectives do not only celebrate. They name unfinished parts and explain what would change next.

Include:

- what worked
- what was brittle
- what was over-engineered or under-designed
- what should be measured next
- what you would do differently

## Anti-Patterns

- Stack-first intro with no problem.
- "많이 배웠다" without the concrete before/after.
- Team project written as if all work was personally owned.
- Architecture diagram without component responsibility.
- Feature list without decision rationale.
- Metrics without source.
- Retrospective that hides failure or limitation.
