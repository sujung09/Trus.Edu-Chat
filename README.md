# CHAT — 교육용 실시간 그룹 채팅

WebSocket 기반 단일 그룹 채팅방. Next.js 15 (TS) + FastAPI.

## 폴더 구조

```
CHAT/
├── .claude/             # 프로젝트 로컬 서브에이전트 (글로벌과 별개)
├── .specs/              # 작업 사양서
├── backend/             # FastAPI + WebSocket + Dockerfile
├── frontend/            # Next.js 15 + Tailwind v4 + Dockerfile
├── design_guide/        # Lumina Learn 디자인 토큰 원본
├── docker-compose.yml   # 백/프론트 한 번에 띄우기
├── CLAUDE.md            # 프로젝트 규범 + 하네스 엔지니어링
├── Rules.md             # 루프 엔지니어링 + 자동 회고
└── README.md            # 본 파일
```

## 실행 (Docker Compose — 권장)

전제: Docker Desktop 또는 OrbStack 설치 후 실행 중.

### 백그라운드로 한 번에 띄우기

```bash
cd /Users/hsj910/Desktop/CHAT
docker compose up -d --build
```

`-d` 백그라운드 · `--build` 첫 실행 또는 코드 변경 후 이미지 재빌드.

- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:8000 (health: `/health`)

### 로그 보기

```bash
docker compose logs -f               # 양쪽 다
docker compose logs -f frontend      # 프론트만
docker compose logs -f backend       # 백만
```

### 중지

```bash
docker compose down                  # 컨테이너 중지 + 제거
docker compose stop                  # 컨테이너만 중지 (이미지 유지)
```

### 재시작 (코드 수정 후)

```bash
docker compose up -d --build
```

볼륨이 없어서 hot reload 안 됨 — 코드 변경하면 `--build` 로 재빌드.

## 수동 실행 (Docker 없을 때)

### 사전 준비 (한 번만)

```bash
# 백엔드
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# 프론트엔드
cd ../frontend
npm install
```

### 두 터미널로 실행

```bash
# 터미널 A
cd /Users/hsj910/Desktop/CHAT/backend
.venv/bin/uvicorn main:app --reload --port 8000

# 터미널 B
cd /Users/hsj910/Desktop/CHAT/frontend
npm run dev
```

브라우저에서 `http://localhost:3000` 열기.

## 동작 확인

1. 첫 화면에서 닉네임 입력 (예: `철수`) → "입장하기"
2. 새 탭에서 같은 주소 열고 다른 닉네임 (예: `영희`) 입력
3. 한쪽에서 메시지 송신 → 다른 쪽 화면에 1초 안에 표시

## 의도적으로 빠진 기능

교육·시연 목적이라 다음 기능은 도입하지 않음:

- 데이터베이스 / 메시지 영속화 (서버 메모리만, 입장 시점부터)
- 인증 / 닉네임 중복 차단
- 입장·퇴장 시스템 메시지
- Rate limit · XSS sanitize · CSRF
- 다중 채팅방 / 프로필 이미지 / 첨부 / 음성 / 검색

## 스코프 강제

본 프로젝트는 글로벌 (`~/.claude/`, 시스템 Python, `npm i -g`) 을 일절 건드리지 않음. 모든 의존성은 `backend/.venv/`, `frontend/node_modules/` 안에만. 상세는 `CLAUDE.md` § 2 참조.

## 개발 루프 (서브에이전트)

`.claude/agents/developer.md` (파란) + `.claude/agents/reviewer.md` (노랑) 가 프로젝트 로컬 서브에이전트로 등록됨. Claude Code 가 본 프로젝트에서 작업할 때:

1. developer 가 코드 작성
2. reviewer 가 8 항목 체크리스트로 검수 → 통과 또는 수정 프롬프트
3. 통과 시 루프 종료. 발견된 실패는 `Rules.md` 회고 영역에 1줄 누적
4. 다음 호출 시 Rules.md 가 자동 로드되어 같은 실수 방지

카파시의 하네스·루프 엔지니어링 개념은 `CLAUDE.md` § 1 과 `Rules.md` § 0 에 정리.
