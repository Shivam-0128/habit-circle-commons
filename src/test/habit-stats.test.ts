import { describe, expect, it } from "vitest";
import { currentStreak, daysDone, lastDays } from "@/lib/habit-stats";

describe("habit stats", () => {
  it("last 7 days include today, formatted YYYY-MM-DD", () => {
    const days = lastDays(7, new Date(2026, 9, 20));
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2026-10-20");
    expect(days[6]).toBe("2026-10-14");
  });

  it("days done counts completed days", () => {
    expect(daysDone(["2026-10-01", "2026-10-03", "2026-10-04"])).toBe(3);
  });

  it("streak counts back from the most recent done day", () => {
    expect(currentStreak(["2026-10-15", "2026-10-17", "2026-10-18", "2026-10-19"])).toBe(3);
    expect(currentStreak(["2026-09-30", "2026-10-01"])).toBe(2);
    expect(currentStreak([])).toBe(0);
  });
});
