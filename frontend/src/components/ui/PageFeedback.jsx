import { FiCheckCircle, FiInbox, FiXCircle } from "react-icons/fi";

export const PageFeedback = ({
  success,
  loading = false,
  loadingMessage = "Carregando...",
  error,
  empty = false,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription,
  EmptyIcon = FiInbox,
}) => (
  <>
    {success && (
      <div
        role="status"
        className="mb-5 flex items-center gap-3 rounded-xl border border-success/20 bg-success-soft p-4 text-sm font-medium text-success"
      >
        <FiCheckCircle className="shrink-0" size={19} aria-hidden="true" />
        {success}
      </div>
    )}

    {loading && (
      <div
        role="status"
        className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted"
      >
        {loadingMessage}
      </div>
    )}

    {!loading && error && (
      <div
        role="alert"
        className="rounded-2xl border border-danger/20 bg-danger-soft p-8 text-center"
      >
        <FiXCircle className="mx-auto text-danger" size={28} aria-hidden="true" />
        <p className="mt-2 text-sm text-danger">
          {error instanceof Error ? error.message : error}
        </p>
      </div>
    )}

    {!loading && !error && empty && (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
        <EmptyIcon className="mx-auto text-muted-faint" size={32} aria-hidden="true" />
        <h3 className="mt-3 font-bold">{emptyTitle}</h3>
        {emptyDescription && <p className="mt-1 text-sm text-muted">{emptyDescription}</p>}
      </div>
    )}
  </>
);
