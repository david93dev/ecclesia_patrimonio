import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiUserCheck, FiUsers, FiUserX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { DataTable } from "../../components/ui/DataTable";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { TableButton } from "../../components/ui/TableButton";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useAuth } from "../../contexts/AuthContext";
import { deactivateUser, listUsers, reactivateUser } from "../../services/userService";

const formatDate = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "—";

export const UserListPage = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrador";
  const [state, setState] = useState({ loading: isAdmin, items: [], error: "" });
  const [success, setSuccess] = useState("");
  const [dialog, setDialog] = useState({ open: false, user: null, action: "deactivate", loading: false, error: "" });
  useEffect(() => { if (isAdmin) listUsers().then((items) => setState({ loading: false, items, error: "" })).catch((error) => setState({ loading: false, items: [], error: error.message })); }, [isAdmin]);
  const columns = [
    { key: "name", header: "USUÁRIO", render: (item) => <div><strong className="block text-sm">{item.name}</strong><small className="block text-muted">{item.email}</small>{item.phone && <small className="block text-muted">{item.phone}</small>}</div> },
    { key: "role", header: "PERFIL / DEPARTAMENTO", render: (item) => <div><Badge variant="brand">{item.role}</Badge><small className="mt-1 block text-muted">{item.departmentName || "Sem departamento"}</small></div> },
    { key: "status", header: "STATUS", render: (item) => <Badge variant={item.status === "Ativo" ? "success" : "neutral"}>{item.status}</Badge> },
    { key: "registeredAt", header: "CADASTRADO EM", render: (item) => <span className="text-sm text-muted">{formatDate(item.registeredAt)}</span> },
    { key: "registeredBy", header: "CADASTRADO POR" },
    { key: "actions", header: <span className="sr-only">Ações</span>, mobileLabel: false, render: (item) => <div className="flex gap-2"><TableButton to={`/users/${item.id}/edit`} Icon={FiEdit2} label={`Editar ${item.name}`} title="Editar" />{item.status === "Ativo" ? <TableButton Icon={FiUserX} label={`Desativar ${item.name}`} title="Desativar" variant="danger" onClick={() => setDialog({ open: true, user: item, action: "deactivate", loading: false, error: "" })} /> : <TableButton Icon={FiUserCheck} label={`Reativar ${item.name}`} title="Reativar" onClick={() => setDialog({ open: true, user: item, action: "reactivate", loading: false, error: "" })} />}</div> },
  ];
  return <div className="mx-auto max-w-6xl p-5 sm:p-8 lg:p-10">
    <PageHeader eyebrow="CONTROLE DE ACESSO" title="Usuários" description="Gerencie quem pode acessar o sistema e seu perfil de acesso." actionLabel={isAdmin ? "Novo usuário" : undefined} actionTo="/users/new" ActionIcon={FiPlus} />
    {!isAdmin && <PageFeedback error="Apenas administradores podem gerenciar usuários." />}
    {isAdmin && <PageFeedback success={success || location.state?.success} loading={state.loading} loadingMessage="Carregando usuários..." error={state.error} />}
    {isAdmin && !state.loading && !state.error && <DataTable ariaLabel="Lista de usuários" title="Usuários cadastrados" description={`${state.items.length} ${state.items.length === 1 ? "usuário cadastrado" : "usuários cadastrados"}`} columns={columns} rows={state.items} gridTemplateColumns="1.3fr .8fr .55fr .75fr .9fr 88px" />}
    {isAdmin && !state.loading && !state.error && <PageFeedback empty={state.items.length === 0} emptyTitle="Nenhum usuário cadastrado" emptyDescription="Cadastre o primeiro usuário para conceder acesso ao sistema." EmptyIcon={FiUsers} />}
    <ConfirmDialog open={dialog.open} title={dialog.action === "deactivate" ? "Desativar usuário?" : "Reativar usuário?"} description={dialog.action === "deactivate" ? `O usuário ${dialog.user?.name ?? ""} não poderá mais acessar o sistema enquanto estiver desativado. Seus dados e histórico de ações serão mantidos.` : `O acesso de ${dialog.user?.name ?? ""} será restaurado imediatamente.`} confirmLabel={dialog.action === "deactivate" ? "Desativar usuário" : "Reativar usuário"} loading={dialog.loading} error={dialog.error} onCancel={() => setDialog({ open: false, user: null, action: "deactivate", loading: false, error: "" })} onConfirm={async () => { setDialog((current) => ({ ...current, loading: true, error: "" })); try { const updated = dialog.action === "deactivate" ? await deactivateUser(dialog.user.id, user) : await reactivateUser(dialog.user.id, user); setState((current) => ({ ...current, items: current.items.map((item) => item.id === updated.id ? updated : item) })); setSuccess(dialog.action === "deactivate" ? "Usuário desativado com sucesso." : "Usuário reativado com sucesso."); setDialog({ open: false, user: null, action: "deactivate", loading: false, error: "" }); } catch (error) { setDialog((current) => ({ ...current, loading: false, error: error.message })); } }} />
  </div>;
};
