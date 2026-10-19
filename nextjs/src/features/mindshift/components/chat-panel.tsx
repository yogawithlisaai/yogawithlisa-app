"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useQueryClient } from "@tanstack/react-query";
import { PRACTICE_LOGS_QUERY_KEY } from "../hooks/use-practice-logs";

export function ChatPanel() {
  const qc = useQueryClient();
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/mindshift/chat" }),
    onFinish: () => {
      // The agent may have logged a practice via its tools — refresh stats/history.
      qc.invalidateQueries({ queryKey: PRACTICE_LOGS_QUERY_KEY });
    },
  });
  const [input, setInput] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div
      className="flex flex-col rounded-[20px]"
      style={{ backgroundColor: "var(--cream)", border: "1px solid var(--hairline)" }}
    >
      <div className="flex-1 space-y-4 overflow-y-auto p-6" style={{ minHeight: 420, maxHeight: 560 }}>
        {messages.length === 0 && (
          <div className="rounded-2xl p-4 text-sm" style={{ backgroundColor: "var(--linen)", color: "var(--muted)" }}>
            Hi, I&apos;m MindShift. Tell me how you&apos;re feeling today, or how your practice went, and
            I&apos;ll log it and suggest what to try next.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              style={
                m.role === "user"
                  ? { backgroundColor: "var(--teal)", color: "var(--linen)" }
                  : { backgroundColor: "var(--linen)", color: "var(--espresso)", border: "1px solid var(--hairline)" }
              }
            >
              {m.parts.map((part, i) => (part.type === "text" ? <span key={i}>{part.text}</span> : null))}
            </div>
          </div>
        ))}
        {status === "streaming" || status === "submitted" ? (
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            MindShift is thinking...
          </div>
        ) : null}
      </div>
      <form
        onSubmit={handleSend}
        className="flex gap-3 p-4"
        style={{ borderTop: "1px solid var(--hairline)" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Did 30 min vinyasa, feeling energized..."
          className="flex-1 rounded-full px-5 py-2.5 text-sm outline-none"
          style={{ border: "1px solid var(--hairline)", backgroundColor: "var(--linen)", color: "var(--espresso)" }}
        />
        <button
          type="submit"
          className="rounded-full px-6 text-xs font-semibold uppercase tracking-widest hover:opacity-90"
          style={{ backgroundColor: "var(--teal)", color: "var(--linen)", minHeight: 44 }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
