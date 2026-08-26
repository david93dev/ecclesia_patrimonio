import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCornerDownLeft,
  FiDownload,
  FiFileText,
  FiPackage,
  FiPrinter,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Badge } from "../../components/ui/Badge";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import {
  attachSignedTerm,
  getLoanStatus,
  listLoans,
} from "../../services/loanService";

const formatDate = (value, withTime = false) => {
  if (!value) return "Não informado";
  if (!withTime)
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
      new Date(`${value.slice(0, 10)}T12:00:00Z`),
    );
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};
const variants = {
  Emprestado: "info",
  Devolvido: "success",
  Atrasado: "danger",
};
const Detail = ({ label, value, Icon }) => (
  <div className="min-w-0">
    <span className="flex items-center gap-2 text-[10px] font-bold tracking-wide text-muted uppercase">
      {Icon && <Icon size={14} />}
      {label}
    </span>
    <p className="mt-2 text-sm font-semibold break-words text-label">
      {value || "Não informado"}
    </p>
  </div>
);

export const LoanDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, loan: null, error: "" });
  const [upload, setUpload] = useState({
    loading: false,
    error: "",
    success: "",
  });
  useEffect(() => {
    listLoans()
      .then((items) => {
        const loan = items.find((item) => String(item.id) === String(id));
        setState({
          loading: false,
          loan,
          error: loan ? "" : "Empréstimo não encontrado.",
        });
      })
      .catch((error) =>
        setState({ loading: false, loan: null, error: error.message }),
      );
  }, [id]);
  const loan = state.loan;
  const status = loan ? getLoanStatus(loan) : "";
  const attachTerm = async ({ target }) => {
    const file = target.files?.[0];
    target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf")
      return setUpload({
        loading: false,
        error: "Selecione um documento PDF.",
        success: "",
      });
    if (file.size > 10 * 1024 * 1024)
      return setUpload({
        loading: false,
        error: "O PDF deve ter no máximo 10 MB.",
        success: "",
      });
    setUpload({ loading: true, error: "", success: "" });
    try {
      const updated = await attachSignedTerm(id, file, user);
      setState((current) => ({ ...current, loan: updated }));
      setUpload({
        loading: false,
        error: "",
        success: "Termo assinado anexado com sucesso.",
      });
    } catch (error) {
      setUpload({ loading: false, error: error.message, success: "" });
    }
  };
  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <BackLink to="/loans" className="mb-5">
        Voltar aos empréstimos
      </BackLink>
      <PageHeader
        eyebrow="GESTÃO DE EMPRÉSTIMOS"
        title="Detalhes do empréstimo"
        description="Consulte todas as informações e responsabilidades desta movimentação."
        actions={
          loan ? (
            <>
              <Link
                to={`/loans/${loan.id}/term`}
                className="flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-semibold text-brand-700 hover:bg-brand-100/40"
              >
                <FiPrinter />
                Termo
              </Link>
              {loan.status === "Em aberto" && (
                <Link
                  to={`/loans/${loan.id}/return`}
                  className="flex h-10 items-center gap-2 rounded-xl bg-brand-700 px-4 text-xs font-semibold text-white hover:bg-brand-900"
                >
                  <FiCornerDownLeft />
                  Registrar devolução
                </Link>
              )}
            </>
          ) : null
        }
      />
      <PageFeedback
        loading={state.loading}
        loadingMessage="Carregando detalhes..."
        error={state.error}
      />
      {loan && (
        <div className="space-y-5">
          <section
            className={`rounded-2xl border bg-surface p-5 shadow-card sm:p-7 ${status === "Atrasado" ? "border-danger/35" : "border-border"}`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700">
                  <FiPackage size={22} />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-muted">
                    PATRIMÔNIO
                  </span>
                  <h3 className="mt-1 font-[Manrope] text-lg font-bold">
                    {loan.patrimonio?.nome}
                  </h3>
                  <p className="text-xs text-muted">
                    {loan.patrimonio?.codigoPatrimonial} ·{" "}
                    {loan.patrimonio?.categoria}
                  </p>
                </div>
              </div>
              <Badge variant={variants[status]} className="text-xs">
                {status}
              </Badge>
            </div>
            {status === "Atrasado" && (
              <p className="mt-5 rounded-xl bg-danger-soft p-4 text-sm font-medium text-danger">
                A data prevista de devolução foi ultrapassada. Entre em contato
                com o responsável.
              </p>
            )}
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
            <h3 className="flex items-center gap-2 font-[Manrope] font-bold">
              <FiFileText className="text-brand-700" />
              Informações do empréstimo
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Detail
                label="Responsável"
                value={loan.responsavel}
                Icon={FiUser}
              />
              <Detail
                label="Departamento"
                value={loan.patrimonio?.departamento}
              />
              <Detail label="Finalidade" value={loan.finalidade} />
              <Detail
                label="Data de retirada"
                value={formatDate(loan.dataRetirada)}
                Icon={FiCalendar}
              />
              <Detail
                label="Devolução prevista"
                value={formatDate(loan.dataPrevistaDevolucao)}
                Icon={FiCalendar}
              />
              <Detail
                label="Data efetiva da devolução"
                value={formatDate(loan.dataDevolucao)}
                Icon={FiCalendar}
              />
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
            <h3 className="font-[Manrope] font-bold">Registro e devolução</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Detail label="Cadastrado por" value={loan.cadastradoPor} />
              <Detail
                label="Data do cadastro"
                value={formatDate(loan.cadastradoEm, true)}
              />
              <Detail label="Condição na devolução" value={loan.condicao} />
              <Detail
                label="Devolução registrada por"
                value={loan.devolvidoPor}
              />
              <div className="sm:col-span-2">
                <Detail label="Observações" value={loan.observacoes} />
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-[Manrope] font-bold">
                  <FiFileText className="text-brand-700" />
                  Termo assinado
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Anexe a cópia assinada em PDF para mantê-la vinculada ao
                  empréstimo.
                </p>
              </div>
              <label
                className={`flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-brand-700 px-4 text-xs font-semibold text-white hover:bg-brand-900 ${upload.loading ? "pointer-events-none opacity-60" : ""}`}
              >
                <FiUpload />
                {upload.loading
                  ? "Anexando..."
                  : loan.termoAssinado
                    ? "Substituir PDF"
                    : "Anexar PDF"}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={attachTerm}
                  className="sr-only"
                />
              </label>
            </div>
            {upload.error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-danger-soft p-3 text-xs font-medium text-danger"
              >
                {upload.error}
              </p>
            )}
            {upload.success && (
              <p
                role="status"
                className="mt-4 rounded-xl bg-success-soft p-3 text-xs font-medium text-success"
              >
                {upload.success}
              </p>
            )}
            {loan.termoAssinado ? (
              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-success/20 bg-success-soft p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <b className="block text-sm text-success">
                    {loan.termoAssinado.nome}
                  </b>
                  <small className="text-success">
                    Anexado por {loan.termoAssinado.anexadoPor} em{" "}
                    {formatDate(loan.termoAssinado.anexadoEm, true)}
                  </small>
                </div>
                <a
                  href={loan.termoAssinado.dados}
                  download={loan.termoAssinado.nome}
                  className="flex h-9 items-center gap-2 rounded-xl border border-success/30 px-3 text-xs font-bold text-success"
                >
                  <FiDownload />
                  Baixar assinado
                </a>
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-surface-subtle p-4 text-xs text-muted">
                Nenhum termo assinado foi anexado.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
