const variants = {
  success: "border-success/15 bg-success-soft text-success",
  brand: "border-brand-600/15 bg-brand-100 text-brand-700",
  warning: "border-warning/15 bg-warning-soft text-warning",
  danger: "border-danger/15 bg-danger-soft text-danger",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  neutral: "border-border bg-surface-subtle text-muted",
};

const statusVariants = {
  ativo: "success",
  disponivel: "success",
  "em uso": "brand",
  "em manutencao": "warning",
  emprestado: "info",
  "em usufruto": "cyan",
  inativo: "neutral",
  baixado: "danger",
};

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const Badge = ({ children, variant = "neutral", className = "" }) => (
  <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${variants[variant] ?? variants.neutral} ${className}`}>
    {children}
  </span>
);

export const StatusBadge = ({ status, className = "" }) => (
  <Badge variant={statusVariants[normalize(status)] ?? "neutral"} className={className}>
    {status || "Não informado"}
  </Badge>
);
