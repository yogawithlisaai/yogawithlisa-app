"use client";

import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { posterUrl, type PublicClassVideo } from "@/lib/classes-client";

type VideoUrlResponse =
  | { kind: "direct"; url: string }
  | { kind: "youtube"; videoId: string }
  | { kind: "mux"; playbackId: string; token: string };

/**
 * Fetches a playable URL/token only when the visitor presses play, instead of on mount — the API
 * route decides then whether this class is free, a member, or neither, so no player ever holds a
 * private video's URL/token until this class is actually pressed play on.
 */
export function ClassPlayer({ v, onLocked }: { v: PublicClassVideo; onLocked?: () => void }) {
  const [playback, setPlayback] = useState<VideoUrlResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "locked">("idle");

  if (!v.available) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--color-dark-card)]">
        <img
          src={posterUrl(v.thumbnailKey)}
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
    if (playback || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/classes/${v.id}/video-url`);
      if (res.status === 401 || res.status === 403) {
        setStatus("locked");
        onLocked?.();
        return;
      }
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as VideoUrlResponse;
      setPlayback(data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  if (playback?.kind === "mux") {
    return (
      <MuxPlayer
        playbackId={playback.playbackId}
        tokens={{ playback: playback.token }}
        poster={posterUrl(v.thumbnailKey)}
        autoPlay
        style={{ height: "100%", width: "100%" }}
      />
    );
  }

  if (playback?.kind === "youtube") {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${playback.videoId}?autoplay=1`}
        title={v.title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (playback?.kind === "direct") {
    return (
      <video
        src={playback.url}
        poster={posterUrl(v.thumbnailKey)}
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
      className="group relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--color-dark-card)]"
    >
      <img
        src={posterUrl(v.thumbnailKey)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      {!v.isFree && (
        <span className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white" aria-hidden="true">
          🔒
        </span>
      )}
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
      {status === "locked" && (
        <span className="absolute inset-x-3 bottom-3 z-10 text-center text-xs text-white">
          Members only. Join below to unlock this class.
        </span>
      )}
    </button>
  );
}
