import Papa from "papaparse";

export type SpecimenRecord = Record<string, string>;

export type CsvLoadResult = {
  rows: SpecimenRecord[];
  headers: string[];
};

const headerOverrides: Record<string, string> = {
  "1,9-determinations,4.taxon.Order": "Order",
  "1,10.collectingevent.startDateNumericYear": "Year",
};

const tokenOverrides: Record<string, string> = {
  startDateNumericYear: "Year",
};

export function toDisplayLabel(header: string): string {
  if (headerOverrides[header]) return headerOverrides[header];

  const lastSegment = header.split(".").pop() ?? header;
  const cleaned = lastSegment.replace(/^[0-9]+[,._-]*/g, "");
  if (tokenOverrides[cleaned]) return tokenOverrides[cleaned];

  const spaced = cleaned
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!spaced) return header;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export async function loadCsvData(
  path = `${import.meta.env.BASE_URL}fish_collection.csv`,
): Promise<CsvLoadResult> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load CSV: ${response.status}`);
  }
  const text = await response.text();
  const parsed = Papa.parse<SpecimenRecord>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (header) => header.trim(),
  });
  if (parsed.errors.length) {
    console.warn("CSV parse warnings:", parsed.errors.slice(0, 5));
  }
  const headers = parsed.meta.fields ?? [];
  const rows = parsed.data
    .map((row) => {
      const normalized: SpecimenRecord = {};
      headers.forEach((header) => {
        const value = row[header];
        normalized[header] = typeof value === "string" ? value.trim() : "";
      });
      return normalized;
    })
    .filter((row) => Object.values(row).some((value) => value !== ""));

  return { rows, headers };
}

export function uniqueValuesForColumn(rows: SpecimenRecord[], column: string): string[] {
  const set = new Set<string>();
  rows.forEach((row) => {
    const value = row[column];
    if (value) {
      set.add(value);
    }
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
