import { useMemo, useState } from "react";
import { FiClock } from "react-icons/fi";
import { Pagination } from "../ui/Pagination";

const PAGE_SIZE = 4;
const formatDate = (value) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

export const AssetHistory = ({ entries = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const orderedEntries = useMemo(() => [...entries].sort((a, b) => new Date(b.data) - new Date(a.data)), [entries]);
  const totalPages = Math.max(1, Math.ceil(orderedEntries.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleEntries = orderedEntries.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (orderedEntries.length === 0) return null;
  return <section className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8">
    <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-lg bg-brand-100 text-brand-700"><FiClock /></span><div><h3 className="font-[Manrope] text-lg font-bold">Histórico de alterações</h3><p className="text-xs text-muted">Atualizações mais recentes do patrimônio.</p></div></div>
    <div className="mt-6 space-y-5">
      {visibleEntries.map((entry, index) => <article key={`${entry.data}-${index}`} className="border-l-2 border-brand-400 pl-4">
        <div className="flex flex-wrap items-center gap-x-2"><strong className="text-sm">{entry.acao}</strong><time dateTime={entry.data} className="text-[11px] text-muted">{formatDate(entry.data)}</time></div>
        <ul className="mt-2 space-y-1 text-xs text-muted">{entry.alteracoes?.map((change) => <li key={change.campo}><span className="font-semibold text-label">{change.campo}:</span> {String(change.anterior || "não informado")} → {String(change.atual || "não informado")}</li>)}</ul>
      </article>)}
    </div>
    <Pagination currentPage={safePage} totalItems={orderedEntries.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} itemLabel="alterações" className="mt-6" />
  </section>;
};

