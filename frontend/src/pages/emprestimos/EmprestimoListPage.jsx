import { useEffect, useMemo, useState } from "react";
import { FiArchive, FiCornerDownLeft, FiPlus } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/ui/DataTable";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { SearchField } from "../../components/ui/SearchField";
import { listEmprestimos } from "../../services/emprestimoService";

const date = (value) => value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)) : "—";
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const EmprestimoListPage = () => {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  useEffect(() => { listEmprestimos().then((items) => setState({ loading: false, items, error: "" })).catch((error) => setState({ loading: false, items: [], error: error.message })); }, []);
  const items = useMemo(() => state.items.filter((item) => {
    const text = `${item.patrimonio?.nome} ${item.patrimonio?.codigoPatrimonial} ${item.responsavel}`;
    return normalize(text).includes(normalize(search)) && (filter === "todos" || (filter === "abertos" ? item.status === "Em aberto" : item.status !== "Em aberto"));
  }), [state.items, search, filter]);
  const columns = [
    { key: "patrimonio", header: "PATRIMÔNIO", mobileLabel: false, render: (item) => <div><strong className="block text-sm">{item.patrimonio?.nome}</strong><small className="text-muted">{item.patrimonio?.codigoPatrimonial}</small></div> },
    { key: "responsavel", header: "RESPONSÁVEL", cellClassName: "text-sm text-muted" },
    { key: "retirada", header: "RETIRADA", render: (item) => <span className="text-sm text-muted">{date(item.dataRetirada)}</span> },
    { key: "devolucao", header: "DEVOLUÇÃO PREVISTA", render: (item) => <span className="text-sm text-muted">{date(item.dataPrevistaDevolucao)}</span> },
    { key: "status", header: "STATUS", render: (item) => <Badge variant={item.status === "Em aberto" ? "info" : "success"}>{item.status}</Badge> },
    { key: "actions", header: <span className="sr-only">Ações</span>, mobileLabel: false, render: (item) => item.status === "Em aberto" ? <Link to={`/emprestimos/${item.id}/devolver`} className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-brand-700 hover:bg-brand-100/40"><FiCornerDownLeft />Devolver</Link> : <span className="text-xs text-muted">{date(item.dataDevolucao)}</span> },
  ];
  return <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
    <PageHeader eyebrow="GESTÃO PATRIMONIAL" title="Empréstimos" description="Acompanhe retiradas, devoluções e responsáveis pelos patrimônios." actionLabel="Novo empréstimo" actionTo="/emprestimos/novo" ActionIcon={FiPlus} />
    <PageFeedback success={location.state?.success} loading={state.loading} loadingMessage="Carregando empréstimos..." error={state.error} />
    {!state.loading && !state.error && <DataTable ariaLabel="Lista de empréstimos" title="Movimentações" description={`${items.length} ${items.length === 1 ? "registro encontrado" : "registros encontrados"}`} toolbar={<div className="flex flex-col gap-2 sm:flex-row"><SearchField value={search} onChange={setSearch} label="Pesquisar empréstimo" hideLabel placeholder="Buscar patrimônio ou responsável..." /><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por status" className="h-10 rounded-xl border border-border-input bg-surface px-3 text-xs text-muted outline-none focus:border-brand-600"><option value="todos">Todos</option><option value="abertos">Em aberto</option><option value="encerrados">Devolvidos</option></select></div>} columns={columns} rows={items} gridTemplateColumns="1.3fr 1fr .7fr .9fr .65fr .75fr" />}
    {!state.loading && !state.error && <PageFeedback empty={items.length === 0} emptyTitle="Nenhum empréstimo encontrado" emptyDescription="Os empréstimos registrados aparecerão aqui." EmptyIcon={FiArchive} />}
  </div>;
};
