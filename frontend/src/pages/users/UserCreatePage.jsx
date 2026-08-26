import { useEffect, useState } from "react";
import { FiCopy, FiEye, FiEyeOff, FiRefreshCw, FiSave } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Button } from "../../components/ui/Button";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { listDepartments } from "../../services/departmentService";
import { createUser } from "../../services/userService";

const inputClass = (error) => `mt-2 min-h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-brand-600 focus:shadow-focus ${error ? "border-danger" : "border-border-input"}`;
const generateTemporaryPassword = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";
  return Array.from(crypto.getRandomValues(new Uint32Array(12)), (value) => characters[value % characters.length]).join("");
};

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrador";
  const [departments, setDepartments] = useState({ loading: true, items: [], error: "" });
  const [useTemporaryPassword, setUseTemporaryPassword] = useState(true);
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [values, setValues] = useState(() => ({ name: "", email: "", phone: "", role: "", departmentId: "", password: generateTemporaryPassword(), passwordConfirmation: "" }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    listDepartments().then((items) => setDepartments({ loading: false, items, error: "" })).catch((error) => setDepartments({ loading: false, items: [], error: error.message }));
  }, [isAdmin]);

  const update = ({ target }) => {
    setValues((current) => ({ ...current, [target.name]: target.value }));
    setErrors((current) => ({ ...current, [target.name]: "" }));
  };
  const changePasswordMode = (temporary) => {
    setUseTemporaryPassword(temporary);
    setShowTemporaryPassword(false);
    setPasswordCopied(false);
    setValues((current) => ({ ...current, password: temporary ? generateTemporaryPassword() : "", passwordConfirmation: "" }));
    setErrors((current) => ({ ...current, password: "", passwordConfirmation: "" }));
  };
  const copyTemporaryPassword = async () => {
    try {
      await navigator.clipboard.writeText(values.password);
      setPasswordCopied(true);
    } catch {
      setPasswordCopied(false);
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Campo obrigatório.";
    if (!values.email.trim()) next.email = "Campo obrigatório.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Informe um e-mail válido.";
    if (values.phone && !/^\+?[\d\s().-]{8,20}$/.test(values.phone)) next.phone = "Informe um telefone válido.";
    if (!values.role) next.role = "Selecione um perfil.";
    if (values.password.length < 8) next.password = "A senha deve possuir pelo menos 8 caracteres.";
    if (!useTemporaryPassword && values.passwordConfirmation !== values.password) next.passwordConfirmation = "As senhas não coincidem.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true); setSubmitError("");
    try {
      const department = departments.items.find((item) => String(item.id) === values.departmentId);
      await createUser({ name: values.name, email: values.email, phone: values.phone, role: values.role, departmentId: values.departmentId || null, departmentName: department?.nome ?? null, password: values.password, temporaryPassword: useTemporaryPassword }, user);
      navigate("/users", { replace: true, state: { success: "Usuário cadastrado com sucesso. As credenciais de acesso já estão disponíveis." } });
    } catch (error) { setSubmitError(error.message); setSubmitting(false); }
  };

  if (!isAdmin) return <div className="mx-auto max-w-4xl p-5 sm:p-8 lg:p-10"><BackLink to="/users" className="mb-5">Voltar</BackLink><PageFeedback error="Apenas administradores podem cadastrar usuários." /></div>;
  const field = (name, label, control, required = false) => <label className="block text-xs font-bold text-label">{label}{required && <span className="ml-1 text-danger">*</span>}{control}{errors[name] && <span className="mt-1 block text-[11px] text-danger">{errors[name]}</span>}</label>;

  return <div className="mx-auto max-w-4xl p-5 sm:p-8 lg:p-10"><BackLink to="/users" className="mb-5">Voltar aos usuários</BackLink><PageHeader eyebrow="CONTROLE DE ACESSO" title="Cadastrar usuário" description="Campos marcados com * são obrigatórios." /><PageFeedback error={submitError || departments.error} /><form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2">{field("name", "Nome completo", <input name="name" value={values.name} onChange={update} className={inputClass(errors.name)} autoComplete="name" />, true)}</div>{field("email", "E-mail", <input name="email" type="email" value={values.email} onChange={update} className={inputClass(errors.email)} autoComplete="email" />, true)}{field("phone", "Telefone (opcional)", <input name="phone" type="tel" value={values.phone} onChange={update} className={inputClass(errors.phone)} placeholder="(85) 99999-9999" autoComplete="tel" />)}{field("role", "Perfil de acesso", <select name="role" value={values.role} onChange={update} className={inputClass(errors.role)}><option value="">Selecione</option><option>Administrador</option><option>Pastor</option><option>Supervisor</option><option>Líder</option></select>, true)}{field("departmentId", "Departamento (opcional)", <select name="departmentId" value={values.departmentId} onChange={update} className={inputClass(errors.departmentId)} disabled={departments.loading}><option value="">Sem departamento</option>{departments.items.map((department) => <option key={department.id} value={department.id}>{department.nome}</option>)}</select>)}<fieldset className="sm:col-span-2"><legend className="text-xs font-bold text-label">Senha inicial <span className="text-danger">*</span></legend><div className="mt-2 flex flex-wrap gap-4 text-sm"><label className="flex items-center gap-2"><input type="radio" checked={useTemporaryPassword} onChange={() => changePasswordMode(true)} />Gerar senha temporária</label><label className="flex items-center gap-2"><input type="radio" checked={!useTemporaryPassword} onChange={() => changePasswordMode(false)} />Definir senha inicial</label></div></fieldset><div className={useTemporaryPassword ? "sm:col-span-2" : ""}>{field("password", useTemporaryPassword ? "Senha temporária gerada" : "Senha inicial", <div className="relative"><input name="password" type={useTemporaryPassword && showTemporaryPassword ? "text" : "password"} value={values.password} onChange={update} readOnly={useTemporaryPassword} className={`${inputClass(errors.password)} ${useTemporaryPassword ? "pr-12 font-mono" : ""}`} autoComplete="new-password" />{useTemporaryPassword && <><button type="button" onClick={() => setShowTemporaryPassword((current) => !current)} aria-label={showTemporaryPassword ? "Ocultar senha" : "Visualizar senha"} title={showTemporaryPassword ? "Ocultar senha" : "Visualizar senha"} className="absolute top-4 right-3 grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-subtle hover:text-brand-700">{showTemporaryPassword ? <FiEyeOff /> : <FiEye />}</button><div className="mt-2 flex flex-wrap justify-end gap-2"><button type="button" onClick={copyTemporaryPassword} className="flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-brand-700 hover:bg-brand-100/40"><FiCopy />{passwordCopied ? "Copiada" : "Copiar senha"}</button><button type="button" onClick={() => { setValues((current) => ({ ...current, password: generateTemporaryPassword() })); setPasswordCopied(false); setShowTemporaryPassword(false); }} className="flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-brand-700 hover:bg-brand-100/40"><FiRefreshCw />Gerar outra senha</button></div></>}</div>, true)}</div>{!useTemporaryPassword && field("passwordConfirmation", "Confirmar senha", <input name="passwordConfirmation" type="password" value={values.passwordConfirmation} onChange={update} className={inputClass(errors.passwordConfirmation)} autoComplete="new-password" />, true)}</div><div className="mt-7 flex justify-end gap-3 border-t border-border pt-6"><Link to="/users" className="grid h-10 place-items-center rounded-xl border border-border px-4 text-xs font-semibold text-muted">Cancelar</Link><Button type="submit" variant="primary" Icon={FiSave} loading={submitting} loadingLabel="Cadastrando..." disabled={departments.loading || Object.values(errors).some(Boolean)}>Cadastrar usuário</Button></div></form></div>;
};
