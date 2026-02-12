import FilterField from "./FilterField";
import type { FilterState } from "../lib/filtering";

type FilterPanelProps = {
  headers: string[];
  headerLabels: Record<string, string>;
  uniqueValues: Record<string, string[]>;
  filters: FilterState;
  onChange: (column: string, values: string[]) => void;
  onClearAll: () => void;
};

export default function FilterPanel({
  headers,
  headerLabels,
  uniqueValues,
  filters,
  onChange,
  onClearAll,
}: FilterPanelProps) {
  const activeCount = Object.values(filters).filter((values) => values.length > 0).length;

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-900">Search Filters</p>
          <p className="text-sm text-slate-600">
            Build precise specimen searches with dynamic filters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge">{activeCount} active</span>
          <button className="btn" type="button" onClick={onClearAll}>
            Clear all
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 grid-cols-1">
        {headers.map((header) => (
          <FilterField
            key={header}
            column={header}
            label={headerLabels[header] ?? header}
            values={filters[header] ?? []}
            options={uniqueValues[header] ?? []}
            onChange={(values) => onChange(header, values)}
          />
        ))}
      </div>
    </div>
  );
}
