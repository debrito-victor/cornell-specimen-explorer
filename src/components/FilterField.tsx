import { useEffect, useMemo, useRef, useState } from "react";

type FilterFieldProps = {
  column: string;
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
};

export default function FilterField({ column, label, values, options, onChange }: FilterFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredOptions = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const available = options.filter((option) => !values.includes(option));
    if (!lower) return available;
    return available.filter((option) => option.toLowerCase().includes(lower));
  }, [options, query, values]);

  const handleAddValue = (value: string) => {
    if (!value.trim()) return;
    if (values.includes(value)) return;
    onChange([...values, value]);
    setQuery("");
  };

  const handleRemove = (value: string) => {
    onChange(values.filter((item) => item !== value));
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </label>
      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-2 rounded-full bg-sky-200 px-3 py-1 text-xs font-semibold text-slate-800"
            >
              {value}
              <button
                type="button"
                className="text-slate-500 hover:text-slate-900"
                onClick={() => handleRemove(value)}
                aria-label={`Remove ${value} from ${column}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          className="input"
          value={query}
          placeholder={`Filter by ${label}`}
          onFocus={() => setOpen(true)}
          onChange={(event) => setQuery(event.target.value)}
        />
        {values.length > 0 && (
          <button
            className="btn"
            type="button"
            onClick={() => onChange([])}
            aria-label={`Clear ${column} filter`}
          >
            Clear
          </button>
        )}
      </div>
      {open && (
        <div
          className="scrollbar absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-black/10 bg-white/90 p-2 text-sm text-slate-900 shadow-xl"
          onMouseLeave={() => setOpen(false)}
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-slate-500">No matches</div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="w-full rounded-xl px-3 py-2 text-left hover:bg-cornell-50"
                onClick={() => {
                  handleAddValue(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
