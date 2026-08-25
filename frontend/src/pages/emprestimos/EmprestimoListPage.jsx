import { useEffect, useMemo, useState } from "react";
import { FiArchive, FiCornerDownLeft, FiEye, FiPlus } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/ui/DataTable";
import { FilterPanel } from "../../components/ui/FilterPanel";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { SearchField } from "../../components/ui/SearchField";
import { getEmprestimoStatus, listEmprestimos } from "../../services/emprestimoService";

const initialFilters = { pesquisa: "", departamento: "", status: "", inicio: "", fim: "" };
const date = (value) => value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`)) : "—";
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const statusVariant = { Emprestado: "info", Devolvido: "success", Atrasado: "danger" };

export const EmprestimoListPage = () => {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => { listEmprestimos().then((items) => setState({ loading: false, items, error: "" })).catch((error) => setState({ loading: false, items: [], error: error.message })); }, [location.key]);
  const departments = useMemo(() => [...new Set(state.items.map((item) => item.patrimonio?.departamento).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR")), [state.items]);
  const items = useMemo(() => state.items.filter((item) => {
    const loanStatus = getEmprestimoStatus(item); const withdrawal = item.dataRetirada?.slice(0, 10) ?? "";
    return (!filters.pesquisa || normalize(`${item.patrimonio?.nome} ${item.patrimonio?.codigoPatrimonial} ${item.responsavel}`).includes(normalize(filters.pesquisa)))
      && (!filters.departamento || item.patrimonio?.departamento === filters.departamento)
      && (!filters.status || loanStatus === filters.status)
      && (!filters.inicio || withdrawal >= filters.inicio) && (!filters.fim || withdrawal <= filters.fim);
  }), [state.items, filters]);
  const hasFilters = Object.values(filters).some(Boolean);
  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const advancedValues = { departamento: filters.departamento, status: filters.status, inicio: filters.inicio, fim: filters.fim };
  const filterFields = [
    { key: "departamento", label: "Departamento", placeholder: "Todos os departamentos", options: departments },
    { key: "status", label: "Status", placeholder: "Todos os status", options: ["Emprestado", "Devolvido", "Atrasado"] },
    { key: "inicio", label: "Retirada a partir de", type: "date" },
    { key: "fim", label: "Retirada até", type: "date", min: (values) => values.inicio },
  ];
  const columns = [
    { key: "patrimonio", header: "PATRIMÔNIO", mobileLabel: false, render: (item) => <div><strong className="block text-sm">{item.patrimonio?.nome}</strong><small className="text-muted">{item.patrimonio?.codigoPatrimonial}</small></div> },
    { key: "responsavel", header: "RESPONSÁVEL / DEPARTAMENTO", render: (item) => <div className="text-sm"><span className="block">{item.responsavel}</span><small className="text-muted">{item.patrimonio?.departamento}</small></div> },
    { key: "retirada", header: "RETIRADA", render: (item) => <span className="text-sm text-muted">{date(item.dataRetirada)}</span> },
    { key: "prevista", header: "PREVISÃO", render: (item) => <span className={getEmprestimoStatus(item) === "Atrasado" ? "text-sm font-bold text-danger" : "text-sm text-muted"}>{date(item.dataPrevistaDevolucao)}</span> },
    { key: "devolucao", header: "DEVOLUÇÃO", render: (item) => <span className="text-sm text-muted">{date(item.dataDevolucao)}</span> },
    { key: "status", header: "STATUS", render: (item) => { const status = getEmprestimoStatus(item); return <Badge variant={statusVariant[status]}>{status}</Badge>; } },
    { key: "actions", header: <span className="sr-only">Ações</span>, mobileLabel: false, render: (item) => <div className="flex gap-2"><Link to={`/emprestimos/${item.id}`} aria-label={`Detalhes do empréstimo de ${item.patrimonio?.nome}`} title="Ver detalhes" className="grid size-9 place-items-center rounded-xl border border-border text-brand-700 hover:bg-brand-100/40"><FiEye /></Link>{item.status === "Em aberto" && <Link to={`/emprestimos/${item.id}/devolver`} aria-label={`Devolver ${item.patrimonio?.nome}`} title="Registrar devolução" className="grid size-9 place-items-center rounded-xl border border-border text-brand-700 hover:bg-brand-100/40"><FiCornerDownLeft /></Link>}</div> },
  ];
  return <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
    <PageHeader eyebrow="GESTÃO PATRIMONIAL" title="Empréstimos" description="Acompanhe retiradas, devoluções e responsáveis pelos patrimônios." actionLabel="Novo empréstimo" actionTo="/emprestimos/novo" ActionIcon={FiPlus} />
    <FilterPanel fields={filterFields} values={advancedValues} onChange={changeFilter} onClear={() => setFilters(initialFilters)} resultCount={items.length} resultLabel={items.length === 1 ? "empréstimo" : "empréstimos"} hasActiveFilters={hasFilters} />
    <PageFeedback success={location.state?.success} loading={state.loading} loadingMessage="Carregando empréstimos..." error={state.error} />
    {!state.loading && !state.error && <DataTable ariaLabel="Lista de empréstimos" title="Movimentações" description="Pesquise por patrimônio ou responsável." toolbar={<SearchField value={filters.pesquisa} onChange={(value) => changeFilter("pesquisa", value)} label="Pesquisar empréstimo" hideLabel placeholder="Pesquisar patrimônio ou responsável..." />} columns={columns} rows={items} gridTemplateColumns="1.25fr 1.15fr .65fr .65fr .65fr .65fr 82px" />}
    {!state.loading && !state.error && <PageFeedback empty={items.length === 0} emptyTitle="Nenhum empréstimo encontrado" emptyDescription={hasFilters ? "Revise ou limpe os filtros aplicados." : "Os empréstimos registrados aparecerão aqui."} EmptyIcon={FiArchive} />}
  </div>;
};
