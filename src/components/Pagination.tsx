type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const pageSizes = [20, 50, 100];

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-slate-700">
        Showing page {clampedPage} of {totalPages} ({total} records)
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Rows</span>
          <select
            className="input !w-auto !py-1"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn"
          type="button"
          onClick={() => onPageChange(1)}
          disabled={clampedPage === 1}
        >
          First
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => onPageChange(Math.max(1, clampedPage - 1))}
          disabled={clampedPage === 1}
        >
          Prev
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, clampedPage + 1))}
          disabled={clampedPage === totalPages}
        >
          Next
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={clampedPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
}
