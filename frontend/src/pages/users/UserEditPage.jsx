import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { listDepartments } from "../../services/departmentService";
import { getUser, updateUser } from "../../services/userService";

const inputClass = (error) => `mt-2 min-h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-brand-600 focus:shadow-focus ${error ? "border-danger" : "border-border-input"}`;

export const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "Administrador";
  const [state, setState] = useState({ loading: isAdmin, error: "" });
  const [departments, setDepartments] = useState([]);
  const [values, setValues] = useState({ name: "", email: "", phone: "", role: "", departmentId: "", password: "", passwordConfirmation: "" });
  const [initialValues, setInitialValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [dialog, setDialog] = useState({ open: false, loading: false, error: "" });

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([getUser(id), listDepartments()]).then(([registeredUser, departmentItems]) => {
      if (!registeredUser) return setState({ loading: false, error: "Usuário não encontrado." });
      const loaded = { name: registeredUser.name ?? "", email: registeredUser.email ?? "", phone: registeredUser.phone ?? "", role: registeredUser.role ?? "", departmentId: registeredUser.departmentId ?? "", password: "", passwordConfirmation: "" };
      setValues(loaded); setInitialValues(loaded); setDepartments(departmentItems); setState({ loading: false, error: "" });
    }).catch((error) => setState({ loading: false, error: error.message }));
  }, [id, isAdmin]);

  const update = ({ target }) => { setValues((current) => ({ ...current, [target.name]: target.value })); setErrors((current) => ({ ...current, [target.name]: "" })); };
  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Campo obrigatório.";
    if (!values.email.trim()) next.email = "Campo obrigatório.";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Informe um e-mail válido.";
    if (values.phone && !/^\+?[\d\s().-]{8,20}$/.test(values.phone)) next.phone = "Informe um telefone válido.";
    if (!values.role) next.role = "Selecione um perfil.";
    if (values.password && values.password.length < 8) next.password = "A nova senha deve possuir pelo menos 8 caracteres.";
    if (values.password && values.passwordConfirmation !== values.password) next.passwordConfirmation = "As senhas não coincidem.";
    if (!values.password && values.passwordConfirmation) next.passwordConfirmation = "Informe a nova senha antes da confirmação.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event) => { event.preventDefault(); if (validate()) setDialog({ open: true, loading: false, error: "" }); };
  const confirm = async () => {
    setDialog((current) => ({ ...current, loading: true, error: "" }));
    try {
      const department = departments.find((item) => String(item.id) === values.departmentId);
      await updateUser(id, { name: values.name, email: values.email, phone: values.phone, role: values.role, departmentId: values.departmentId || null, departmentName: department?.nome ?? null, password: values.password || undefined }, currentUser);
      navigate("/users", { replace: true, state: { success: "Usuário atualizado com sucesso." } });
    } catch (error) { setDialog((current) => ({ ...current, loading: false, error: error.message })); }
  };
  const hasChanges = initialValues && Object.keys(values).some((key) => String(values[key] ?? "") !== String(initialValues[key] ?? ""));
  const field = (name, label, control, required = false) => <label className="block text-xs font-bold text-label">{label}{required && <span className="ml-1 text-danger">*</span>}{control}{errors[name] && <span className="mt-1 block text-[11px] text-danger">{errors[name]}</span>}</label>;

  if (!isAdmin) return <div className="mx-auto max-w-4xl p-5 sm:p-8 lg:p-10"><BackLink to="/users" className="mb-5">Voltar</BackLink><PageFeedback error="Apenas administradores podem editar usuários." /></div>;
  return <div className="mx-auto max-w-4xl p-5 sm:p-8 lg:p-10"><BackLink to="/users" className="mb-5">Voltar aos usuários</BackLink><PageHeader eyebrow="CONTROLE DE ACESSO" title="Editar usuário" description="Atualize os dados cadastrais, o perfil e, se necessário, a senha." /><PageFeedback loading={state.loading} loadingMessage="Carregando usuário..." error={state.error} />{!state.loading && !state.error && <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2">{field("name", "Nome completo", <input name="name" value={values.name} onChange={update} className={inputClass(errors.name)} />, true)}</div>{field("email", "E-mail", <input name="email" type="email" value={values.email} onChange={update} className={inputClass(errors.email)} />, true)}{field("phone", "Telefone (opcional)", <input name="phone" type="tel" value={values.phone} onChange={update} className={inputClass(errors.phone)} placeholder="(85) 99999-9999" />)}{field("role", "Perfil de acesso", <select name="role" value={values.role} onChange={update} className={inputClass(errors.role)}><option value="">Selecione</option><option>Administrador</option><option>Pastor</option><option>Supervisor</option><option>Líder</option></select>, true)}{field("departmentId", "Departamento (opcional)", <select name="departmentId" value={values.departmentId} onChange={update} className={inputClass(errors.departmentId)}><option value="">Sem departamento</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.nome}</option>)}</select>)}<div className="sm:col-span-2 border-t border-border pt-5"><h3 className="text-sm font-bold text-label">Alterar senha</h3><p className="mt-1 text-xs text-muted">Deixe os campos em branco para manter a senha atual.</p></div>{field("password", "Nova senha (opcional)", <input name="password" type="password" value={values.password} onChange={update} className={inputClass(errors.password)} autoComplete="new-password" />)}{field("passwordConfirmation", "Confirmar nova senha", <input name="passwordConfirmation" type="password" value={values.passwordConfirmation} onChange={update} className={inputClass(errors.passwordConfirmation)} autoComplete="new-password" disabled={!values.password} />)}</div><div className="mt-7 flex justify-end gap-3 border-t border-border pt-6"><Link to="/users" className="grid h-10 place-items-center rounded-xl border border-border px-4 text-xs font-semibold text-muted">Cancelar</Link><Button type="submit" variant="primary" Icon={FiSave} disabled={!hasChanges}>Salvar alterações</Button></div></form>}<ConfirmDialog open={dialog.open} title="Salvar alterações?" description={`Confirme a atualização dos dados de ${values.name}${values.password ? ", incluindo a nova senha" : ""}.`} confirmLabel="Salvar alterações" loading={dialog.loading} error={dialog.error} onConfirm={confirm} onCancel={() => setDialog({ open: false, loading: false, error: "" })} /></div>;
};
