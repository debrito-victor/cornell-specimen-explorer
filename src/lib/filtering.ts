import type { SpecimenRecord } from "./csv";

export type FilterState = Record<string, string[]>;

export function applyFilters(rows: SpecimenRecord[], filters: FilterState): SpecimenRecord[] {
  const active = Object.entries(filters).filter(([, values]) => values.length > 0);
  if (!active.length) return rows;

  return rows.filter((row) => {
    return active.every(([column, values]) => {
      const cell = (row[column] ?? "").toLowerCase();
      return values.some((value) => cell.includes(value.toLowerCase()));
    });
  });
}

export function detectColumn(headers: string[], candidates: string[]): string | null {
  const normalized = headers.map((header) => header.toLowerCase());
  for (const candidate of candidates) {
    const index = normalized.findIndex((header) => header === candidate.toLowerCase());
    if (index !== -1) return headers[index] ?? null;
  }
  for (const candidate of candidates) {
    const index = normalized.findIndex((header) => header.includes(candidate.toLowerCase()));
    if (index !== -1) return headers[index] ?? null;
  }
  return null;
}

export function toNumber(value: string | undefined | null): number | null {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}
