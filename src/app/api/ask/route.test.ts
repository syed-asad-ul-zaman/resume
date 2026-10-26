import { afterEach, describe, expect, it, vi } from "vitest";

// after() schedules post-response work in Next; in a unit test the response is already gone.
vi.mock("next/server", () => ({ after: (fn: () => unknown) => void fn() }));

import { recordHit } from "@/server/http";
import { POST } from "./route";

const post = (headers: Record<string, string> = {}) =>
  new Request("https://example.com/api/ask/", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify({ question: "who are you?" }),
  });

describe("POST /api/ask", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("rejects a cross-site write before anything else runs", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const res = await POST(post({ "sec-fetch-site": "cross-site" }));
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ ok: false, error: "Forbidden." });
  });

  it("says the AI is off when no key is configured", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const res = await POST(post({ "sec-fetch-site": "same-origin" }));
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toMatchObject({ ok: false });
  });

  it("rejects a body that is not application/json", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const req = new Request("https://example.com/api/ask/", {
      method: "POST",
      headers: { "content-type": "text/plain", "sec-fetch-site": "same-origin" },
      body: "question=who are you?",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ ok: false, error: "Invalid request." });
  });

  it("stops at the day's cost cap before the model is called", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("AI_DAILY_LIMIT", "1");
    // One answer already counted today: the reserve below must refuse the next one.
    recordHit("ai:daily", 24 * 60 * 60_000);
    const res = await POST(post({ "sec-fetch-site": "same-origin" }));
    expect(res.status).toBe(429);
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: "The AI has answered enough for today - please pick a listed question.",
    });
  });
});
