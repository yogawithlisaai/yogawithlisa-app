import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

let client: S3Client | undefined;

/** R2 speaks the S3 API — no Cloudflare-specific SDK needed, just a scoped endpoint. */
function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

/** Short-lived signed GET URL for a private-bucket object. Never call this for a signed-out visitor. */
export async function getSignedVideoUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_PRIVATE_BUCKET!,
    Key: key,
  });
  return getSignedUrl(getClient(), command, { expiresIn: SIGNED_URL_TTL_SECONDS });
}

/**
 * Free classes are served straight from the public bucket, no signing needed. Returns null
 * when the base URL isn't configured yet, instead of a URL with a literal "undefined" in it.
 */
export function getPublicVideoUrl(key: string): string | null {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
  return base ? `${base}/${key}` : null;
}
