import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { DataTable } from "../../components/ui/DataTable";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { SearchField } from "../../components/ui/SearchField";
import { StatusBadge } from "../../components/ui/Badge";
import { TableButton } from "../../components/ui/TableButton";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteDepartment,
  listDepartments,
} from "../../services/departmentService";

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const formatDate = (value) =>
  value ? new Intl.DateTimeFormat("pt-BR").format(new Date(value)) : "—";

export const DepartmentListPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrador";
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(location.state?.success ?? "");
  const [dialog, setDialog] = useState({
    open: false,
    item: null,
    loading: false,
    error: "",
  });
  useEffect(() => {
    listDepartments()
      .then((items) => setState({ loading: false, items, error: "" }))
      .catch((error) =>
        setState({ loading: false, items: [], error: error.message }),
      );
  }, []);
  const items = useMemo(
    () =>
      state.items.filter(
        (item) =>
          normalize(item.status) === "ativo" &&
          normalize(item.nome).includes(normalize(search)),
      ),
    [state.items, search],
  );
  const remove = async () => {
    setDialog((current) => ({ ...current, loading: true, error: "" }));
    try {
      await deleteDepartment(dialog.item.id);
      setState((current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== dialog.item.id),
      }));
      setDialog({ open: false, item: null, loading: false, error: "" });
      setSuccess("Departamento excluído com sucesso.");
    } catch (error) {
      setDialog((current) => ({
        ...current,
        loading: false,
        error: error.message,
      }));
    }
  };
  const columns = [
    {
      key: "nome",
      header: "DEPARTAMENTO",
      mobileLabel: false,
      render: (item) => (
        <div>
          <strong className="block text-sm">{item.nome}</strong>
          <small className="text-muted">
            {item.descricao || "Sem descrição"}
          </small>
        </div>
      ),
    },
    {
      key: "lider",
      header: "LÍDER RESPONSÁVEL",
      cellClassName: "text-sm text-muted",
    },
    {
      key: "status",
      header: "STATUS",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "dataCadastro",
      header: "CADASTRADO EM",
      render: (item) => (
        <span className="text-sm text-muted">
          {formatDate(item.dataCadastro)}
        </span>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">Ações</span>,
      mobileLabel: false,
      render: (item) =>
        isAdmin ? (
          <div className="flex gap-2">
            <TableButton
              to={`/departments/${item.id}/edit`}
              Icon={FiEdit2}
              label={`Editar ${item.nome}`}
              title="Editar"
            />
            <TableButton
              Icon={FiTrash2}
              label={`Excluir ${item.nome}`}
              title="Excluir"
              variant="danger"
              onClick={() =>
                setDialog({ open: true, item, loading: false, error: "" })
              }
            />
          </div>
        ) : null,
    },
  ];
  return (
    <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
      <PageHeader
        eyebrow="GESTÃO ORGANIZACIONAL"
        title="Departamentos"
        description="Administre os setores e seus líderes responsáveis."
        actionLabel={isAdmin ? "Novo departamento" : undefined}
        actionTo={isAdmin ? "/departments/new" : undefined}
        ActionIcon={FiPlus}
      />
      <PageFeedback
        success={success}
        loading={state.loading}
        loadingMessage="Carregando departamentos..."
        error={state.error}
      />
      {!state.loading && !state.error && (
        <DataTable
          ariaLabel="Lista de departamentos"
          title="Lista de departamentos"
          description={`${items.length} ${items.length === 1 ? "departamento encontrado" : "departamentos encontrados"}`}
          toolbar={
            <SearchField
              value={search}
              onChange={setSearch}
              label="Pesquisar departamento"
              hideLabel
              placeholder="Pesquisar por nome..."
            />
          }
          columns={columns}
          rows={items}
          gridTemplateColumns="1.3fr 1fr 110px 130px 88px"
        />
      )}
      {!state.loading && !state.error && (
        <PageFeedback
          empty={items.length === 0}
          emptyTitle={
            search
              ? "Nenhum departamento encontrado"
              : "Nenhum departamento cadastrado"
          }
          emptyDescription={
            search
              ? "Limpe ou altere a pesquisa para consultar outros departamentos."
              : "Cadastre o primeiro departamento da instituição."
          }
          EmptyIcon={FiUsers}
        />
      )}
      <ConfirmDialog
        open={dialog.open}
        title="Excluir departamento?"
        description={`O departamento “${dialog.item?.nome ?? ""}” será excluído permanentemente caso não possua patrimônios vinculados.`}
        confirmLabel="Excluir departamento"
        loading={dialog.loading}
        error={dialog.error}
        onConfirm={remove}
        onCancel={() =>
          setDialog({ open: false, item: null, loading: false, error: "" })
        }
      />
    </div>
  );
};
