import { useEffect, useState } from "react";
import { FiCalendar, FiCheck, FiPackage, FiUser } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { LoanDialog } from "../../components/emprestimos/LoanDialog";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Button } from "../../components/ui/Button";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { devolverEmprestimo, listEmprestimos } from "../../services/emprestimoService";

const today = new Date().toISOString().slice(0, 10);
const format = (value) => value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)) : "—";
const inputClass = (error) => `mt-2 min-h-12 w-full rounded-xl border bg-surface px-4 text-sm outline-none transition focus:border-brand-600 focus:shadow-focus ${error ? "border-danger" : "border-border-input"}`;

export const EmprestimoReturnPage = () => {
  const { id } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [state, setState] = useState({ loading: true, loan: null, error: "" });
  const [values, setValues] = useState({ dataDevolucao: today, condicao: "Bom estado", observacoes: "" });
  const [errors, setErrors] = useState({}); const [dialog, setDialog] = useState(false); const [submitting, setSubmitting] = useState(false); const [submitError, setSubmitError] = useState("");
  useEffect(() => { listEmprestimos().then((items) => { const loan = items.find((item) => String(item.id) === String(id)); setState({ loading: false, loan, error: loan ? "" : "Empréstimo não encontrado." }); }).catch((error) => setState({ loading: false, loan: null, error: error.message })); }, [id]);
  const update = ({ target }) => { setValues((current) => ({ ...current, [target.name]: target.value })); setErrors((current) => ({ ...current, [target.name]: "" })); };
  const needsNotes = values.condicao !== "Bom estado";
  const submit = (event) => { event.preventDefault(); const next = {}; if (!values.dataDevolucao) next.dataDevolucao = "Campo obrigatório."; if (!values.condicao) next.condicao = "Campo obrigatório."; if (needsNotes && !values.observacoes.trim()) next.observacoes = "Descreva a avaria ou dano encontrado."; setErrors(next); if (!Object.keys(next).length) setDialog(true); };
  const confirm = async () => { setSubmitting(true); setSubmitError(""); try { await devolverEmprestimo(id, values, user); navigate("/emprestimos", { replace: true, state: { success: "Devolução registrada com sucesso. O patrimônio voltou a ficar Disponível." } }); } catch (error) { setSubmitError(error.message); setSubmitting(false); } };
  const loan = state.loan;
  return <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10"><BackLink to="/emprestimos" className="mb-5">Voltar aos empréstimos</BackLink><PageHeader eyebrow="GESTÃO DE EMPRÉSTIMOS" title="Registrar devolução" description="Confira o empréstimo e informe a condição do patrimônio no retorno." /><PageFeedback loading={state.loading} loadingMessage="Carregando empréstimo..." error={state.error} />
    {loan && loan.status !== "Em aberto" && <PageFeedback error="Este empréstimo já foi devolvido e não pode ser encerrado novamente." />}
    {loan?.status === "Em aberto" && <><section className="mb-5 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><div><span className="flex items-center gap-2 text-[10px] font-bold text-muted"><FiPackage /> PATRIMÔNIO</span><b className="mt-2 block text-sm">{loan.patrimonio?.nome}</b><small className="text-muted">{loan.patrimonio?.codigoPatrimonial}</small></div><div><span className="flex items-center gap-2 text-[10px] font-bold text-muted"><FiUser /> RESPONSÁVEL</span><b className="mt-2 block text-sm">{loan.responsavel}</b></div><div><span className="flex items-center gap-2 text-[10px] font-bold text-muted"><FiCalendar /> RETIRADA</span><b className="mt-2 block text-sm">{format(loan.dataRetirada)}</b></div><div><span className="flex items-center gap-2 text-[10px] font-bold text-muted"><FiCalendar /> PREVISÃO</span><b className="mt-2 block text-sm">{format(loan.dataPrevistaDevolucao)}</b></div></div></section>
      <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8"><div className="grid gap-5 md:grid-cols-2"><label className="block text-xs font-bold text-label">Data da devolução<input type="date" name="dataDevolucao" value={values.dataDevolucao} onChange={update} className={inputClass(errors.dataDevolucao)} />{errors.dataDevolucao && <span className="mt-1 block text-[11px] text-danger">{errors.dataDevolucao}</span>}</label><label className="block text-xs font-bold text-label">Condição do patrimônio<select name="condicao" value={values.condicao} onChange={update} className={inputClass(errors.condicao)}><option>Bom estado</option><option>Com avarias</option><option>Danificado</option><option>Inutilizado</option></select></label><label className="block text-xs font-bold text-label md:col-span-2">Observações {!needsNotes && <span className="font-normal text-muted">(opcional)</span>}<textarea name="observacoes" value={values.observacoes} onChange={update} rows="5" placeholder={needsNotes ? "Descreva detalhadamente a situação encontrada" : "Informações adicionais sobre a devolução"} className={`${inputClass(errors.observacoes)} py-3`} />{errors.observacoes && <span className="mt-1 block text-[11px] text-danger">{errors.observacoes}</span>}</label></div>{needsNotes && <p className="mt-4 rounded-xl bg-warning-soft p-3 text-xs font-medium text-warning">A ocorrência será registrada no histórico do patrimônio.</p>}<div className="mt-7 flex justify-end border-t border-border pt-6"><Button type="submit" variant="primary" Icon={FiCheck}>Revisar devolução</Button></div></form>
      <LoanDialog open={dialog} title="Confirmar devolução?" confirmLabel="Finalizar devolução" loading={submitting} error={submitError} onCancel={() => setDialog(false)} onConfirm={confirm}><p>O empréstimo de <b className="text-label">{loan.patrimonio?.nome}</b> será encerrado e o patrimônio voltará ao status <b className="text-success">Disponível</b>.</p><p className="mt-2">Condição informada: <b className="text-label">{values.condicao}</b>.</p></LoanDialog>
    </>}
  </div>;
};
