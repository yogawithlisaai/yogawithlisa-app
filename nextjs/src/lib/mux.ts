import Mux from "@mux/ts";

const TOKEN_TTL = "1h"; // matches R2's signed-URL TTL (src/lib/r2.ts)

let client: Mux | undefined;

function getClient(): Mux {
  if (!client) {
    client = new Mux({
      tokenId: process.env.MUX_TOKEN_ID!,
      tokenSecret: process.env.MUX_TOKEN_SECRET!,
    });
  }
  return client;
}

/**
 * Short-lived signed playback token. The playback ID alone is useless without this — it's minted
 * fresh on every /video-url request, only after isActiveMember() passes. Never cache or reuse
 * across users/requests.
 */
export async function createMuxPlaybackToken(playbackId: string): Promise<string> {
  return getClient().jwt.signPlaybackId(playbackId, {
    keyId: process.env.MUX_SIGNING_KEY_ID!,
    keySecret: process.env.MUX_SIGNING_KEY_PRIVATE_KEY!,
    expiration: TOKEN_TTL,
    type: "video",
  });
}

/** Used by scripts/add-class.mjs — returns { id, url } to PUT the local video file to. */
export async function createDirectUpload() {
  return getClient().video.uploads.create({
    cors_origin: "*",
    new_asset_settings: {
      playback_policy: ["signed"],
      video_quality: "basic",
    },
  });
}

export async function getUpload(uploadId: string) {
  return getClient().video.uploads.retrieve(uploadId);
}

export async function getAsset(assetId: string) {
  return getClient().video.assets.retrieve(assetId);
}
