import "server-only";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Gemini through the Vercel AI SDK. Model ids come from the environment, so switching models (or later
 * providers) needs no code change. GEMINI_BASE_URL exists for tests (a local fake Gemini); leave it unset.
 */

export const aiEnabled = () => !!process.env.GEMINI_API_KEY?.trim();

// 3.8 Flash, not a 2.5 model: Google restricts new projects' access to the 2.5 family, and every
// failed primary call would cost a full HEDGE_MS before the fallback answered.
export const chatModelId = () => process.env.AI_MODEL?.trim() || process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
/** Tried as well when the first model is slow, busy or gone. "" turns it off. */
export const fallbackModelId = () => (process.env.AI_FALLBACK_MODEL ?? process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash-lite").trim();
export const embeddingModelId = () => process.env.AI_EMBEDDING_MODEL?.trim() || "gemini-embedding-2";
export const EMBEDDING_DIMS = 768;

/**
 * Only the first Gemini embedding model takes its task as a `taskType` parameter. Embedding 2 moved
 * task instructions into the text itself, and rejects the parameter (see embeddingRecipe).
 */
export const supportsEmbeddingTaskType = (modelId: string) => modelId.trim() === "gemini-embedding-001";

let provider: ReturnType<typeof createGoogleGenerativeAI> | undefined;
let providerKey = "";

export function google() {
  const key = process.env.GEMINI_API_KEY?.trim() ?? "";
  if (!provider || providerKey !== key) {
    provider = createGoogleGenerativeAI({ apiKey: key, baseURL: process.env.GEMINI_BASE_URL?.trim() || undefined });
    providerKey = key;
  }
  return provider;
}
