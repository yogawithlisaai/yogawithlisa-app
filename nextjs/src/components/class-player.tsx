"use client";

import { useState } from "react";
import { posterUrl, type ClassVideo } from "@/lib/classes";

/**
 * Fetches a playable URL only when the visitor presses play, instead of on mount — the API
 * route decides then whether that's a public URL or a signed one, so no player ever holds a
 * private video's URL until this class is actually pressed play on.
 */
export function ClassPlayer({ v }: { v: ClassVideo }) {
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  if (!v.available) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
        <img
          src={posterUrl(v)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <span className="relative z-10 rounded-full bg-white/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink)]">
          Coming soon
        </span>
      </div>
    );
  }

  async function handlePlay() {
    if (src || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/classes/${v.id}/video-url`);
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      setSrc(data.url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  if (src) {
    return (
      <video
        src={src}
        poster={posterUrl(v)}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="h-full w-full"
      >
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={status === "loading"}
      aria-label={`Play ${v.title}`}
      className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-black"
    >
      <img
        src={posterUrl(v)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
        {status === "loading" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-ink)] border-t-transparent" />
        ) : (
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden="true">
            <path d="M17 10L0.5 19.5V0.5L17 10Z" fill="var(--color-ink)" />
          </svg>
        )}
      </span>
      {status === "error" && (
        <span className="absolute inset-x-3 bottom-3 z-10 text-center text-xs text-white">
          Could not load this video. Please try again.
        </span>
      )}
    </button>
  );
}
