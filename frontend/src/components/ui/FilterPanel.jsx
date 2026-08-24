import { useState } from "react";
import { FiChevronDown, FiFilter, FiX } from "react-icons/fi";

export const FilterPanel = ({ fields, values, onChange, onClear, resultCount, resultLabel = "registros", hasActiveFilters = false, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const activeCount = Object.values(values).filter(Boolean).length;
  return <section aria-label="Filtros" className="mb-5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-card sm:px-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded} className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left">
        <FiFilter className="text-brand-700" /><span className="text-sm font-bold">Filtros avançados</span>
        {activeCount > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] font-bold text-white">{activeCount}</span>}
        <FiChevronDown className={`ml-1 text-muted transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      <div className="flex items-center gap-3"><span className="text-xs text-muted"><strong className="text-label">{resultCount}</strong> {resultLabel}</span>
      {hasActiveFilters && <button type="button" onClick={onClear} className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent text-xs font-bold text-brand-700 hover:text-brand-900"><FiX /> Limpar filtros</button>}
      </div>
    </div>
    {expanded && <div className="mt-4 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">
      {fields.map((field) => <label key={field.key} className="text-xs font-bold text-label">{field.label}<select value={values[field.key] ?? ""} onChange={(event) => onChange(field.key, event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border-input bg-surface px-3 text-sm font-normal text-foreground outline-none transition focus:border-brand-600 focus:shadow-focus"><option value="">{field.placeholder ?? "Todos"}</option>{field.options.map((option) => { const value = typeof option === "string" ? option : option.value; const label = typeof option === "string" ? option : option.label; return <option key={value} value={value}>{label}</option>; })}</select></label>)}
    </div>}
  </section>
};
