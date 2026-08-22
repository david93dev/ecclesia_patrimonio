const variants = {
  subtle: "border-border-control bg-surface text-brand-700 shadow-card hover:border-brand-400/50 hover:bg-brand-100/35 hover:text-brand-900 disabled:hover:border-border-control disabled:hover:bg-surface",
  primary: "border-brand-600 bg-brand-700 text-white shadow-primary hover:bg-brand-900 hover:shadow-primary-hover",
};

const iconVariants = {
  subtle: "bg-brand-100/70 text-brand-700 group-hover:bg-brand-100",
  primary: "bg-white/12 text-white group-hover:bg-white/18",
};

export const Button = ({
  children,
  Icon,
  loading = false,
  loadingLabel = "Carregando...",
  variant = "subtle",
  type = "button",
  disabled = false,
  className = "",
  iconClassName = "",
  ...buttonProps
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`group flex h-10 w-fit cursor-pointer items-center rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-[.98] disabled:cursor-wait disabled:opacity-60 ${Icon ? "gap-2 py-1 pr-3.5 pl-1" : "px-4"} ${variants[variant] ?? variants.subtle} ${className}`}
      {...buttonProps}
    >
      {Icon && (
        <span className={`grid size-8 shrink-0 place-items-center rounded-lg transition-colors ${iconVariants[variant] ?? iconVariants.subtle}`}>
          <Icon
            size={15}
            strokeWidth={2.2}
            className={`${loading ? "animate-spin" : "transition-transform duration-500 group-hover:rotate-180"} ${iconClassName}`}
            aria-hidden="true"
          />
        </span>
      )}
      <span className="whitespace-nowrap">{loading ? loadingLabel : children}</span>
    </button>
  );
};
