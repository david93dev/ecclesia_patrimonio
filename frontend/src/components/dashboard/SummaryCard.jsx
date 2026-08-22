export const SummaryCard = ({ title, description, values, Icon, tone = "warning" }) => {
  const total = values[0]?.value ?? 0;
  const maxValue = Math.max(...values.map(({ value }) => value ?? 0), 1);
  const styles = tone === "success"
    ? { icon: "bg-success-soft text-success", bar: "bg-success", glow: "from-success-soft/80" }
    : { icon: "bg-warning-soft text-warning", bar: "bg-accent", glow: "from-warning-soft/80" };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-panel">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b ${styles.glow} to-transparent opacity-55`} />

      <header className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${styles.icon}`}>
            <Icon size={20} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground-strong">{title}</h3>
            <p className="mt-0.5 text-[10px] text-muted-soft">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <strong className="block font-[Manrope] text-2xl leading-none tracking-[-.8px] text-foreground-strong">{total}</strong>
          <span className="mt-1 block text-[9px] font-semibold tracking-wide text-muted-faint uppercase">ativos</span>
        </div>
      </header>

      <dl className="relative mt-6 space-y-4">
        {values.map(({ label, value }, index) => {
          const safeValue = value ?? 0;
          const width = `${Math.max((safeValue / maxValue) * 100, safeValue ? 8 : 0)}%`;
          return (
            <div key={label}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <dt className={`text-[11px] ${index === 0 ? "font-semibold text-foreground" : "text-muted"}`}>{label}</dt>
                <dd className="rounded-md bg-surface-subtle px-2 py-0.5 font-[Manrope] text-xs font-bold text-foreground-strong">{safeValue}</dd>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border-subtle">
                <div className={`h-full rounded-full ${styles.bar} transition-all duration-500`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </dl>
    </article>
  );
};
