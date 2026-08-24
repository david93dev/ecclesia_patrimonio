import { FiSearch, FiX } from "react-icons/fi";

export const SearchField = ({ value, onChange, placeholder = "Pesquisar...", label = "Pesquisar", hideLabel = false, className = "" }) => (
  <label className={`block ${className}`}>
    <span className={hideLabel ? "sr-only" : "mb-2 block text-xs font-bold text-label"}>{label}</span>
    <span className="relative block">
      <FiSearch className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" size={17} aria-hidden="true" />
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-border-input bg-surface pr-11 pl-11 text-sm outline-none transition placeholder:text-placeholder focus:border-brand-600 focus:shadow-focus" />
      {value && <button type="button" onClick={() => onChange("")} aria-label="Limpar pesquisa" title="Limpar pesquisa" className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-muted hover:bg-surface-subtle hover:text-brand-700"><FiX size={16} /></button>}
    </span>
  </label>
);
