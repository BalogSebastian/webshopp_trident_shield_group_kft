export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/g;
  for (const line of lines) {
    const cols = line.split(regex).map((c) => {
      let s = c.trim();
      if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
      return s;
    });
    rows.push(cols);
  }
  return rows;
}

export function parseHungarianNumber(input: string): number {
  if (input == null) return 0;
  let s = input.replace(/\u00A0/g, " ");
  s = s.replace(/\s+/g, "");
  s = s.replace(/Ft/gi, "");
  s = s.replace(/%/g, "");
  s = s.replace(/\./g, "");
  s = s.replace(",", ".");
  s = s.replace(/[^0-9\.\-]/g, "");
  if (s.trim() === "") return 0;
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

export function parseHungarianDate(input: string): Date {
  const m = input.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
  if (!m) return new Date(input);
  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10) - 1;
  const d = parseInt(m[3], 10);
  return new Date(y, mo, d);
}

export function toFixedNumber(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
