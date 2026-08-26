import { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiArchive, FiCheckCircle, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/ui/DataTable";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { SearchField } from "../../components/ui/SearchField";
import { getLoanStatus, listLoans } from "../../services/loanService";

const formatDate = (value) => value
  ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`))
  : "—";

const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim();

const hasDamage = (loan) => Boolean(loan.condicao && normalize(loan.condicao) !== "bom estado");
const statusVariants = { Emprestado: "info", Devolvido: "success", Atrasado: "danger" };

export const LoanHistoryPage = () => {
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    listLoans()
      .then((items) => setState({ loading: false, items, error: "" }))
      .catch((error) => setState({ loading: false, items: [], error: error.message }));
  }, []);

  const items = useMemo(() => state.items.filter((loan) => !search || normalize(
    `${loan.patrimonio?.nome} ${loan.patrimonio?.codigoPatrimonial}`,
  ).includes(normalize(search))), [search, state.items]);

  const columns = [
    { key: "asset", header: "PATRIMÔNIO", mobileLabel: false, render: (loan) => <div><strong className="block text-sm">{loan.patrimonio?.nome}</strong><small className="text-muted">{loan.patrimonio?.codigoPatrimonial}</small></div> },
    { key: "borrower", header: "RESPONSÁVEL / DEPARTAMENTO", render: (loan) => <div><span className="block text-sm">{loan.responsavel}</span><small className="text-muted">{loan.patrimonio?.departamento}</small></div> },
    { key: "withdrawalDate", header: "RETIRADA", render: (loan) => <span className="text-sm text-muted">{formatDate(loan.dataRetirada)}</span> },
    { key: "returnDate", header: "DEVOLUÇÃO", render: (loan) => <span className="text-sm text-muted">{formatDate(loan.dataDevolucao)}</span> },
    { key: "condition", header: "CONDIÇÃO", render: (loan) => <span className="text-sm text-muted">{loan.condicao || "Aguardando devolução"}</span> },
    { key: "occurrence", header: "OCORRÊNCIAS", render: (loan) => hasDamage(loan) ? <Badge variant="danger" className="gap-1"><FiAlertTriangle />Com avaria</Badge> : loan.status === "Devolvido" ? <Badge variant="success" className="gap-1"><FiCheckCircle />Sem ocorrência</Badge> : <Badge>Aguardando</Badge> },
    { key: "status", header: "STATUS", render: (loan) => { const status = getLoanStatus(loan); return <Badge variant={statusVariants[status]}>{status}</Badge>; } },
    { key: "actions", header: <span className="sr-only">Ações</span>, mobileLabel: false, render: (loan) => <Link to={`/loans/${loan.id}`} aria-label={`Ver detalhes do empréstimo de ${loan.patrimonio?.nome}`} title="Ver detalhes" className="grid size-9 place-items-center rounded-xl border border-border text-brand-700 hover:bg-brand-100/40"><FiEye /></Link> },
  ];

  return <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
    <BackLink to="/loans" className="mb-5">Voltar aos empréstimos</BackLink>
    <PageHeader eyebrow="GESTÃO PATRIMONIAL" title="Histórico de empréstimos" description="Consulte todas as retiradas, devoluções e ocorrências registradas." />
    <PageFeedback loading={state.loading} loadingMessage="Carregando histórico..." error={state.error} />
    {!state.loading && !state.error && <DataTable ariaLabel="Histórico de empréstimos" title="Registros permanentes" description={`${items.length} ${items.length === 1 ? "registro encontrado" : "registros encontrados"}`} toolbar={<SearchField value={search} onChange={setSearch} label="Pesquisar histórico por patrimônio" hideLabel placeholder="Pesquisar por patrimônio ou código..." />} columns={columns} rows={items} gridTemplateColumns="1.2fr 1.15fr .65fr .65fr .8fr .8fr .6fr 48px" />}
    {!state.loading && !state.error && <PageFeedback empty={items.length === 0} emptyTitle={search ? "Nenhum registro para o patrimônio pesquisado" : "Nenhum empréstimo registrado"} emptyDescription={search ? "Revise o nome ou o código patrimonial informado." : "Os empréstimos realizados aparecerão aqui e permanecerão disponíveis após a devolução."} EmptyIcon={FiArchive} />}
  </div>;
};
