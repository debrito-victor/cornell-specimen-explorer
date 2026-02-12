import { useEffect, useMemo, useState } from "react";
import { loadCsvData, toDisplayLabel, uniqueValuesForColumn } from "./lib/csv";
import { applyFilters, detectColumn } from "./lib/filtering";
import type { SpecimenRecord } from "./lib/csv";
import type { FilterState } from "./lib/filtering";
import FilterPanel from "./components/FilterPanel";
import ResultsTable from "./components/ResultsTable";
import Pagination from "./components/Pagination";
import MapPanel from "./components/MapPanel";
import Papa from "papaparse";

const defaultPageSize = 20;
const tableHeaderOverrides: Record<string, string> = {
  "1,9-determinations,4.taxon.Order": "Order",
  "1,9-determinations,4.taxon.Family": "Family",
  "1,9-determinations,4.taxon.Genus": "Genus",
  "1,9-determinations,4.taxon.Species": "Species",
  "1.collectionobject.catalogNumber": "CUMV Catalog Number",
  "1,63-preparations,65.preparation.prepType": "Preparation Type",
  "1,63-preparations.preparation.countAmt": "Count",
  "1,10.collectingevent.startDateNumericYear": "Year",
  "1,10.collectingevent.startDateNumericMonth": "Month",
  "1,10.collectingevent.startDateNumericDay": "Day",
  "1,10,2.locality.latitude1": "Latitude",
  "1,10,2.locality.longitude1": "Longitude",
  "1,10,2,3.geography.Country": "Country",
  "1,10,2,3.geography.State": "State",
  "1,10,2,3.geography.County": "County",
};

const filterHeaderOverrides: Record<string, string> = {
  "1.collectionobject.catalogNumber": "CUMV Catalog Number",
  "1,63-preparations,65.preparation.prepType": "Preparation Type",
  "1,63-preparations.preparation.countAmt": "Count",
  "1,10.collectingevent.startDateNumericMonth": "Month",
  "1,10.collectingevent.startDateNumericDay": "Day",
  "1,10,2.locality.latitude1": "Latitude",
  "1,10,2.locality.longitude1": "Longitude",
};

function createEmptyFilters(headers: string[]): FilterState {
  const filters: FilterState = {};
  headers.forEach((header) => {
    filters[header] = [];
  });
  return filters;
}

export default function App() {
  const [rows, setRows] = useState<SpecimenRecord[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedRow, setSelectedRow] = useState<SpecimenRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await loadCsvData();
        setRows(result.rows);
        setHeaders(result.headers);
        setFilters(createEmptyFilters(result.headers));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load CSV");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);


  const headerLabels = useMemo(() => {
    const map: Record<string, string> = {};
    headers.forEach((header) => {
      map[header] = toDisplayLabel(header);
    });
    return { ...map, ...filterHeaderOverrides };
  }, [headers]);

  const tableHeaderLabels = useMemo(() => {
    return { ...headerLabels, ...tableHeaderOverrides };
  }, [headerLabels]);

  const latColumn = useMemo(
    () => detectColumn(headers, ["decimal latitude", "decimallatitude", "latitude", "lat"]),
    [headers]
  );
  const lonColumn = useMemo(
    () => detectColumn(headers, ["decimal longitude", "decimallongitude", "longitude", "lon", "long"]),
    [headers]
  );
  const scientificColumn = useMemo(
    () => detectColumn(headers, ["scientificname", "scientific name", "species", "taxon"]),
    [headers]
  );
  const catalogColumn = useMemo(
    () => detectColumn(headers, ["catalognumber", "catalog number", "catalog", "specimen", "id"]),
    [headers]
  );
  const localityColumn = useMemo(
    () => detectColumn(headers, ["locality", "locality summary", "location", "county"]),
    [headers]
  );
  const filteredRows = useMemo(() => {
    return applyFilters(rows, filters);
  }, [rows, filters]);

  const uniqueValues = useMemo(() => {
    const map: Record<string, string[]> = {};
    headers.forEach((header) => {
      const filtersExcluding = { ...filters, [header]: [] };
      const rowsForOptions = applyFilters(rows, filtersExcluding);
      map[header] = uniqueValuesForColumn(rowsForOptions, header);
    });
    return map;
  }, [rows, headers, filters]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const handleFilterChange = (column: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [column]: values }));
    setPage(1);
    setSelectedRow(null);
  };

  const handleClearAll = () => {
    setFilters(createEmptyFilters(headers));
    setPage(1);
    setSelectedRow(null);
  };

  const handleExport = () => {
    const exportHeaders = headers.map((header) => tableHeaderLabels[header] ?? header);
    const exportRows = filteredRows.map((row) => headers.map((header) => row[header] ?? ""));
    const csv = Papa.unparse({
      fields: exportHeaders,
      data: exportRows,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_specimens.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleMapSelect = (row: SpecimenRecord) => {
    const index = filteredRows.findIndex((item) => item === row);
    if (index !== -1) {
      setPage(Math.floor(index / pageSize) + 1);
    }
    setSelectedRow(row);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-900">
        Loading specimen data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-900">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-sky-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div className="flex items-center gap-4">
            <img
              src={`${import.meta.env.BASE_URL}CUMV_logo.png`}
              alt="CUMV Logo"
              className="h-16 w-16"
            />
            <div>
              <p
                className="text-xs uppercase tracking-[0.4em] text-slate-600"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                Cornell University Museum of Vertebrates
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">Collection Database</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-96 xl:w-[28rem] flex-shrink-0">
            <FilterPanel
              headers={headers}
              headerLabels={headerLabels}
              uniqueValues={uniqueValues}
              filters={filters}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-6">
            <div className="card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  total={filteredRows.length}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
                <button className="btn btn-primary" type="button" onClick={handleExport}>
                  Export Results to CSV
                </button>
              </div>
            </div>

            <ResultsTable
              headers={headers}
              headerLabels={tableHeaderLabels}
              rows={paginatedRows}
              selectedRow={selectedRow}
              onSelectRow={setSelectedRow}
            />

            <div className="mt-6">
              <MapPanel
                rows={filteredRows}
                latColumn={latColumn}
                lonColumn={lonColumn}
                scientificColumn={scientificColumn}
                catalogColumn={catalogColumn}
                localityColumn={localityColumn}
                onSelectRow={handleMapSelect}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-sky-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-700">
          <p className="font-semibold">Cornell University Museum of Vertebrates</p>
          <p>159 Sapsucker Woods Road</p>
          <p>Ithaca, NY 14850-1923</p>
          <p>(607) 255-3682</p>
          <p>
            <a
              href="https://www.cumv.cornell.edu/"
              target="_blank"
              rel="noreferrer"
              className="text-sky-700 underline hover:text-sky-900"
            >
              www.cumv.cornell.edu
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
