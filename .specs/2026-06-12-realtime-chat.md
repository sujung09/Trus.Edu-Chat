# CHAT 리얼타임 채팅 스펙

작성일: 2026-06-12
요청: 황호님 — "교육용 SPA 리얼타임 WebSocket 그룹 채팅 — Next.js 15 + FastAPI, DB 없음"

## 읽어야 할 파일 (자기완결성)

- `/Users/hsj910/Desktop/CHAT/design_guide/DESIGN.md` — Lumina Learn 토큰 (다크, primary #cfbcff, Inter+JetBrains Mono, 4px grid, glassmorphism)
- `/Users/hsj910/Desktop/CHAT/design_guide/code.html` — Tailwind config + 채팅 화면 마크업 참고
- `/Users/hsj910/Desktop/CHAT/design_guide/screen.png` — 헤더(룸명+온라인 수)+참여자 스토리+말풍선 영역+pill 입력바+하단 nav 시안

## 목표

교육용 시연용. 닉네임 입력 → 단일 그룹 채팅방 입장 → WebSocket 으로 여러 명 동시 채팅. 백엔드 FastAPI, 프론트 Next.js 15 (TS), DB 없음. 강의 한 회분 시연이라 단순성 우선.

## 완료 조건 (3개)

1. 두 터미널에서 백/프론트 띄우고 다른 브라우저 탭 2개에서 다른 닉네임으로 입장 → 한쪽 송신 메시지가 다른 쪽에 1초 안에 표시
2. design_guide screen.png 와 시각적으로 일치 — 다크 배경, 보라 톤 outgoing 말풍선, pill 입력바, max-w-[800px] 중앙 정렬, 참여자 story-ring
3. 글로벌 침범 0건 — `~/.claude/`, 다른 프로젝트 `.claude/`, 글로벌 npm/pip 설치, 글로벌 MCP 등 본 프로젝트 폴더 밖 변경 없음 (grep + 직접 확인)

## 범위

- `/Users/hsj910/Desktop/CHAT/backend/` — FastAPI + WebSocket (uvicorn 단독 실행)
- `/Users/hsj910/Desktop/CHAT/frontend/` — Next.js 15 TypeScript SPA (App Router)
- `/Users/hsj910/Desktop/CHAT/.claude/agents/` — 프로젝트 로컬 서브에이전트 2개
  - `developer.md` (파란색)
  - `reviewer.md` (노란색)
- `/Users/hsj910/Desktop/CHAT/.claude/settings.json` — 프로젝트 로컬 설정 (필요 시)
- `/Users/hsj910/Desktop/CHAT/CLAUDE.md` — 프로젝트 규범 + 하네스 엔지니어링 정의
- `/Users/hsj910/Desktop/CHAT/Rules.md` — 자동 회고/금지 룰 + 루프 엔지니어링 정의 (작업 실패 누적)
- `/Users/hsj910/Desktop/CHAT/README.md` — 띄우는 법 (개발자용)

## 하지 않을 것과 이유

- **DB 도입** — 사용자 명시 "교육용이라 없이"
- **인증·Rate limit·XSS 차단·CSRF** — 사용자 명시 면제
- **보일러플레이트·TDD·커스텀 Hook 도입** — 사용자 명시 면제
- **글로벌 `~/.claude/` 폴더 수정** — Scope 강제. 다른 프로젝트가 동시 진행 중이라 침범 시 사고
- **글로벌 MCP 등록** — Claude Code 글로벌 영향 가능, 본 프로젝트엔 불필요
- **메시지 영속화** — 사용자 답변 "안함" → 입장 시점부터만. 서버 메모리 N개 누적도 안 함 (단순)
- **입장·퇴장 시스템 메시지** — 사용자 답변 "안함"
- **닉네임 중복 차단** — 사용자 답변 "안함" → 중복 허용
- **프로필 이미지·다중 채팅방·검색·첨부·음성·코드 스니펫 카드·Resource/Task 탭** — 사용자 명시 없음. 디자인 시안의 부가 요소는 시각적 흉내만 (예: 하단 nav 표시는 하되 동작 없음)
- **글로벌 패키지 설치** — `npm i -g`·`pip install` (가상환경 없이) 금지. backend 는 venv, frontend 는 로컬 node_modules

## QA 시나리오

- **골든 패스**: 백 띄움 → 프론트 띄움 → 탭A 입장 ("철수") → 탭B 입장 ("영희") → 철수가 "안녕" 송신 → 영희 화면에 표시 → 영희가 답장 → 철수 화면에 표시 → 양쪽 모두 1초 안에 도착
- **엣지 1**: 빈 닉네임 + 입장 시도 → 입장 버튼 비활성 (또는 에러 안내)
- **엣지 2**: 채팅 중 새로고침 → 닉네임 화면부터 다시 (세션 X) → 재입장 가능
- **엣지 3**: 백엔드 끄고 프론트만 → 입장 시 연결 실패 안내 1줄

## 서브에이전트 루프 정의 (프로젝트 로컬)

`.claude/agents/developer.md` — 파란색. 코드 작성·수정. 본 spec + CLAUDE.md + Rules.md 자동 참조.

`.claude/agents/reviewer.md` — 노란색. developer 산출물 검수. 잘못된 부분 발견 시 "수정 프롬프트" 1편 생성해 developer 에게 재전달. 통과 판정 시 루프 종료.

루프 종료 조건: reviewer 가 "통과" 명시 또는 동일 지적 3회 반복 시 황호님께 보고.

## 카파시 하네스·루프 엔지니어링 (개념 주입 위치)

- **CLAUDE.md**: 하네스 엔지니어링 정의 + 본 프로젝트의 하네스 구성 요소 명시 (CLAUDE.md 자체 / Rules.md / 서브에이전트 / spec / Scope 강제 룰)
- **Rules.md**: 루프 엔지니어링 정의 + 작업마다 발견된 실패·잘못된 결정 자동 누적 섹션 (날짜·증상·근본 원인·재발 방지 1줄)

## 실행 방식

황호님 변경 2026-06-12 — Docker Compose 로 백그라운드 한 번에 실행. 볼륨 없음 (hot reload X, 코드 변경 시 rebuild).

- 메인: `docker compose up -d --build` (프로젝트 루트)
- 포트: 프론트 3000, 백 8000
- 중지: `docker compose down`
- 백업(수동 실행): `backend/.venv` + `npm run dev` 경로 README 에 유지

README.md 에 docker compose 명령을 메인 섹션, 수동 실행을 백업 섹션으로 배치.
