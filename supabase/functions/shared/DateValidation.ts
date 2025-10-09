// Shared date validation utilities
// Strictly validate YYYY-MM-DD (zero-padded) and ensure it's a real calendar date in UTC.

export function isValidYYYYMMDDDate(raw: string): boolean {
  if (typeof raw !== "string") return false;
  const s = raw.trim();
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(s)) return false;
  const [yStr, mStr, dStr] = s.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() + 1 === m && dt.getUTCDate() === d;
}

export function normalizeYYYYMMDD(raw?: string): string | undefined {
  if (typeof raw !== "string") return undefined;
  const s = raw.trim();
  return s.length > 0 ? s : undefined;
}
