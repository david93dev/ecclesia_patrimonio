import { useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { Button } from "./Button";

export const ConfirmDialog = ({ open, title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", loading = false, error, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape" && !loading) onCancel(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, loading, onCancel]);

  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-mask/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel(); }}>
    <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-danger-soft text-danger"><FiAlertTriangle size={21} /></span><button type="button" onClick={onCancel} disabled={loading} aria-label="Fechar" className="grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-muted hover:bg-surface-subtle"><FiX /></button></div>
      <h2 id="confirm-dialog-title" className="mt-4 font-[Manrope] text-lg font-bold">{title}</h2>
      <p id="confirm-dialog-description" className="mt-2 text-sm leading-6 text-muted">{description}</p>
      {error && <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-3 text-xs font-medium text-danger">{error}</p>}
      <div className="mt-6 flex justify-end gap-3"><Button onClick={onCancel} disabled={loading}> {cancelLabel} </Button><Button variant="danger" onClick={onConfirm} loading={loading} loadingLabel="Inativando...">{confirmLabel}</Button></div>
    </section>
  </div>;
};
