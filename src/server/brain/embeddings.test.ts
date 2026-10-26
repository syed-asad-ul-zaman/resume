import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The provider is the only thing stubbed: everything below it is the real code path.
const { embedMany } = vi.hoisted(() => ({ embedMany: vi.fn() }));
vi.mock("ai", () => ({ embedMany }));

import { EMBEDDING_RECIPE, cacheKey, embedTexts, embeddingRecipe } from "./embeddings";
import { EMBEDDING_DIMS, embeddingModelId } from "./model";

describe("the embedding recipe", () => {
  it("sends embedding-2 its task as a prompt prefix, never as a parameter", () => {
    expect(embeddingRecipe("gemini-embedding-2", "RETRIEVAL_QUERY")).toEqual({ prefix: "task: question answering | query: " });
    expect(embeddingRecipe("gemini-embedding-2", "RETRIEVAL_DOCUMENT")).toEqual({ prefix: "title: none | text: " });
  });

  it("keeps the taskType parameter for the model that takes one", () => {
    expect(embeddingRecipe("gemini-embedding-001", "RETRIEVAL_QUERY")).toEqual({ prefix: "", taskType: "RETRIEVAL_QUERY" });
  });
});

describe("the embedding cache key", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("changes when the recipe changes, so old vectors are never reused", () => {
    const text = "a piece of knowledge";
    const beforeRecipe = createHash("sha256").update(`${embeddingModelId()}|${EMBEDDING_DIMS}|${text}`).digest("hex");
    expect(EMBEDDING_RECIPE).toBeGreaterThanOrEqual(2);
    expect(cacheKey(text)).not.toBe(beforeRecipe);
  });

  it("changes with the model and is stable for the same input", () => {
    vi.stubEnv("AI_EMBEDDING_MODEL", "gemini-embedding-2");
    const a = cacheKey("same text");
    expect(cacheKey("same text")).toBe(a);
    vi.stubEnv("AI_EMBEDDING_MODEL", "gemini-embedding-001");
    expect(cacheKey("same text")).not.toBe(a);
  });
});

describe("embedTexts", () => {
  beforeEach(() => {
    embedMany.mockReset();
    vi.stubEnv("AI_EMBEDDING_MODEL", "gemini-embedding-2");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("sends the prefixed text and no taskType to embedding-2", async () => {
    embedMany.mockResolvedValue({ embeddings: [[1, 0]] });
    await embedTexts(["who is this?"], "RETRIEVAL_QUERY");
    const sent = embedMany.mock.calls[0][0];
    expect(sent.values).toEqual(["task: question answering | query: who is this?"]);
    expect(sent.providerOptions.google.taskType).toBeUndefined();
    expect(sent.providerOptions.google.outputDimensionality).toBe(EMBEDDING_DIMS);
  });

  it("refuses a short batch instead of writing holes that reach SQL as NULL", async () => {
    embedMany.mockResolvedValue({ embeddings: [[1, 0]] });
    await expect(embedTexts(["one", "two"], "RETRIEVAL_QUERY")).rejects.toThrow(/returned 1 vectors for 2 texts/);
  });

  it("normalises every vector it returns", async () => {
    embedMany.mockResolvedValue({ embeddings: [[3, 4]] });
    const [vector] = await embedTexts(["x"], "RETRIEVAL_QUERY");
    // 3-4-5 triangle: the output must be the unit vector, formatted for pgvector.
    expect(vector).toBe("[0.6000000,0.8000000]");
  });
});
