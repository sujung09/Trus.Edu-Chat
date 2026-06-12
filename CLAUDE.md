# CHAT — 교육용 실시간 그룹 채팅

본 파일은 본 프로젝트의 **규범 (norms)**. 같은 프로젝트에서 작업하는 모든 에이전트 (Claude · developer · reviewer) 가 호출 직전 자동 로드.

---

## 0. 프로젝트 개요

WebSocket 기반 실시간 그룹 채팅. 닉네임 입력 → 단일 그룹방 입장 → 다중 사용자 동시 채팅. 교육·시연 목적.

- 백엔드: Python FastAPI (uvicorn) — `backend/`
- 프론트엔드: Next.js 15 (App Router · TypeScript · Tailwind) — `frontend/`
- 데이터베이스: 없음 (메시지 휘발)
- 디자인: `design_guide/` 의 Lumina Learn 다크 토큰

상세 사양은 `.specs/2026-06-12-realtime-chat.md` 단일 진실.

---

## 1. 카파시 하네스 엔지니어링 (Harness Engineering)

> *Andrej Karpathy*: LLM 의 출력 품질은 LLM 자체의 성능 + **그것을 둘러싼 하네스 (가드레일 + 룰 + 도구 + 컨텍스트 + 스코프)** 의 함수다. 모델만 잘 골라서 던지면 그릇 없는 물처럼 흩어진다.

**하네스** = LLM 에게 "무엇을 보고 / 무엇을 하지 말고 / 어디까지 닿을지" 를 미리 형틀로 박아두는 모든 장치의 총합.

### 본 프로젝트의 하네스 구성 요소

| 구성 요소 | 역할 | 위치 |
|---|---|---|
| 본 CLAUDE.md | 규범·금지·하네스 정의 자체 | `/Users/hsj910/Desktop/CHAT/CLAUDE.md` |
| Rules.md | 루프 산출물 — 실패 패턴 누적 | `/Users/hsj910/Desktop/CHAT/Rules.md` |
| spec 파일 | 이번 작업의 목표·범위·완료조건 | `/Users/hsj910/Desktop/CHAT/.specs/*.md` |
| 서브에이전트 정의 | developer / reviewer 의 역할·금지·출력 형식 | `/Users/hsj910/Desktop/CHAT/.claude/agents/*.md` |
| 프로젝트 로컬 설정 | 허용·거부 명령 매핑 | `/Users/hsj910/Desktop/CHAT/.claude/settings.json` |
| 디자인 가이드 | 색·타이포·spacing 토큰 표 | `/Users/hsj910/Desktop/CHAT/design_guide/` |

이 6 요소가 모두 갖춰져야 하네스가 작동한다. 하나라도 빠지면 LLM 이 "왜 안 되는지 모르는 자유" 로 흩어진다.

### 하네스가 강제하는 가드레일

- 모든 에이전트는 호출 직전 위 표의 1·2·3 을 자동 read
- spec 의 "하지 않을 것" 영역에 닿으면 즉시 stop + 호출자 보고
- 의심스러운 행동은 Rules.md 회고 영역에 1줄 append (다음 호출 시 자동 로드)

---

## 2. 스코프 강제 (Scope Enforcement) — 본 프로젝트의 가장 중요한 룰

황호님 명시: **"내 하드웨어는 여러 프로젝트를 동시 진행 중. 다른 프로젝트에게 피해를 줘선 안 됨."**

### 절대 금지 (자동 reject 대상)

| 영역 | 금지 행위 |
|---|---|
| 글로벌 Claude 설정 | `~/.claude/agents/`·`~/.claude/skills/`·`~/.claude/settings.json`·`~/.claude/rules/`·`~/.claude/CLAUDE.md` 수정·생성·삭제 |
| 글로벌 MCP | `claude mcp add` 류 글로벌 MCP 등록 |
| 다른 프로젝트 | `/Users/hsj910/Desktop/CHAT/` 폴더 외부의 어떤 파일도 read/write 금지 (단 `~/.claude/rules/*` 의 자동 로드는 read-only OK) |
| 글로벌 패키지 | `npm i -g`·`npm install --global`·`pip install` (venv 밖)·`brew install` 자동 실행 금지 |
| 글로벌 도구 설치 | `pipx`·`uv tool install`·`asdf install`·시스템 Python 변경 일체 금지 |

### 허용 (프로젝트 안)

