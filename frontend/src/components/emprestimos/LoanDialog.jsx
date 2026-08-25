import { useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { Button } from "../ui/Button";

export const LoanDialog = ({ open, title, children, confirmLabel, loading, error, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (event.key === "Escape" && !loading) onCancel(); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, loading, onCancel]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-mask/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel(); }}>
    <section role="alertdialog" aria-modal="true" className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-panel">
      <div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-xl bg-success-soft text-success"><FiCheckCircle size={21} /></span><button type="button" onClick={onCancel} disabled={loading} aria-label="Fechar" className="grid size-8 cursor-pointer place-items-center rounded-lg text-muted hover:bg-surface-subtle"><FiX /></button></div>
      <h2 className="mt-4 font-[Manrope] text-lg font-bold">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-muted">{children}</div>
      {error && <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-3 text-xs font-medium text-danger">{error}</p>}
      <div className="mt-6 flex justify-end gap-3"><Button onClick={onCancel} disabled={loading}>Cancelar</Button><Button variant="primary" onClick={onConfirm} loading={loading} loadingLabel="Registrando...">{confirmLabel}</Button></div>
    </section>
  </div>;
};
