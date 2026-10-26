import { describe, expect, it } from "vitest";
import { RETRIEVAL_SQL } from "./retrieval";

/**
 * Regression lock for the ranking bug: `row_number()` is computed over every match, so a CTE that
 * limits without ordering keeps an arbitrary twenty rows and hands their true (often huge) ranks to
 * the reciprocal-rank fusion. Each ranking CTE must order before it limits.
 */
const cte = (name: string) => {
  const start = RETRIEVAL_SQL.indexOf(`${name} AS (`);
  expect(start, `CTE ${name} is missing`).toBeGreaterThan(-1);
  const limit = RETRIEVAL_SQL.indexOf("LIMIT 20", start);
  expect(limit, `CTE ${name} has no LIMIT 20`).toBeGreaterThan(-1);
  return RETRIEVAL_SQL.slice(start, limit);
};

describe("the retrieval ranking query", () => {
  it.each(["v", "t", "g"])("orders CTE %s before it limits", (name) => {
    expect(cte(name)).toContain("ORDER BY");
  });

  it("ranks keyword hits by their own ts_rank_cd score", () => {
    expect(cte("t")).toMatch(/ORDER BY ts_rank_cd\(tsv, q\) DESC\s*$/);
  });

  it("fuses the three rankings with reciprocal rank fusion", () => {
    expect(RETRIEVAL_SQL).toContain("sum(1.0 / (60 + r))");
  });

  it("never searches above the visitor's tier", () => {
    expect(RETRIEVAL_SQL).toContain("visibility = ANY($3)");
  });
});
