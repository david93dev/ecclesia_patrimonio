import { useEffect, useMemo, useState } from "react";
import { FiArchive, FiEdit2, FiEye, FiPlus } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { DataTable } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/Badge";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { TableButton } from "../../components/ui/TableButton";
import { SearchField } from "../../components/ui/SearchField";
import { FilterPanel } from "../../components/ui/FilterPanel";
import { listPatrimonios } from "../../services/patrimonioService";

const columns = [
  {
    key: "item",
    header: "ITEM",
    mobileLabel: false,
    render: (item) => (
      <div>
        <strong className="block text-sm">{item.nome}</strong>
        <small className="text-muted">{item.codigoPatrimonial}</small>
      </div>
    ),
  },
  {
    key: "departamento",
    header: "DEPARTAMENTO",
    cellClassName: "text-sm text-muted",
  },
  {
    key: "categoria",
    header: "CATEGORIA",
    cellClassName: "text-sm text-muted",
  },
  {
    key: "status",
    header: "STATUS",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "actions",
    header: <span className="sr-only">Ações</span>,
    mobileLabel: false,
    render: (item) => (
      <div className="flex gap-2">
        <TableButton
          to={`/patrimonios/${item.id}`}
          Icon={FiEye}
          label={`Visualizar ${item.nome}`}
          title="Visualizar"
        />
        <TableButton
          to={`/patrimonios/${item.id}/editar`}
          Icon={FiEdit2}
          label={`Editar ${item.nome}`}
          title="Editar"
        />
      </div>
    ),
  },
];

const emptyFilters = { categoria: "", departamento: "", status: "", tipo: "" };
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const unique = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));

export const PatrimonioListPage = () => {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);

  useEffect(() => {
    listPatrimonios()
      .then((items) => setState({ loading: false, items, error: "" }))
      .catch((error) =>
        setState({ loading: false, items: [], error: error.message }),
      );
  }, []);

  const filterFields = useMemo(() => [
    { key: "categoria", label: "Categoria", placeholder: "Todas as categorias", options: unique(state.items.map((item) => item.categoria)) },
    { key: "departamento", label: "Departamento", placeholder: "Todos os departamentos", options: unique(state.items.map((item) => item.departamento)) },
    { key: "status", label: "Status", placeholder: "Somente ativos", options: unique(["Disponível", "Emprestado", "Em Usufruto", "Inativo", ...state.items.map((item) => item.status)]) },
    { key: "tipo", label: "Tipo do patrimônio", placeholder: "Todos os tipos", options: unique(["Próprio", "Doação", "Usufruto", ...state.items.map((item) => item.tipo)]) },
  ], [state.items]);

  const filteredItems = useMemo(() => state.items.filter((item) => {
    const matchesSearch = normalize(item.nome).includes(normalize(search));
    const matchesFields = Object.entries(filters).every(([key, value]) => !value || normalize(item[key]) === normalize(value));
    const isActive = !["inativo", "baixado"].includes(normalize(item.status));
    return matchesSearch && matchesFields && (filters.status ? true : isActive);
  }), [state.items, search, filters]);

  const hasActiveFilters = Boolean(search || Object.values(filters).some(Boolean));
  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => { setSearch(""); setFilters(emptyFilters); };

  return (
    <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
      <PageHeader
        eyebrow="GESTÃO PATRIMONIAL"
        title="Patrimônios"
        description="Consulte e cadastre os bens da instituição."
        actionLabel="Novo patrimônio"
        actionTo="/patrimonios/novo"
        ActionIcon={FiPlus}
      />

      <FilterPanel fields={filterFields} values={filters} onChange={changeFilter} onClear={clearFilters} resultCount={filteredItems.length} resultLabel={filteredItems.length === 1 ? "patrimônio" : "patrimônios"} hasActiveFilters={hasActiveFilters} />

      <PageFeedback
        success={location.state?.success}
        loading={state.loading}
        loadingMessage="Carregando patrimônios..."
        error={state.error}
      />
      {!state.loading && !state.error && (
        <DataTable
          ariaLabel="Lista de patrimônios"
          title="Lista de patrimônios"
          description="Pesquise pelo nome ou consulte os itens encontrados."
          toolbar={<SearchField value={search} onChange={setSearch} label="Pesquisar patrimônio" hideLabel placeholder="Pesquisar por nome..." />}
          columns={columns}
          rows={filteredItems}
          gridTemplateColumns="1.4fr 1fr 1fr 120px 88px"
        />
      )}
      {!state.loading && !state.error && (
        <PageFeedback
          empty={filteredItems.length === 0}
          emptyTitle={hasActiveFilters ? "Nenhum patrimônio encontrado" : "Nenhum patrimônio cadastrado"}
          emptyDescription={hasActiveFilters ? "Revise a pesquisa ou limpe os filtros para ver todos os itens ativos." : "Comece adicionando o primeiro item."}
          EmptyIcon={FiArchive}
        />
      )}
    </div>
  );
};
