from datetime import datetime
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CHAT Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectionManager:
    def __init__(self) -> None:
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket) -> None:
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket) -> None:
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, payload: dict) -> None:
        dead: List[WebSocket] = []
        for ws in self.active:
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws)


manager = ConnectionManager()


@app.get("/health")
async def health() -> dict:
    return {"ok": True, "connections": len(manager.active)}


@app.websocket("/ws/{nickname}")
async def chat_ws(ws: WebSocket, nickname: str) -> None:
    await manager.connect(ws)
    try:
        while True:
            data = await ws.receive_json()
            text = (data or {}).get("text", "").strip()
            if not text:
                continue
            await manager.broadcast({
                "sender": nickname,
                "text": text,
                "timestamp": datetime.now().strftime("%H:%M"),
            })
    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)
