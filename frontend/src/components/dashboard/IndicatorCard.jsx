export const IndicatorCard = ({ label, detail, value, Icon, tone }) => (
  <article className="group relative min-h-37 overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/35 hover:shadow-panel">
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-brand-400/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

    <header className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon size={15} strokeWidth={2} className={tone.split(" ")[1]} aria-hidden="true" />
        <p className="truncate text-xs font-semibold text-muted">{label}</p>
      </div>
      <span className={`size-1.5 shrink-0 rounded-full ${tone.split(" ")[0]}`} />
    </header>

    <div className="mt-5">
      <strong className="block font-[Manrope] text-[32px] leading-none font-bold tracking-[-1.5px] text-foreground-strong transition-colors group-hover:text-brand-900">
        {value ?? 0}
      </strong>
    </div>

    <footer className="mt-4 border-t border-border-subtle pt-3">
      <small className="text-[10px] text-muted-soft">{detail}</small>
    </footer>
  </article>
);
