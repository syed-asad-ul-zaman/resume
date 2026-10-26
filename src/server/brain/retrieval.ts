import "server-only";
import type { Tier } from "@/lib/persona/types";
import { query } from "../db";
import { embedTexts } from "./embeddings";

/**
 * Hybrid search over a published version's knowledge, used only when a persona is too big to put all of
 * it in the prompt. Three rankings - meaning (vector), words (full-text, English) and letter trigrams
 * (works for Urdu) - merged with reciprocal rank fusion. Only items the visitor's tier may see are
 * searched; private items are never stored at all.
 */
/**
 * Every ranking CTE must order before it limits: `row_number()` is computed over all matches, so a
 * bare LIMIT would keep an arbitrary twenty rows and hand their (possibly huge) ranks to the fusion.
 */
export const RETRIEVAL_SQL = `WITH
       v AS (SELECT item_key, content, row_number() OVER (ORDER BY embedding <=> $2::vector) AS r
             FROM brain_chunks WHERE version_id = $1 AND visibility = ANY($3) AND lang IN ('en', 'ur') AND embedding IS NOT NULL AND $2::text IS NOT NULL
             ORDER BY embedding <=> $2::vector LIMIT 20),
       t AS (SELECT item_key, content, row_number() OVER (ORDER BY ts_rank_cd(tsv, q) DESC) AS r
             FROM brain_chunks, plainto_tsquery('simple', $4) q WHERE version_id = $1 AND visibility = ANY($3) AND lang IN ('en', 'ur') AND tsv @@ q
             ORDER BY ts_rank_cd(tsv, q) DESC LIMIT 20),
       g AS (SELECT item_key, content, row_number() OVER (ORDER BY similarity(content, $4) DESC) AS r
             FROM brain_chunks WHERE version_id = $1 AND visibility = ANY($3) AND lang IN ('en', 'ur') AND similarity(content, $4) > 0.05
             ORDER BY similarity(content, $4) DESC LIMIT 20)
     SELECT item_key, content FROM (SELECT * FROM v UNION ALL SELECT * FROM t UNION ALL SELECT * FROM g) x
     GROUP BY item_key, content ORDER BY sum(1.0 / (60 + r)) DESC LIMIT $5`;

export async function retrieve(versionId: string, question: string, tier: Tier, limit = 8): Promise<{ itemKey: string; content: string }[]> {
  const visibilities = tier === "unlocked" ? ["public", "unlocked"] : ["public"];
  // No vector (model unreachable, or embedding-2 rejecting a parameter) degrades to words + trigrams
  // rather than failing the question; the vector CTE simply matches nothing when $2 is null.
  const [vector] = await embedTexts([question], "RETRIEVAL_QUERY").catch(() => [undefined]);
  const { rows } = await query<{ item_key: string; content: string }>(RETRIEVAL_SQL, [versionId, vector ?? null, visibilities, question, limit]);
  return rows.map((r) => ({ itemKey: r.item_key, content: r.content }));
}
