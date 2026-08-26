import { useEffect, useState } from "react";
import { FiDownload, FiFileText, FiPrinter } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Button } from "../../components/ui/Button";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { listLoans } from "../../services/loanService";
import { downloadLoanPdf, printLoanPdf } from "../../utils/loanPdf";

const date = (value) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
        new Date(`${value}T12:00:00Z`),
      )
    : "—";
const terms = [
  "Utilizar o patrimônio somente para a finalidade registrada.",
  "Conservar o item e não transferi-lo a terceiros sem autorização.",
  "Comunicar imediatamente qualquer avaria, perda ou alteração.",
  "Devolver o patrimônio até a data prevista, acompanhado de seus acessórios.",
  "Permitir a conferência do estado do item no momento da devolução.",
];

export const LoanTermPage = () => {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, loan: null, error: "" });
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
  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <BackLink to={loan ? `/loans/${loan.id}` : "/loans"} className="mb-5">
        Voltar ao empréstimo
      </BackLink>
      <PageHeader
        eyebrow="DOCUMENTO DO EMPRÉSTIMO"
        title="Termo de responsabilidade"
        description="Confira os dados antes de imprimir ou baixar o documento."
        actions={
          loan ? (
            <>
              <Button Icon={FiPrinter} onClick={() => printLoanPdf(loan)}>
                Imprimir
              </Button>
              <Button
                variant="primary"
                Icon={FiDownload}
                onClick={() => downloadLoanPdf(loan)}
              >
                Baixar PDF
              </Button>
            </>
          ) : null
        }
      />
      <PageFeedback
        loading={state.loading}
        loadingMessage="Preparando documento..."
        error={state.error}
      />
      {loan && (
        <article className="mx-auto rounded-2xl border border-border bg-surface p-6 shadow-panel sm:p-10 print:border-0 print:shadow-none">
          <header className="border-b-2 border-brand-700 pb-5 text-center">
            <FiFileText className="mx-auto text-brand-700" size={28} />
            <h3 className="mt-3 font-[Manrope] text-xl font-bold">
              TERMO DE EMPRÉSTIMO
            </h3>
            <p className="mt-1 text-xs font-bold tracking-wider text-muted">
              RESPONSABILIDADE SOBRE PATRIMÔNIO
            </p>
          </header>
          <p className="mt-7 text-sm leading-7 text-muted">
            Pelo presente termo,{" "}
            <b className="text-label">{loan.responsavel}</b> declara receber
            temporariamente o patrimônio abaixo identificado, comprometendo-se a
            utilizá-lo exclusivamente para a finalidade informada e devolvê-lo
            no prazo e nas condições estabelecidas.
          </p>
          <dl className="mt-6 grid gap-4 rounded-xl bg-surface-subtle p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold text-muted">Patrimônio</dt>
              <dd className="mt-1 font-semibold">
                {loan.patrimonio?.nome} · {loan.patrimonio?.codigoPatrimonial}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Departamento</dt>
              <dd className="mt-1 font-semibold">
                {loan.patrimonio?.departamento}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Responsável</dt>
              <dd className="mt-1 font-semibold">{loan.responsavel}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Finalidade</dt>
              <dd className="mt-1 font-semibold">{loan.finalidade}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Retirada</dt>
              <dd className="mt-1 font-semibold">{date(loan.dataRetirada)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">
                Devolução prevista
              </dt>
              <dd className="mt-1 font-semibold">
                {date(loan.dataPrevistaDevolucao)}
              </dd>
            </div>
          </dl>
          <h4 className="mt-7 font-[Manrope] font-bold">Termos e condições</h4>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted">
            {terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ol>
          <div className="mt-16 grid gap-12 sm:grid-cols-2">
            <div className="border-t border-foreground pt-2 text-center text-xs">
              {loan.responsavel}
              <br />
              <span className="text-muted">Responsável pelo patrimônio</span>
            </div>
            <div className="border-t border-foreground pt-2 text-center text-xs">
              Responsável pela entrega
              <br />
              <span className="text-muted">Ecclesia Patrimônio</span>
            </div>
          </div>
          <div className="mt-8 flex justify-center print:hidden">
            <Link
              to={`/loans/${loan.id}`}
              className="text-xs font-bold text-brand-700"
            >
              Ir para os detalhes e anexar o termo assinado
            </Link>
          </div>
        </article>
      )}
    </div>
  );
};