- `/Users/hsj910/Desktop/CHAT/.claude/` — 프로젝트 로컬 에이전트·설정 (글로벌과 별개)
- `/Users/hsj910/Desktop/CHAT/backend/.venv/` — Python 가상환경 (격리)
- `/Users/hsj910/Desktop/CHAT/frontend/node_modules/` — Node 의존성 (격리)
- `/Users/hsj910/Desktop/CHAT/**` 의 모든 파일 작업

### 검증 방법

리뷰 또는 작업 종료 시 다음 명령으로 글로벌 침범 0 건 확인:

```bash
# 1) 글로벌 Claude 설정 변경 시각 확인 (작업 시작 전후 비교)
ls -la ~/.claude/ 2>/dev/null | head -20

# 2) 글로벌 npm 패키지 변동 확인
npm ls -g --depth=0 2>/dev/null

# 3) 본 작업이 시스템 Python 건드렸는지
which python3 && python3 -c "import sys; print(sys.executable)"
```

---

## 3. 폴더 구조

```
CHAT/
├── .claude/                  # 프로젝트 로컬 (글로벌과 별개)
│   ├── agents/
│   │   ├── developer.md      # 파란색
│   │   └── reviewer.md       # 노란색
│   └── settings.json
├── .specs/
│   └── 2026-06-12-realtime-chat.md
├── backend/
│   ├── .venv/                # 격리 Python venv
│   ├── main.py               # FastAPI + WebSocket
│   └── requirements.txt
├── frontend/                 # Next.js 15 (TS)
│   ├── app/
│   │   ├── page.tsx          # 닉네임 입력
│   │   ├── chat/page.tsx     # 채팅방
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── tailwind.config.ts
│   ├── package.json
│   └── tsconfig.json
├── design_guide/             # 원본 시안 (참고만)
├── CLAUDE.md                 # 본 파일
├── Rules.md                  # 루프 회고 누적
└── README.md                 # 실행법
```

---

## 4. 디자인 토큰 적용 룰

`design_guide/DESIGN.md` frontmatter 의 색·타이포·spacing·radius 를 `frontend/tailwind.config.ts` 의 `theme.extend` 에 그대로 매핑. 임의의 값 (`#000000` 등) 하드코딩 금지 — 모든 색상은 토큰명으로 참조.

핵심 토큰:
- `surface` `#141218` · `primary` `#cfbcff` · `on-primary-container` `#e0d2ff`
- Font: Inter (본문) · JetBrains Mono (코드)
- 채팅 영역 max-width: 800px · 모바일 우선
- Glassmorphism 헤더 (backdrop-blur)

---

## 5. 에이전트 호출 흐름 (루프)

```
1. 호출자 (Claude / 황호님)
   → developer 에 작업 요청
2. developer
   → CLAUDE.md + Rules.md + spec 자동 read
   → 코드 작성·수정
   → 결과 보고
3. 호출자
   → reviewer 에 검수 요청 (대상 파일 명시)
4. reviewer
   → CLAUDE.md + Rules.md + spec + 대상 파일 자동 read
   → 8 항목 체크리스트 판정
   → "통과" 또는 "수정 프롬프트" 출력
5. 분기
   - 통과 → 루프 종료
   - 수정 필요 → developer 재호출 (수정 프롬프트 전달) → step 2 로
   - 동일 지적 3회 → 황호님께 보고 + Rules.md 회고 영역 append
```

---

## 6. 의존성 / 실행 / 검증

### 백엔드 초기화 (한 번만)

```bash
cd /Users/hsj910/Desktop/CHAT/backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### 백엔드 실행

```bash
cd /Users/hsj910/Desktop/CHAT/backend
.venv/bin/uvicorn main:app --reload --port 8000
```

### 프론트엔드 초기화 (한 번만)

```bash
cd /Users/hsj910/Desktop/CHAT/frontend
npm install
```

### 프론트엔드 실행

```bash
cd /Users/hsj910/Desktop/CHAT/frontend
npm run dev
```

### 골든 패스 검증

`http://localhost:3000` 두 탭 → 다른 닉네임 → 한쪽 송신 메시지가 다른 쪽에 1초 안에 표시.

---

## 7. 작업 종료 시 의무

1. 본 작업에서 발견한 잘못된 결정·실패 패턴이 있으면 `Rules.md` 회고 영역에 1줄 append
2. spec 의 "완료 조건 3개" 각각 통과 여부 1줄 보고
3. 글로벌 침범 검증 명령 (§ 2) 실행 결과 1줄
