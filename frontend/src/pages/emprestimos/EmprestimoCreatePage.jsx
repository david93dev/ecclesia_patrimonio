import { useEffect, useState } from "react";
import { FiCalendar, FiPackage, FiSave, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LoanDialog } from "../../components/emprestimos/LoanDialog";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Button } from "../../components/ui/Button";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { createEmprestimo, listPatrimoniosDisponiveis } from "../../services/emprestimoService";

const today = new Date().toISOString().slice(0, 10);
const inputClass = (error) => `mt-2 min-h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-brand-600 focus:shadow-focus ${error ? "border-danger" : "border-border-input"}`;
const format = (value) => new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));

export const EmprestimoCreatePage = () => {
  const navigate = useNavigate(); const { user } = useAuth();
  const [assets, setAssets] = useState({ loading: true, items: [], error: "" });
  const [values, setValues] = useState({ patrimonioId: "", responsavel: "", finalidade: "", dataRetirada: today, dataPrevistaDevolucao: "" });
  const [errors, setErrors] = useState({}); const [dialog, setDialog] = useState(false); const [submitting, setSubmitting] = useState(false); const [submitError, setSubmitError] = useState("");
  useEffect(() => { listPatrimoniosDisponiveis().then((items) => setAssets({ loading: false, items, error: "" })).catch((error) => setAssets({ loading: false, items: [], error: error.message })); }, []);
  const asset = assets.items.find((item) => String(item.id) === values.patrimonioId);
  const update = ({ target }) => { setValues((current) => ({ ...current, [target.name]: target.value })); setErrors((current) => ({ ...current, [target.name]: "" })); };
  const validate = () => { const next = {}; Object.entries(values).forEach(([key, value]) => { if (!String(value).trim()) next[key] = "Campo obrigatório."; }); if (values.dataRetirada && values.dataPrevistaDevolucao && values.dataPrevistaDevolucao <= values.dataRetirada) next.dataPrevistaDevolucao = "A devolução deve ser posterior à retirada."; setErrors(next); return !Object.keys(next).length; };
  const submit = (event) => { event.preventDefault(); if (validate()) setDialog(true); };
  const confirm = async () => { setSubmitting(true); setSubmitError(""); try { const loan = await createEmprestimo(values, user); navigate(`/emprestimos/${loan.id}/termo`, { replace: true, state: { success: "Empréstimo registrado. Gere o termo para assinatura." } }); } catch (error) { setSubmitError(error.message); setSubmitting(false); } };
  const field = (name, label, children) => <label className="block text-xs font-bold text-label">{label}{children}{errors[name] && <span className="mt-1 block text-[11px] font-medium text-danger">{errors[name]}</span>}</label>;
  return <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10"><BackLink to="/emprestimos" className="mb-5">Voltar aos empréstimos</BackLink><PageHeader eyebrow="GESTÃO DE EMPRÉSTIMOS" title="Criar empréstimo" description="Informe quem ficará responsável pelo patrimônio e o período de utilização." />
    <PageFeedback loading={assets.loading} loadingMessage="Buscando patrimônios disponíveis..." error={assets.error} />
    {!assets.loading && !assets.error && <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">{field("patrimonioId", "Patrimônio", <select name="patrimonioId" value={values.patrimonioId} onChange={update} className={inputClass(errors.patrimonioId)}><option value="">Selecione um patrimônio disponível</option>{assets.items.map((item) => <option key={item.id} value={item.id}>{item.nome} — {item.codigoPatrimonial}</option>)}</select>)}</div>
        {field("responsavel", "Responsável pelo empréstimo", <input name="responsavel" value={values.responsavel} onChange={update} className={inputClass(errors.responsavel)} placeholder="Nome completo" />)}
        {field("finalidade", "Finalidade", <input name="finalidade" value={values.finalidade} onChange={update} className={inputClass(errors.finalidade)} placeholder="Ex.: Retiro da pastoral familiar" />)}
        {field("dataRetirada", "Data de retirada", <input type="date" name="dataRetirada" value={values.dataRetirada} onChange={update} className={inputClass(errors.dataRetirada)} />)}
        {field("dataPrevistaDevolucao", "Data prevista para devolução", <input type="date" name="dataPrevistaDevolucao" min={values.dataRetirada || today} value={values.dataPrevistaDevolucao} onChange={update} className={inputClass(errors.dataPrevistaDevolucao)} />)}
      </div>
      {asset && <section className="mt-6 rounded-2xl border border-brand-600/15 bg-brand-100/35 p-5"><div className="flex items-center gap-2 text-xs font-bold text-brand-700"><FiPackage /> PATRIMÔNIO SELECIONADO</div><h3 className="mt-3 font-[Manrope] font-bold">{asset.nome}</h3><div className="mt-3 grid gap-3 text-xs text-muted sm:grid-cols-3"><span><b className="block text-label">Código</b>{asset.codigoPatrimonial}</span><span><b className="block text-label">Categoria</b>{asset.categoria}</span><span><b className="block text-label">Departamento</b>{asset.departamento}</span></div></section>}
      {!assets.items.length && <p className="mt-5 rounded-xl bg-warning-soft p-4 text-sm text-warning">Não há patrimônios disponíveis para empréstimo no momento.</p>}
      <div className="mt-7 flex justify-end border-t border-border pt-6"><Button type="submit" variant="primary" Icon={FiSave} disabled={!assets.items.length}>Revisar e confirmar</Button></div>
    </form>}
    <LoanDialog open={dialog} title="Confirmar empréstimo?" confirmLabel="Confirmar empréstimo" loading={submitting} error={submitError} onCancel={() => setDialog(false)} onConfirm={confirm}><div className="grid gap-2 rounded-xl bg-surface-subtle p-4"><span className="flex gap-2"><FiPackage className="mt-1 shrink-0" /><b className="text-label">{asset?.nome}</b></span><span className="flex gap-2"><FiUser className="mt-1 shrink-0" />{values.responsavel}</span><span className="flex gap-2"><FiCalendar className="mt-1 shrink-0" />Retirada: {values.dataRetirada && format(values.dataRetirada)} · Devolução: {values.dataPrevistaDevolucao && format(values.dataPrevistaDevolucao)}</span></div></LoanDialog>
  </div>;
};
