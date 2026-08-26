import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { getInstitutionSettings, updateInstitutionSettings } from "../../services/settingsService";

const inputClass = (error) => `mt-2 min-h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-brand-600 focus:shadow-focus ${error ? "border-danger" : "border-border-input"}`;
const digits = (value) => value.replace(/\D/g, "");
const maskDocument = (value) => digits(value).slice(0, 14).replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");
const maskZipCode = (value) => digits(value).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
const maskPhone = (value) => { const number = digits(value).slice(0, 11); return number.length > 10 ? number.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3") : number.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3"); };

export const InstitutionEditPage = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const canEdit = hasPermission("settings.institution.edit");
  const [state, setState] = useState({ loading: canEdit, error: "" });
  const [values, setValues] = useState({ churchName: "", document: "", phone: "", email: "", address: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "" });
  const [initialValues, setInitialValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [dialog, setDialog] = useState({ open: false, loading: false, error: "" });

  useEffect(() => { if (canEdit) getInstitutionSettings().then((data) => { const loaded = { churchName: data.churchName ?? "", document: data.document ?? "", phone: data.phone ?? "", email: data.email ?? "", address: data.address ?? "", number: data.number ?? "", complement: data.complement ?? "", neighborhood: data.neighborhood ?? "", city: data.city ?? "", state: data.state ?? "", zipCode: data.zipCode ?? "" }; setValues(loaded); setInitialValues(loaded); setState({ loading: false, error: "" }); }).catch((error) => setState({ loading: false, error: error.message })); }, [canEdit]);
  const update = ({ target }) => { let value = target.value; if (target.name === "document") value = maskDocument(value); if (target.name === "phone") value = maskPhone(value); if (target.name === "zipCode") value = maskZipCode(value); if (target.name === "state") value = value.replace(/[^a-z]/gi, "").slice(0, 2).toUpperCase(); setValues((current) => ({ ...current, [target.name]: value })); setErrors((current) => ({ ...current, [target.name]: "" })); };
  const validate = () => { const next = {}; ["churchName", "document", "email", "address", "number", "neighborhood", "city", "state", "zipCode"].forEach((key) => { if (!String(values[key] ?? "").trim()) next[key] = "Campo obrigatório."; }); if (values.document && digits(values.document).length !== 14) next.document = "Informe um CNPJ válido."; if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Informe um e-mail válido."; if (values.phone && ![10, 11].includes(digits(values.phone).length)) next.phone = "Informe um telefone válido."; if (values.zipCode && digits(values.zipCode).length !== 8) next.zipCode = "Informe um CEP válido."; if (values.state && values.state.length !== 2) next.state = "Informe a UF com 2 letras."; setErrors(next); return Object.keys(next).length === 0; };
  const submit = (event) => { event.preventDefault(); if (validate()) setDialog({ open: true, loading: false, error: "" }); };
  const confirm = async () => { setDialog((current) => ({ ...current, loading: true, error: "" })); try { await updateInstitutionSettings(values, user); navigate("/settings", { replace: true, state: { success: "Informações da igreja atualizadas com sucesso." } }); } catch (error) { setDialog((current) => ({ ...current, loading: false, error: error.message })); } };
  const hasChanges = initialValues && Object.keys(values).some((key) => String(values[key] ?? "") !== String(initialValues[key] ?? ""));
  const field = (name, label, required = false, props = {}) => <label className="block text-xs font-bold text-label">{label}{required && <span className="ml-1 text-danger">*</span>}<input name={name} value={values[name] ?? ""} onChange={update} className={inputClass(errors[name])} {...props} />{errors[name] && <span className="mt-1 block text-[11px] text-danger">{errors[name]}</span>}</label>;

  if (!canEdit) return <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10"><BackLink to="/settings" className="mb-5">Voltar</BackLink><PageFeedback error="Você não possui permissão para editar as informações da igreja." /></div>;
  return <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10"><BackLink to="/settings" className="mb-5">Voltar às configurações</BackLink><PageHeader eyebrow="CONFIGURAÇÕES" title="Editar informações da igreja" description="Campos marcados com * são obrigatórios." /><PageFeedback loading={state.loading} loadingMessage="Carregando informações..." error={state.error} />{!state.loading && !state.error && <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2">{field("churchName", "Nome da igreja", true)}</div>{field("document", "CNPJ", true, { inputMode: "numeric", placeholder: "00.000.000/0000-00" })}{field("phone", "Telefone (opcional)", false, { inputMode: "tel", placeholder: "(00) 00000-0000" })}{field("email", "E-mail", true, { type: "email" })}<div className="sm:col-span-2">{field("address", "Endereço", true)}</div>{field("number", "Número", true)}{field("complement", "Complemento (opcional)")}{field("neighborhood", "Bairro", true)}{field("city", "Cidade", true)}{field("state", "Estado (UF)", true, { placeholder: "CE" })}{field("zipCode", "CEP", true, { inputMode: "numeric", placeholder: "00000-000" })}</div><div className="mt-7 flex justify-end gap-3 border-t border-border pt-6"><Link to="/settings" className="grid h-10 place-items-center rounded-xl border border-border px-4 text-xs font-semibold text-muted">Cancelar</Link><Button type="submit" variant="primary" Icon={FiSave} disabled={!hasChanges}>Salvar alterações</Button></div></form>}<ConfirmDialog open={dialog.open} title="Salvar informações da igreja?" description="As alterações institucionais serão aplicadas imediatamente no sistema." confirmLabel="Salvar alterações" loading={dialog.loading} error={dialog.error} onConfirm={confirm} onCancel={() => setDialog({ open: false, loading: false, error: "" })} /></div>;
};
