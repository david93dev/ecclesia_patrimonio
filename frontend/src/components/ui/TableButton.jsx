import { Link } from "react-router-dom";

const variants = {
  default: "border-border text-muted hover:border-brand-400 hover:bg-brand-100/50 hover:text-brand-700",
  danger: "border-danger/20 text-danger hover:border-danger/40 hover:bg-danger-soft",
  success: "border-success/20 text-success hover:border-success/40 hover:bg-success-soft",
};

const classNames = (variant, className) =>
  `grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border bg-surface transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant] ?? variants.default} ${className}`;

export const TableButton = ({ to, Icon, label, title = label, variant = "default", className = "", ...props }) => {
  const content = Icon ? <Icon size={16} aria-hidden="true" /> : null;
  if (to) return <Link to={to} aria-label={label} title={title} className={classNames(variant, className)} {...props}>{content}</Link>;
  return <button type="button" aria-label={label} title={title} className={classNames(variant, className)} {...props}>{content}</button>;
};
