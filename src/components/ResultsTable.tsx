import type { SpecimenRecord } from "../lib/csv";
import { useEffect, useMemo, useRef } from "react";

type ResultsTableProps = {
  headers: string[];
  headerLabels?: Record<string, string>;
  rows: SpecimenRecord[];
  selectedRow: SpecimenRecord | null;
  onSelectRow: (row: SpecimenRecord) => void;
};

export default function ResultsTable({
  headers,
  headerLabels,
  rows,
  selectedRow,
  onSelectRow,
}: ResultsTableProps) {
  const rowRefs = useRef(new Map<number, HTMLTableRowElement>());

  useEffect(() => {
    if (!selectedRow) return;
    const index = rows.findIndex((row) => row === selectedRow);
    if (index === -1) return;
    const element = rowRefs.current.get(index);
    if (element) {
      element.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [rows, selectedRow]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">Filtered Specimens</p>
          <p className="text-sm text-slate-600">Review the current filtered dataset.</p>
        </div>
        <span className="badge">{rows.length} results</span>
      </div>

      <div className="scrollbar mt-6 max-h-[520px] overflow-auto rounded-2xl border border-sky-200 bg-white">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="table-header">
            <tr>
              {headers.map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {headerLabels?.[header] ?? header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isSelected = row === selectedRow;
              return (
                <tr
                  key={index}
                  ref={(el) => {
                    if (el) rowRefs.current.set(index, el);
                  }}
                  className={`border-t border-sky-100 hover:bg-sky-50 ${isSelected ? "bg-sky-100" : ""}`}
                  onClick={() => onSelectRow(row)}
                >
                {headers.map((header) => (
                  <td key={header} className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {row[header] || "-"}
                  </td>
                ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
