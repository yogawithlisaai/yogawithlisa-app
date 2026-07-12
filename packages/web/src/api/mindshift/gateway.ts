import { createGateway } from "ai";

/**
 * AI gateway client. Requires `AI_GATEWAY_BASE_URL` and `AI_GATEWAY_API_KEY` in the
 * environment. Swap this out for a direct Anthropic/OpenAI provider if extracting
 * MindShift into a host app without Runable's gateway.
 */
export const gateway = createGateway({
  baseURL: process.env.AI_GATEWAY_BASE_URL,
  apiKey: process.env.AI_GATEWAY_API_KEY,
});
