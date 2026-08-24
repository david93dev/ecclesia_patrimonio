import { useState } from "react";
import { FiArrowLeft, FiCheckCircle, FiImage, FiSave } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { createPatrimonio } from "../../services/patrimonioService";

const initialValues = { nome: "", descricao: "", categoria: "", departamento: "", tipo: "", responsavel: "", valor: "", dataAquisicao: "", imagem: null };
const requiredFields = ["nome", "descricao", "categoria", "departamento", "tipo", "responsavel"];

const fieldClass = (error) => `mt-2 min-h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-brand-600 focus:shadow-focus ${error ? "border-danger" : "border-border-input"}`;

const Field = ({ name, label, optional, children, formState, ...props }) => {
  const { values, errors, update } = formState;
  return (
    <label className="block text-xs font-bold text-label">
      {label} {optional && <span className="font-normal text-muted">(opcional)</span>}
      {children ?? <input name={name} value={values[name]} onChange={update} className={fieldClass(errors[name])} {...props} />}
      {errors[name] && <span className="mt-1 block text-[11px] font-medium text-danger">{errors[name]}</span>}
    </label>
  );
};

export const PatrimonioCreatePage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = ({ target }) => setValues((current) => ({ ...current, [target.name]: target.files?.[0] ?? target.value }));
  const validate = () => {
    const next = {};
    requiredFields.forEach((field) => { if (!String(values[field] ?? "").trim()) next[field] = "Campo obrigatório."; });
    if (values.valor && Number(values.valor) < 0) next.valor = "Informe um valor válido.";
    if (values.imagem && !values.imagem.type.startsWith("image/")) next.imagem = "Selecione um arquivo de imagem.";
    if (values.imagem?.size > 5 * 1024 * 1024) next.imagem = "A imagem deve ter no máximo 5 MB.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await createPatrimonio(values);
      navigate("/patrimonios", { replace: true, state: { success: "Patrimônio cadastrado com sucesso." } });
    } catch (error) {
      setSubmitError(error.message);
      setSubmitting(false);
    }
  };

  const formState = { values, errors, update };

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <Link to="/patrimonios" className="mb-5 flex w-fit items-center gap-2 text-xs font-bold text-brand-700"><FiArrowLeft /> Voltar à listagem</Link>
      <div className="mb-6"><h2 className="font-[Manrope] text-2xl font-bold">Cadastrar patrimônio</h2><p className="mt-1 text-sm text-muted">Preencha os dados para registrar um novo item.</p></div>
      <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8">
        {submitError && <div role="alert" className="mb-6 rounded-xl border border-danger/20 bg-danger-soft p-4 text-sm text-danger">{submitError}</div>}
        <div className="grid gap-5 md:grid-cols-2">
          <Field formState={formState} name="nome" label="Nome do patrimônio" placeholder="Ex.: Projetor multimídia" />
          <Field formState={formState} name="categoria" label="Categoria" placeholder="Ex.: Equipamentos" />
          <Field formState={formState} name="departamento" label="Departamento responsável" placeholder="Ex.: Comunicação" />
          <Field formState={formState} name="responsavel" label="Líder responsável" placeholder="Nome do responsável" />
          <Field formState={formState} name="tipo" label="Tipo do patrimônio">
            <select name="tipo" value={values.tipo} onChange={update} className={fieldClass(errors.tipo)}>
              <option value="">Selecione</option><option value="Próprio">Próprio</option><option value="Doação">Doação</option><option value="Usufruto">Usufruto</option>
            </select>
          </Field>
          <Field formState={formState} name="valor" label="Valor" optional type="number" min="0" step="0.01" placeholder="0,00" />
          <Field formState={formState} name="dataAquisicao" label="Data de aquisição" optional type="date" />
          <Field formState={formState} name="imagem" label="Imagem" optional>
            <label className={`${fieldClass(errors.imagem)} flex cursor-pointer items-center gap-3 text-muted`}><FiImage size={19} /><span className="truncate">{values.imagem?.name ?? "Selecionar imagem (máx. 5 MB)"}</span><input name="imagem" type="file" accept="image/*" onChange={update} className="sr-only" /></label>
          </Field>
          <Field formState={formState} name="descricao" label="Descrição">
            <textarea name="descricao" value={values.descricao} onChange={update} rows="5" placeholder="Descreva características e estado do item" className={`${fieldClass(errors.descricao)} py-3 md:min-h-32`} />
          </Field>
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Link to="/patrimonios" className="grid h-10 place-items-center rounded-xl border border-border px-4 text-xs font-semibold text-muted">Cancelar</Link>
          <Button type="submit" variant="primary" Icon={submitting ? FiCheckCircle : FiSave} loading={submitting} loadingLabel="Cadastrando...">Cadastrar patrimônio</Button>
        </div>
      </form>
    </div>
  );
};
