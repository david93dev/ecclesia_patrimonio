const readValue = (row, accessor) =>
  typeof accessor === "function" ? accessor(row) : row[accessor];

export const DataTable = ({
  columns,
  rows,
  getRowKey = (row) => row.id,
  gridTemplateColumns = `repeat(${columns.length}, minmax(0, 1fr))`,
  ariaLabel = "Tabela de dados",
  pagination,
  title,
  description,
  toolbar,
}) => {
  const visibleRows = pagination && pagination.mode !== "server"
    ? rows.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)
    : rows;
  const totalItems = pagination?.totalItems ?? rows.length;

  return (
  <div
    role="table"
    aria-label={ariaLabel}
    className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
  >
    {(title || description || toolbar) && (
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>{title && <h3 className="font-[Manrope] text-base font-bold">{title}</h3>}{description && <p className="mt-1 text-xs text-muted">{description}</p>}</div>
        {toolbar && <div className="w-full sm:max-w-sm">{toolbar}</div>}
      </div>
    )}
    <div
      role="row"
      style={{ gridTemplateColumns }}
      className="hidden gap-4 border-b border-border bg-surface-subtle px-5 py-3 text-[11px] font-bold text-muted md:grid"
    >
      {columns.map((column) => (
        <span role="columnheader" key={column.key} className={column.headerClassName}>
          {column.header}
        </span>
      ))}
    </div>

    <div role="rowgroup">
      {visibleRows.map((row) => (
        <div
          role="row"
          key={getRowKey(row)}
          style={{ "--data-table-columns": gridTemplateColumns }}
          className="data-table-row grid gap-3 border-b border-border-row p-5 last:border-0 md:items-center md:gap-4"
        >
          {columns.map((column) => (
            <div
              role="cell"
              key={column.key}
              className={`min-w-0 ${column.cellClassName ?? ""}`}
            >
              {column.mobileLabel !== false && (
                <span className="mb-1 block text-[10px] font-bold text-muted uppercase md:hidden">
                  {column.mobileLabel ?? column.header}
                </span>
              )}
              {column.render
                ? column.render(row)
                : readValue(row, column.accessor ?? column.key)}
            </div>
          ))}
        </div>
      ))}
    </div>
    {pagination && (
      <Pagination
        currentPage={pagination.currentPage}
        totalItems={totalItems}
        pageSize={pagination.pageSize}
        onPageChange={pagination.onPageChange}
        siblingCount={pagination.siblingCount}
        itemLabel={pagination.itemLabel ?? "registros"}
        className="mx-5 mb-5"
      />
    )}
  </div>
  );
};
import { Pagination } from "./Pagination";
