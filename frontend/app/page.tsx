"use client";

import { useState } from "react";
import NicknameForm from "./components/NicknameForm";
import ChatRoom from "./components/ChatRoom";

export default function Home() {
  const [nickname, setNickname] = useState<string | null>(null);

  if (!nickname) {
    return <NicknameForm onJoin={setNickname} />;
  }
  return <ChatRoom nickname={nickname} onLeave={() => setNickname(null)} />;
}
