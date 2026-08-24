import { Link } from "react-router-dom";

const actionClassName =
  "flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl border-0 bg-brand-700 px-4 text-xs font-semibold text-white transition hover:bg-brand-900";

export const PageHeader = ({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  ActionIcon,
  onAction,
}) => {
  const actionContent = (
    <>
      {ActionIcon && <ActionIcon size={16} aria-hidden="true" />}
      {actionLabel}
    </>
  );

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <span className="text-[11px] font-bold text-brand-700">
            {eyebrow}
          </span>
        )}
        <h2 className={`${eyebrow ? "mt-1" : ""} font-[Manrope] text-2xl font-bold`}>
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>

      {actionLabel && actionTo && (
        <Link to={actionTo} className={actionClassName}>
          {actionContent}
        </Link>
      )}

      {actionLabel && !actionTo && (
        <button type="button" onClick={onAction} className={actionClassName}>
          {actionContent}
        </button>
      )}
    </header>
  );
};
