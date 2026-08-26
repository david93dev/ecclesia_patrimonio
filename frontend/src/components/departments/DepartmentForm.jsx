import { useState } from "react";
import { FiCheckCircle, FiSave } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

const emptyValues = { nome: "", descricao: "", lider: "" };
const inputClass = (error) => `mt-2 min-h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-brand-600 focus:shadow-focus ${error ? "border-danger" : "border-border-input"}`;

const Field = ({ name, label, optional, children, formState }) => {
  const { values, errors, update } = formState;
  return <label className="block text-xs font-bold text-label">{label} {optional && <span className="font-normal text-muted">(opcional)</span>}{children ?? <input name={name} value={values[name]} onChange={update} className={inputClass(errors[name])} />}{errors[name] && <span className="mt-1 block text-[11px] text-danger">{errors[name]}</span>}</label>;
};

export const DepartmentForm = ({ initialValues = emptyValues, onSubmit, editing = false }) => {
  const [values, setValues] = useState(() => ({ ...emptyValues, ...initialValues }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const hasChanges = Object.keys(emptyValues).some((key) => String(values[key] ?? "") !== String(initialValues[key] ?? ""));
  const update = ({ target }) => setValues((current) => ({ ...current, [target.name]: target.value }));
  const submit = async (event) => {
    event.preventDefault(); if (editing && !hasChanges) return;
    const next = {};
    if (!values.nome.trim()) next.nome = "Campo obrigatório.";
    if (!values.lider.trim()) next.lider = "Campo obrigatório.";
    setErrors(next); if (Object.keys(next).length) return;
    setSubmitting(true); setSubmitError("");
    try { await onSubmit(values); } catch (error) { setSubmitError(error.message); setSubmitting(false); }
  };
  const formState = { values, errors, update };

  return <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8">
    {submitError && <div role="alert" className="mb-6 rounded-xl border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{submitError}</div>}
    <div className="grid gap-5 md:grid-cols-2">
      <Field formState={formState} name="nome" label="Nome do departamento" />
      <Field formState={formState} name="lider" label="Líder responsável" />
      <Field formState={formState} name="descricao" label="Descrição" optional><textarea name="descricao" value={values.descricao} onChange={update} rows="5" className={`${inputClass(errors.descricao)} py-3 md:min-h-32`} /></Field>
      <label className="block text-xs font-bold text-label">Status<span className="mt-2 flex min-h-12 items-center rounded-xl border border-border bg-surface-subtle px-4 text-sm font-semibold text-success">Ativo</span></label>
    </div>
    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end"><Link to="/departments" className="grid h-10 place-items-center rounded-xl border border-border px-4 text-xs font-semibold text-muted">Cancelar</Link><Button type="submit" variant="primary" Icon={submitting ? FiCheckCircle : FiSave} loading={submitting} loadingLabel={editing ? "Salvando..." : "Cadastrando..."} disabled={editing && !hasChanges}>{editing ? "Salvar alterações" : "Cadastrar departamento"}</Button></div>
  </form>;
};

