import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from "react-icons/fi";

const getPages = (currentPage, totalPages, siblingCount) => {
  const visibleSlots = siblingCount * 2 + 5;
  if (totalPages <= visibleSlots) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const left = Math.max(currentPage - siblingCount, 1);
  const right = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < totalPages - 1;

  if (!showLeftEllipsis) {
    const end = 3 + siblingCount * 2;
    return [...Array.from({ length: end }, (_, index) => index + 1), "right-ellipsis", totalPages];
  }
  if (!showRightEllipsis) {
    const start = totalPages - (2 + siblingCount * 2);
    return [1, "left-ellipsis", ...Array.from({ length: totalPages - start + 1 }, (_, index) => start + index)];
  }
  return [1, "left-ellipsis", ...Array.from({ length: right - left + 1 }, (_, index) => left + index), "right-ellipsis", totalPages];
};

export const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  siblingCount = 1,
  itemLabel = "itens",
  className = "",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(currentPage, 1), totalPages);
  if (totalItems <= pageSize) return null;

  const goTo = (nextPage) => onPageChange(Math.min(Math.max(nextPage, 1), totalPages));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const buttonClass = "grid size-9 place-items-center rounded-lg border border-border bg-surface text-xs font-semibold text-muted transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40";

  return <nav aria-label="Paginação" className={`flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
    <p className="text-xs text-muted">Exibindo <strong className="text-label">{start}–{end}</strong> de <strong className="text-label">{totalItems}</strong> {itemLabel}</p>
    <div className="flex flex-wrap items-center gap-1.5">
      <button type="button" className={buttonClass} onClick={() => goTo(1)} disabled={page === 1} aria-label="Primeira página" title="Primeira página"><FiChevronsLeft /></button>
      <button type="button" className={buttonClass} onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Página anterior" title="Página anterior"><FiChevronLeft /></button>
      {getPages(page, totalPages, siblingCount).map((item) => typeof item === "number" ? (
        <button key={item} type="button" onClick={() => goTo(item)} aria-label={`Página ${item}`} aria-current={item === page ? "page" : undefined} className={`${buttonClass} ${item === page ? "!border-brand-700 !bg-brand-700 !text-white hover:!bg-brand-900 hover:!text-white" : ""}`}>{item}</button>
      ) : <span key={item} className="grid size-7 place-items-center text-xs text-muted" aria-hidden="true">…</span>)}
      <button type="button" className={buttonClass} onClick={() => goTo(page + 1)} disabled={page === totalPages} aria-label="Próxima página" title="Próxima página"><FiChevronRight /></button>
      <button type="button" className={buttonClass} onClick={() => goTo(totalPages)} disabled={page === totalPages} aria-label="Última página" title="Última página"><FiChevronsRight /></button>
    </div>
  </nav>;
};
