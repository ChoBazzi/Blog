# 블로그 하네스 외부 자료 검토 기록

확인 날짜: **2026-10-04**. 아래 URL의 원문과 관련 저장소 파일을 직접 읽고 이 프로젝트의 요구사항과 대조했다. 로컬 스킬·명령·템플릿·편집 기준은 **독립 작성한 적용 지침**이다. 외부 본문·예시·프롬프트·이미지·실행 코드를 복사하거나 번역해 배포하지 않았다. 외부 명령을 실행하거나 플러그인을 설치하지 않았다. 자료를 읽은 것과 원본 스킬을 설치·실행한 것은 다르다.

## 출처별 기록

| 자료 | 확인한 고정 버전 | 라이선스 확인 | 복사 여부·적용 범위 |
| --- | --- | --- | --- |
| [ExceptAnyone/ko-tech-blog-skill](https://github.com/ExceptAnyone/ko-tech-blog-skill) | `937ee3da5d59f4c46144f6c04fba67f73882838e` | [LICENSE](https://github.com/ExceptAnyone/ko-tech-blog-skill/blob/937ee3da5d59f4c46144f6c04fba67f73882838e/LICENSE), MIT, Copyright 2026 장정안 | 미복사. 문제·환경·실제 시도·결과 확인의 취지만 참고했다. 고정 Phase 1/2/3, 수치형 제목, 질문형 소제목, 철학적 결론, 단계마다 승인, `/posts/`, 자동 SEO·이미지 제안은 채택하지 않았다. |
| [evergreentree97/K-Humanizer](https://github.com/evergreentree97/K-Humanizer) | `324435d561ba48d53de6b7d3fb3dd72cf77030dc` | [LICENSE](https://github.com/evergreentree97/K-Humanizer/blob/324435d561ba48d53de6b7d3fb3dd72cf77030dc/LICENSE), MIT, Copyright 2026 K-Humanizer contributors | 미복사. 사실·불확실성·기여 보존과 문맥별 최소 교정 원칙을 블로그에 맞게 독립 작성했다. 이력서 우선, 채용 공고 맞춤, 일괄 문자 금지, 편집 비율 규칙은 도입하지 않았다. |
| [Anthropic doc-coauthoring](https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring) | `8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4` | 저장소 README는 다수 스킬을 Apache 2.0으로 설명하지만 이 커밋의 루트 및 doc-coauthoring 폴더에 적용 LICENSE 파일을 찾지 못했다. 해당 스킬의 확정 이용 조건은 미확인이다. | 미복사. 새 컨텍스트 독자 검토라는 공개 원칙만 참고했다. 질문 5~10개, 섹션별 반복 승인, 무제한 수정 흐름은 사용하지 않는다. 로컬은 질문 최대 3개·기본 검토 2회이다. |
| [테크니컬 라이팅 가이드: AI와 함께 쓰기](https://technical-writing.dev/tutorial/review-prompt.html) | [toss/technical-writing](https://github.com/toss/technical-writing), master `68ba335cbe35c877775f092e98177b60da5f3d95` | [README License](https://github.com/toss/technical-writing/blob/68ba335cbe35c877775f092e98177b60da5f3d95/README.md), CC BY-NC-SA 4.0, Copyright 2024 Viva Republica, Inc. | 미복사. 문서 목적·독자·정보 구조·문장 편집을 구분하는 일반 원칙만 독립 적용했다. 원문 프롬프트·스크린샷·예문을 포함하지 않는다. 사이트 배포본과 저장소 커밋이 같은 빌드인지는 확인하지 않았다. |
| [토스 테크: 5. Technical Writer, 사라질 결심](https://toss.tech/article/technical-writing-5) | 웹 본문 확인, 게시일 2026-06-23, Git SHA 비해당 | 해당 기사에서 재배포를 허용하는 명시적 라이선스를 확인하지 못했다. 위 가이드 저장소의 CC 라이선스를 이 기사에 확대 적용하지 않는다. | 미복사. 유형별 작성 안내, 근거가 필요한 항목의 구분, 예시를 통한 원칙 설명, 억지 지적 방지라는 공개 원칙만 참고했다. 사내 봇·메신저 연동·자동 PR 리뷰를 구현하거나 동일 효과를 주장하지 않는다. |

SHA는 GitHub API에서 확인했다. 기술 문서 사이트는 기본 브랜치가 master여서 main 조회가 실패한 뒤 저장소 메타데이터로 브랜치를 확인했다. 날짜는 조회 기준이지 내용의 정확성 보증이 아니다.

OMP 설정은 설치된 18.3.5가 제공하는 `omp://config-usage.md`, `omp://skills.md`, `omp://task-agent-discovery.md`, `omp://slash-command-internals.md`, `omp://settings.md`, `omp://rpc.md`를 우선했다. [OMP 저장소](https://github.com/can1357/oh-my-pi), [main 설정 문서](https://github.com/can1357/oh-my-pi/blob/main/docs/config-usage.md), [main 스킬 문서](https://github.com/can1357/oh-my-pi/blob/main/docs/skills.md), [main 역할 문서](https://github.com/can1357/oh-my-pi/blob/main/docs/task-agent-discovery.md)에도 접근했으나 설치본과 동일 버전이라고 가정하지 않았다. 저장소 표기는 MIT이며 소스 코드를 반입하지 않았다. 설치 바이너리의 커밋 SHA는 확인하지 못했다. CLI 모델 목록·설정 조회·RPC 발견 및 실제 역할 실행 기록으로 설치본 동작을 별도로 확인했다.

## 실제로 읽은 참조·코드 범위

### ko-tech-blog

- [SKILL.md](https://github.com/ExceptAnyone/ko-tech-blog-skill/blob/937ee3da5d59f4c46144f6c04fba67f73882838e/plugins/ko-tech-blog/skills/ko-tech-blog/SKILL.md)
- [article-structure.md](https://github.com/ExceptAnyone/ko-tech-blog-skill/blob/937ee3da5d59f4c46144f6c04fba67f73882838e/plugins/ko-tech-blog/references/article-structure.md), [toss-style-guide.md](https://github.com/ExceptAnyone/ko-tech-blog-skill/blob/937ee3da5d59f4c46144f6c04fba67f73882838e/plugins/ko-tech-blog/references/toss-style-guide.md)
- [problem-solving-template.md](https://github.com/ExceptAnyone/ko-tech-blog-skill/blob/937ee3da5d59f4c46144f6c04fba67f73882838e/plugins/ko-tech-blog/templates/problem-solving-template.md)
- [plugin.json](https://github.com/ExceptAnyone/ko-tech-blog-skill/blob/937ee3da5d59f4c46144f6c04fba67f73882838e/plugins/ko-tech-blog/.claude-plugin/plugin.json): 버전 1.0.5와 메타데이터를 확인했다. 확인한 트리의 대상 플러그인은 Markdown 지침·JSON 메타데이터이며 별도 실행 스크립트가 나열되지 않았다. 문서 속 코드 예제는 읽었지만 실행·반입하지 않았다.

### K-Humanizer

- [SKILL.md](https://github.com/evergreentree97/K-Humanizer/blob/324435d561ba48d53de6b7d3fb3dd72cf77030dc/skills/k-humanizer/SKILL.md)
- [patterns.md](https://github.com/evergreentree97/K-Humanizer/blob/324435d561ba48d53de6b7d3fb3dd72cf77030dc/skills/k-humanizer/references/patterns.md), [evaluation.md](https://github.com/evergreentree97/K-Humanizer/blob/324435d561ba48d53de6b7d3fb3dd72cf77030dc/skills/k-humanizer/references/evaluation.md)
- [agents/openai.yaml](https://github.com/evergreentree97/K-Humanizer/blob/324435d561ba48d53de6b7d3fb3dd72cf77030dc/skills/k-humanizer/agents/openai.yaml): 표시·기본 프롬프트 메타데이터를 확인했다. OMP 에이전트 설정으로 복사하지 않았다.
- [validate_golden_set.py](https://github.com/evergreentree97/K-Humanizer/blob/324435d561ba48d53de6b7d3fb3dd72cf77030dc/scripts/validate_golden_set.py): JSONL 필드·도메인·표본 수를 검사하는 코드를 읽었다. 사실 검증이나 한국어 의미 보존을 증명하는 실행으로 간주하지 않는다. 원격 코드를 실행·복사하지 않았다. 이력서 전용 참조와 전체 평가 데이터는 도입하지 않았다.

### doc-coauthoring와 웹 자료

- [doc-coauthoring/SKILL.md](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/doc-coauthoring/SKILL.md)를 끝까지 읽었다. 해당 폴더 트리에는 SKILL.md만 있었다. 별도 참조·실행 코드·LICENSE는 나열되지 않았다.
- [README](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/README.md)와 [THIRD_PARTY_NOTICES.md](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/THIRD_PARTY_NOTICES.md)의 구성요소 고지를 확인했다. 이 고지가 doc-coauthoring 자체의 이용 허락을 확정한다고 판단하지 않았다. 관련 구성요소도 가져오지 않았다.
- technical-writing.dev와 toss.tech의 지정 페이지를 직접 읽고, 게시된 프롬프트·템플릿·설명용 코드와 가이드 저장소 README의 이용 조건을 확인했다. 웹 자산·프로젝트 실행 코드·원문 템플릿을 로컬 하네스에 포함하지 않았다.

## 로컬 적용 및 업데이트

- `.agents/skills/ko-tech-blog/`: 근거→목차→초안→검토→교정→재검증 흐름과 brief·outline·review 템플릿이다.
- `.agents/skills/k-humanizer/`: 블로그 의미 보존 편집이다.
- `.agents/skills/blog-evidence/`: 사용자 요구사항을 기준으로 직접 작성한 주장 유형·상태·출처·실행 기록 규칙과 claims·sources 템플릿이다.
- `editorial/`: 프로젝트 문체와 네 글 유형의 독립 작성 템플릿, 실제 경험으로 전환하지 않는 합성 교정 예시이다.
- `.omp/commands/`: 설치 OMP 18.3.5의 내장 `omp://slash-command-internals.md`에서 확인한 Markdown `description` frontmatter와 `$ARGUMENTS` 확장 계약을 사용한다. 외부 플러그인 명령 형식을 복사하지 않는다. 파일 존재와 실제 등록·실행 검증은 별개이며 실행 결과는 `docs/blog-harness.md`에 기록한다.

원문을 반입하지 않아 이 변경에 동봉할 외부 LICENSE·NOTICE 사본은 없다. 향후 원문·코드를 실제 복사할 경우 해당 고정 버전의 허락을 다시 확인하고 필요한 LICENSE·NOTICE를 함께 보존하며 이 기록을 갱신한다. 이용 조건이 불명확하면 복사하지 않는다.

자동 업데이트하지 않는다. 업데이트 때 새 SHA·라이선스·참조·실행 코드와 로컬 차이를 사람이 확인하고, 기존 독립 작성 규칙·근거 경계·읽기 전용 역할을 보존한다. 변경 후 발견·등록·참조 접근과 합성 검증을 다시 수행한다. 특정 회사의 공식·보증 스킬이라고 소개하지 않는다.
