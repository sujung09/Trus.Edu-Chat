"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  nickname: string;
  onLeave: () => void;
};

type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

type ConnState = "connecting" | "open" | "closed";

const WS_BASE =
  process.env.NEXT_PUBLIC_WS_BASE ?? "ws://localhost:8000";

export default function ChatRoom({ nickname, onLeave }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [conn, setConn] = useState<ConnState>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const url = `${WS_BASE}/ws/${encodeURIComponent(nickname)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => setConn("open");
    ws.onclose = () => setConn("closed");
    ws.onerror = () => setConn("closed");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as Message;
        setMessages((prev) => [...prev, data]);
      } catch {
        // ignore malformed message
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [nickname]);

  useEffect(() => {
    feedRef.current?.scrollTo({
      top: feedRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ text }));
    setDraft("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-3 glass-header border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container/30 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">
              forum
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-headline-sm text-primary">StudyGroup Chat</h1>
            <p className="text-label-md text-on-surface-variant">
              {conn === "open"
                ? `${nickname} 으로 입장 중`
                : conn === "connecting"
                  ? "서버에 연결 중…"
                  : "연결 끊김 — 다시 입장하세요"}
            </p>
          </div>
        </div>
        <button
          onClick={onLeave}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
          aria-label="나가기"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            logout
          </span>
        </button>
      </header>

      <main className="flex-1 pt-20 pb-40">
        <section
          ref={feedRef}
          className="px-4 py-4 space-y-6 max-w-[800px] mx-auto w-full"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-on-surface-variant/70 gap-2 mt-10">
              <span className="material-symbols-outlined text-3xl">
                chat_bubble
              </span>
              <p className="text-body-md">
                첫 메시지를 보내 대화를 시작해보세요.
              </p>
            </div>
          )}
          {messages.map((m, i) => {
            const mine = m.sender === nickname;
            return (
              <div
                key={i}
                className={`flex flex-col gap-2 ${
                  mine ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2">
                  {!mine && (
                    <span className="text-label-md text-on-surface">
                      {m.sender}
                    </span>
                  )}
                  <span className="text-label-md text-on-surface-variant">
                    {m.timestamp}
                    {mine ? " • You" : ""}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] p-4 text-body-md ${
                    mine
                      ? "bg-primary-container/20 border border-primary/20 text-on-primary-container rounded-2xl rounded-tr-sm"
                      : "bg-surface-container-high text-on-surface rounded-2xl rounded-tl-sm border border-white/5"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <div className="fixed bottom-0 w-full z-40 bg-surface/80 backdrop-blur-2xl chat-input-shadow">
        <div className="px-4 py-3 flex items-center gap-2 max-w-[800px] mx-auto">
          <div className="flex-1 bg-surface-container-high rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              disabled={conn !== "open"}
              className="flex-1 bg-transparent border-none focus:outline-none text-on-surface text-body-md placeholder:text-on-surface-variant/50 disabled:opacity-50"
            />
          </div>
          <button
            onClick={send}
            disabled={conn !== "open" || draft.trim().length === 0}
            className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="보내기"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
          </button>
        </div>
        <nav className="w-full flex justify-around items-center px-4 pt-2 pb-3 border-t border-white/10">
          <span className="flex flex-col items-center justify-center text-primary bg-primary-container/20 rounded-xl px-4 py-1">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              chat_bubble
            </span>
            <span className="text-label-md">Chat</span>
          </span>
          <span className="flex flex-col items-center justify-center text-on-surface-variant/50">
            <span className="material-symbols-outlined">library_books</span>
            <span className="text-label-md">Resources</span>
          </span>
          <span className="flex flex-col items-center justify-center text-on-surface-variant/50">
            <span className="material-symbols-outlined">assignment</span>
            <span className="text-label-md">Tasks</span>
          </span>
        </nav>
      </div>
    </div>
  );
}
