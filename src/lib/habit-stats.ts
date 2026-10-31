export function toDayString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Last n days including today, newest first, as YYYY-MM-DD. */
export function lastDays(n: number, today: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    out.push(toDayString(d));
  }
  return out;
}

export function daysDone(days: string[]): number {
  return new Set(days).size;
}

/** Consecutive completed days counting back from the most recent completed day. */
export function currentStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const latest = [...set].sort().at(-1)!;
  const [y = 0, m = 1, d = 1] = latest.split("-").map(Number);
  let streak = 0;
  let cursor = new Date(y, m - 1, d);
  while (set.has(toDayString(cursor))) {
    streak++;
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1);
  }
  return streak;
}
