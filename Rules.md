# Rules.md — 루프 엔지니어링 산출물

본 파일은 본 프로젝트의 **루프 (loop)** 산출물. 작업마다 발견된 잘못된 결정·실패·금지 패턴이 1줄로 자동 누적되어, 다음 developer/reviewer 호출 시 항상 같이 로드된다. 누적될수록 하네스가 더 fresh 해진다.

---

## 0. 카파시 루프 엔지니어링 (Loop Engineering)

> *Andrej Karpathy*: 단발 LLM 호출은 거의 항상 부족하다. 진짜 엔지니어링은 **관찰 → 평가 → 수정 → 재시도** 사이클을 짧고 좁게 돌리는 데 있다. 한 번에 잘 짜려는 욕심 대신, 부정확한 출력도 사이클을 통과시키면서 정답에 수렴시킨다.

**루프** = (1) 시도 → (2) 평가 → (3) 회고 → (4) 회고를 다음 시도의 컨텍스트로 강제 주입.

본 프로젝트의 루프 구현:

```
developer 시도 (코드 작성)
    ↓
reviewer 평가 (8 항목 체크)
    ↓
[수정 필요] → developer 재시도 (reviewer 지적 prompt 로 받음)
    ↓
[통과] → 발견한 실패 패턴이 있다면 본 파일 § 2 에 1줄 append
    ↓
다음 작업 호출 시 본 파일이 자동 로드되어 같은 실수 차단
```

### Fresh Engineering 유지 원칙

- 잘못된 결정·디버깅 발견·재발 위험 패턴은 발생 직후 § 2 에 append
- "다음에 정리" 미루기 금지
- 한 줄은 6 요소: `날짜 · 영역 · 증상 · 근본 원인 · 재발 방지 · 검증 방법`
- 한 줄이 너무 길어지면 별도 영역 (§ 3) 으로 빼고 § 2 에서는 한 줄 요약 + 링크

---

## 1. 영구 금지 (변경되지 않는 룰)

본 영역은 사용자가 명시적으로 합의한 절대 금지 룰. 작업 진행해도 변경 없음. 추가는 황호님 명시 1줄 OK 필요.

| # | 룰 |
|---|---|
| R1 | `~/.claude/` 이하 어떤 파일도 수정·생성·삭제 금지 (글로벌 침범 차단 — `architecture.md` 단일 SoT 와 별개로 본 프로젝트도 동일 정책) |
| R2 | `npm i -g` · `pip install` (venv 밖) · `brew install` · `pipx install` 등 글로벌 패키지 설치 금지 |
| R3 | 글로벌 MCP 등록 (`claude mcp add`) 금지 |
| R4 | 본 프로젝트 외부 폴더 (다른 `Desktop/*` 등) 의 파일 read/write 금지 |
| R5 | spec 의 "하지 않을 것" 영역 자동 적용 — DB·인증·rate limit·XSS 차단·TDD·보일러플레이트 일절 도입 금지 |
| R6 | 디자인 토큰을 하드코딩 금지 — `design_guide/DESIGN.md` 의 토큰명으로만 참조 |
| R7 | reviewer 가 코드 직접 수정 (Edit/Write 호출) 금지 — 지적만 |
| R8 | developer 가 reviewer 지적 회피 위해 spec 외 영역 손대기 금지 |
| R9 | 동일 reviewer 지적이 3회 반복되면 silent 수정 금지, 황호님 보고 의무 |

---

## 2. 자동 회고 (작업 누적 — append-only)

각 줄 형식:

```
- [YYYY-MM-DD] [영역] 증상 → 원인 → 재발 방지 → 검증 방법
```

**최신이 위.** 같은 영역에 비슷한 회고가 2건 이상 누적되면 패턴 라벨링 후 § 3 로 승격.

<!-- 이 아래는 작업이 진행되며 자동으로 채워짐. 시작 시점엔 비어있음. -->

- [2026-06-12] [frontend/tailwind-v4] `max-w-md` 가 16px 로 좁아져 한글이 한 글자씩 세로 wrap → 원인: Tailwind v4 의 `@theme` 안에 `--spacing-xs/sm/md/lg/xl` 같은 named spacing 토큰을 정의하면 spacing scale 전체가 영향받아 `max-w-md`, `gap-lg` 같은 표준 utility 의 값까지 덮어쓴다 → 재발 방지: v4 에서 `--spacing-NAME` named scale 정의 금지, base `--spacing` 단일 변수 + 숫자 utility (`p-4`, `gap-2`, `max-w-md`=28rem) 만 사용 → 검증: 컴파일된 `.next/static/css/app/layout.css` 에서 `.max-w-md { max-width: var(--container-md) }` 확인 + 실제 화면 폭 렌더
- [2026-06-12] [process/reviewer] reviewer 의 정적 8 항목 체크는 디자인 토큰 "매핑 존재" 까지만 검증, 컴파일 후 CSS 값 충돌은 못 잡았다 → 재발 방지: 디자인 변경 시 reviewer 체크리스트에 "컴파일된 CSS 의 핵심 utility 값 spot-check (max-w-md / gap-N / p-N 결과 값 확인)" 추가 + 첫 라운드 후 실제 브라우저 렌더 1회 의무 → 검증: reviewer.md 의 항목 4 (디자인 토큰) 에 CSS spot-check 단계 명시

---

## 3. 패턴 라벨링 (반복 패턴 격상)

§ 2 의 같은 영역에 2 건 이상 회고가 누적되면 본 영역으로 승격. 영구 가이드라인화.

(아직 라벨링된 패턴 없음)

---

## 4. 본 파일 갱신 규칙

- developer / reviewer 가 본 파일을 직접 수정 가능 (§ 2 append 만 — § 0·§ 1·§ 4 수정 금지)
- 호출자 (Claude · 황호님) 가 § 0·§ 1·§ 4 수정
- 회고 append 후 다음 작업 호출 시 자동 로드되는지 확인 (CLAUDE.md § 1 의 6 구성 요소 표에 본 파일이 포함되어 있음)
- 본 파일 자체가 길어지면 (300줄+) § 2 의 오래된 회고를 `Rules.archive.md` 로 분리. 단 § 3 패턴은 본 파일 유지
