import { useEffect, useMemo, useState } from "react";
import { FiEdit3, FiEye, FiSettings } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { getSettings } from "../../services/settingsService";

export const SettingsPage = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const canViewSettings = hasPermission("settings.view");
  const [state, setState] = useState({ loading: canViewSettings, categories: [], error: "" });

  useEffect(() => {
    if (!canViewSettings) return;
    const controller = new AbortController();
    getSettings({ signal: controller.signal })
      .then((categories) => setState({ loading: false, categories, error: "" }))
      .catch((error) => { if (error.name !== "AbortError") setState({ loading: false, categories: [], error: error.message }); });
    return () => controller.abort();
  }, [canViewSettings]);

  const visibleCategories = useMemo(() => state.categories.filter((category) => hasPermission(category.permission)), [hasPermission, state.categories]);

  if (!canViewSettings) return <div className="mx-auto max-w-6xl p-5 sm:p-8 lg:p-10"><PageHeader eyebrow="ADMINISTRAÇÃO" title="Configurações" description="Preferências gerais do sistema." /><PageFeedback error="Você não possui permissão para visualizar as configurações do sistema." /></div>;

  return <div className="mx-auto max-w-6xl p-5 sm:p-8 lg:p-10">
    <PageHeader eyebrow="ADMINISTRAÇÃO" title="Configurações" description="Consulte as informações institucionais e os parâmetros atuais do sistema." />
    <PageFeedback success={location.state?.success} loading={state.loading} loadingMessage="Carregando configurações..." error={state.error} />
    {!state.loading && !state.error && visibleCategories.length > 0 && <div className="grid gap-5 lg:grid-cols-2">{visibleCategories.map((category) => <section key={category.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"><header className="flex flex-col gap-3 border-b border-border bg-surface-subtle p-5 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="flex items-center gap-2 font-[Manrope] font-bold"><FiSettings className="text-brand-700" />{category.title}</h3><p className="mt-1 text-xs text-muted">{category.description}</p></div>{category.id === "institution" && hasPermission("settings.institution.edit") && <Link to="/settings/institution/edit" className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-brand-700 px-3 text-xs font-bold text-white hover:bg-brand-900"><FiEdit3 />Editar informações</Link>}{category.id === "notifications" && hasPermission("settings.notifications.edit") && <Link to="/settings/notifications" className="flex h-9 shrink-0 items-center gap-2 rounded-xl bg-brand-700 px-3 text-xs font-bold text-white hover:bg-brand-900"><FiEdit3 />Configurar</Link>}</header><dl>{category.items.map((item) => <div key={item.key} className="flex flex-col gap-2 border-b border-border-row p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><dt className="text-xs font-bold text-muted">{item.label}</dt><dd className="mt-1 text-sm font-semibold break-words text-label">{String(item.value)}</dd></div><Badge variant={item.editable ? "brand" : "neutral"} className="shrink-0 gap-1">{item.editable ? <FiEdit3 /> : <FiEye />}{item.editable ? "Editável" : "Somente consulta"}</Badge></div>)}</dl></section>)}</div>}
    {!state.loading && !state.error && <PageFeedback empty={visibleCategories.length === 0} emptyTitle="Nenhuma configuração disponível" emptyDescription="Não existem configurações cadastradas ou liberadas para o seu perfil." EmptyIcon={FiSettings} />}
  </div>;
};
