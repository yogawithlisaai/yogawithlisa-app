/**
 * POSTs JSON and throws on any non-ok response (401, 500, etc.) instead of letting the caller
 * treat the parsed error body as a success. Use this for any mutation that reports "Saved" —
 * react-query only runs onError when the mutationFn actually throws.
 */
export async function postJson<T = unknown>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }
  return res.json();
}
