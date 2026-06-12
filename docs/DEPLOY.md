# 배포 가이드 — AWS EC2 (Ubuntu 24.04 + docker compose + nginx)

## 큰 그림

EC2 인스턴스 1대에 GitHub 클론 → `docker compose` 로 백/프론트 띄움 → 같은 서버 nginx 가 80 포트로 들어온 트래픽을 `/ws/*` → backend:8000, 나머지 → frontend:3000 으로 프록시. 공인 IP 만 외부에 노출, 3000·8000 은 보안그룹으로 차단.

```
브라우저 (80) → nginx → /ws/*  → backend:8000  (WebSocket)
                     → 나머지 → frontend:3000 (Next.js)
```

---

## Step 1. EC2 인스턴스 생성 (AWS 콘솔)

1. EC2 콘솔 → Launch instance
2. Name: `chat-server`
3. AMI: Ubuntu Server 24.04 LTS (free tier 표시 있는 것)
4. Instance type: `t3.micro` (또는 ARM `t4g.micro` — 더 저렴)
5. Key pair: 새로 만들기 → 이름 `chat-key` → .pem 다운로드. 로컬에서:
   ```bash
   mv ~/Downloads/chat-key.pem ~/.ssh/
   chmod 400 ~/.ssh/chat-key.pem
   ```
6. Network settings → Edit → 새 보안 그룹 만들고 인바운드 규칙:
   - SSH (22) — Source: My IP
   - HTTP (80) — Source: Anywhere (0.0.0.0/0)
   - 3000·8000 은 추가하지 말 것 (외부 접근 차단)
7. Storage: 20 GiB gp3
8. Launch instance

## Step 2. Elastic IP 할당 (권장)

인스턴스 재시작마다 공인 IP 바뀌면 곤란. EC2 콘솔 → Elastic IPs → Allocate → Associate → 위 인스턴스 선택. IP 고정.

## Step 3. SSH 접속

```bash
ssh -i ~/.ssh/chat-key.pem ubuntu@<공인IP>
```

처음엔 fingerprint 확인 → `yes`.

## Step 4. Docker + Compose 설치 (서버에서)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker ubuntu

exit
ssh -i ~/.ssh/chat-key.pem ubuntu@<공인IP>
docker --version && docker compose version
```

## Step 5. nginx 설치

```bash
sudo apt install -y nginx
sudo systemctl status nginx
```

## Step 6. 프로젝트 클론

```bash
cd ~
git clone https://github.com/sujung09/Trus.Edu-Chat.git
cd Trus.Edu-Chat
```

## Step 7. WebSocket URL 1줄 수정

`frontend/app/components/ChatRoom.tsx` 의 `const WS_BASE = ...` 줄을 아래로 교체. 현재 코드는 `ws://localhost:8000` 으로 박혀 있어서 브라우저 입장에서 본인 컴퓨터를 가리킴.

```bash
nano frontend/app/components/ChatRoom.tsx
```

```ts
const WS_BASE =
  typeof window !== "undefined"
    ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`
    : "";
```

`Ctrl+O` `Enter` `Ctrl+X` 로 저장.

## Step 8. docker compose 띄우기

```bash
docker compose up -d --build
docker compose ps
curl http://localhost:8000/health
curl -I http://localhost:3000
```

첫 빌드 3~5분.

## Step 9. nginx 리버스 프록시 설정

```bash
sudo nano /etc/nginx/sites-available/chat
```

```nginx
server {
    listen 80;
    server_name _;

    location /ws/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    location /health {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

활성화:

```bash
sudo ln -s /etc/nginx/sites-available/chat /etc/nginx/sites-enabled/chat
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Step 10. 검증

```bash
curl -I http://<공인IP>
curl http://<공인IP>/health
```

브라우저로 `http://<공인IP>` → 닉네임 입장 → 두 탭에서 채팅 동작 확인.

---

## 이후 업데이트 절차

로컬:
```bash
git add -A && git commit -m "변경 요약"
git push
```

서버:
```bash
ssh -i ~/.ssh/chat-key.pem ubuntu@<공인IP>
cd ~/Trus.Edu-Chat
git pull
docker compose up -d --build
exit
```

## 비용 절약

| 작업 | 위치 | 비고 |
|---|---|---|
| 인스턴스 중지 | EC2 콘솔 → Instance state → Stop | 컴퓨팅 과금 0, EBS 만 소액 |
| 재개 | Start instance | 1~2분 |
| 완전 삭제 | Terminate | 영구. Elastic IP 도 release |
| Elastic IP | 인스턴스 stop 중일 때 시간당 소액 과금 | 며칠 안 쓸 거면 release |

## 트러블슈팅

| 증상 | 점검 |
|---|---|
| ssh 거부 / timeout | 보안그룹 인바운드 22 가 본인 IP. `chmod 400 chat-key.pem` 권한 |
| `docker: permission denied` | usermod 후 재로그인 안 함 → exit → 다시 ssh |
| 502 Bad Gateway | `docker compose ps` 컨테이너 확인. `docker compose logs` 에러 |
| WebSocket 연결 끊김 | 브라우저 F12 → Network → WS 탭 → 101 Switching Protocols. nginx access log `sudo tail -f /var/log/nginx/access.log` |
| 빌드 중 OOM (t3.micro 1GB) | swap 1GB: `sudo fallocate -l 1G /swap && sudo chmod 600 /swap && sudo mkswap /swap && sudo swapon /swap && echo '/swap none swap sw 0 0' \| sudo tee -a /etc/fstab` |
| nginx 80 응답 없음 | `sudo systemctl status nginx` + 보안그룹 80 인바운드 |

## 보안 체크

- 보안그룹 인바운드: 22 (My IP), 80 (0.0.0.0/0) 만. 3000·8000 없어야 함
- `chat-key.pem` 절대 git push 금지 → `.gitignore` 에 `*.pem` 포함
- 정기적으로 `sudo apt update && sudo apt upgrade -y`

---

# 부록 — 일반 Ubuntu 서버 (AWS 없이)

위 가이드의 Step 4~10 동일. Step 1~3 (EC2·Elastic IP·SSH) 만 건너뛰고 본인 서버에 ssh 접속 후 시작.
