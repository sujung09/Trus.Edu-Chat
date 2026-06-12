"use client";

import { useState } from "react";

type Props = {
  onJoin: (nickname: string) => void;
};

export default function NicknameForm({ onJoin }: Props) {
  const [value, setValue] = useState("");

  const trimmed = value.trim();
  const canJoin = trimmed.length > 0 && trimmed.length <= 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canJoin) onJoin(trimmed);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="flex flex-col gap-2 text-center">
          <div className="mx-auto w-16 h-16 rounded-full story-ring">
            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-3xl">
                forum
              </span>
            </div>
          </div>
          <h1 className="text-display-lg text-on-surface mt-4">
            StudyGroup Chat
          </h1>
          <p className="text-body-md text-on-surface-variant">
            닉네임을 입력하고 그룹 채팅방에 입장하세요.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-surface-container border border-white/10 rounded-2xl p-6"
        >
          <label
            htmlFor="nickname"
            className="text-label-md text-on-surface-variant"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            autoFocus
            maxLength={20}
            placeholder="예: 철수"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-surface-container-high border border-white/10 rounded-full px-4 py-3 text-body-lg text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/40 transition-colors"
          />
          <button
            type="submit"
            disabled={!canJoin}
            className="w-full rounded-full bg-primary-container text-on-primary-container py-3 text-headline-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-transform shadow-lg shadow-primary/20"
          >
            입장하기
          </button>
        </form>

        <p className="text-label-md text-on-surface-variant/70 text-center">
          이 채팅방은 교육용이며 메시지는 저장되지 않습니다.
        </p>
      </div>
    </main>
  );
}
