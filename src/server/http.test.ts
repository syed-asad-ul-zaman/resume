import { describe, expect, it, vi } from "vitest";
import { overLimit, recordHit, reserve } from "./http";

/** Unique keys: the limit table is process-wide and shared with other tests. */
const freshKey = () => `test:${crypto.randomUUID()}`;

describe("reserve", () => {
  it("claims places so a burst cannot all pass the same check", () => {
    const key = freshKey();
    const first = reserve(key, 2, 60_000);
    const second = reserve(key, 2, 60_000);
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(reserve(key, 2, 60_000)).toBeNull();
    expect(overLimit(key, 2, 60_000)).toBe(true);
    first!();
    second!();
  });

  it("frees the place when a request fails", () => {
    const key = freshKey();
    const attempt = reserve(key, 1, 60_000);
    expect(attempt).not.toBeNull();
    expect(reserve(key, 1, 60_000)).toBeNull();
    attempt!();
    expect(overLimit(key, 1, 60_000)).toBe(false);
    const retry = reserve(key, 1, 60_000);
    expect(retry).not.toBeNull();
    retry!();
  });

  it("counts a recorded hit together with the places still in flight", () => {
    const key = freshKey();
    recordHit(key, 60_000);
    expect(overLimit(key, 2, 60_000)).toBe(false);
    const attempt = reserve(key, 2, 60_000);
    expect(attempt).not.toBeNull();
    // One recorded + one in flight = the whole allowance.
    expect(reserve(key, 2, 60_000)).toBeNull();
    attempt!();
  });

  it("ignores a second release of the same place", () => {
    const key = freshKey();
    const attempt = reserve(key, 1, 60_000);
    attempt!();
    attempt!();
    expect(overLimit(key, 1, 60_000)).toBe(false);
    const next = reserve(key, 1, 60_000);
    expect(next).not.toBeNull();
    next!();
  });

  it("stops counting a hit once its window has passed (fake timers)", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    try {
      const key = freshKey();
      recordHit(key, 60_000);
      expect(overLimit(key, 1, 60_000)).toBe(true);
      // The window expires by the clock alone: no waiting, no new request needed.
      vi.setSystemTime(Date.now() + 60_001);
      expect(overLimit(key, 1, 60_000)).toBe(false);
      const next = reserve(key, 1, 60_000);
      expect(next).not.toBeNull();
      next!();
    } finally {
      vi.useRealTimers();
    }
  });
});
