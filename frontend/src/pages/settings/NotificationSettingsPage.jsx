import { useEffect, useMemo, useState } from "react";
import { FiBell, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackLink } from "../../components/ui/BackLink";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { getNotificationSettings, updateNotificationSettings } from "../../services/settingsService";

export const NotificationSettingsPage = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const canEdit = hasPermission("settings.notifications.edit");
  const [state, setState] = useState({ loading: canEdit, categories: [], error: "" });
  const [preferences, setPreferences] = useState({});
  const [initialPreferences, setInitialPreferences] = useState({});
  const [dialog, setDialog] = useState({ open: false, loading: false, error: "" });

  useEffect(() => {
    if (!canEdit) return;
    getNotificationSettings(user).then((categories) => { const loaded = Object.fromEntries(categories.flatMap((category) => category.items.map((item) => [item.key, item.enabled]))); setState({ loading: false, categories, error: "" }); setPreferences(loaded); setInitialPreferences(loaded); }).catch((error) => setState({ loading: false, categories: [], error: error.message }));
  }, [canEdit, user]);

  const hasChanges = useMemo(() => Object.keys(preferences).some((key) => preferences[key] !== initialPreferences[key]), [initialPreferences, preferences]);
  const cancelChanges = () => setPreferences(initialPreferences);
  const confirm = async () => { setDialog((current) => ({ ...current, loading: true, error: "" })); try { await updateNotificationSettings(preferences, user); navigate("/settings", { replace: true, state: { success: "Preferências de notificações atualizadas com sucesso." } }); } catch (error) { setDialog((current) => ({ ...current, loading: false, error: error.message })); } };

  if (!canEdit) return <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10"><BackLink to="/settings" className="mb-5">Voltar</BackLink><PageFeedback error="Você não possui permissão para alterar as notificações." /></div>;
  return <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10"><BackLink to="/settings" className="mb-5">Voltar às configurações</BackLink><PageHeader eyebrow="CONFIGURAÇÕES" title="Notificações" description="Escolha os avisos que deseja receber de acordo com o seu perfil." /><PageFeedback loading={state.loading} loadingMessage="Carregando preferências..." error={state.error} />{!state.loading && !state.error && state.categories.length > 0 && <div className="space-y-5">{state.categories.map((category) => <section key={category.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"><header className="border-b border-border bg-surface-subtle p-5"><h3 className="flex items-center gap-2 font-[Manrope] font-bold"><FiBell className="text-brand-700" />{category.title}</h3></header><div>{category.items.map((item) => <label key={item.key} className="flex cursor-pointer items-center justify-between gap-5 border-b border-border-row p-5 last:border-0"><span><strong className="block text-sm text-label">{item.label}</strong><small className="mt-1 block text-muted">{item.description}</small></span><span className={`relative h-7 w-12 shrink-0 rounded-full transition ${preferences[item.key] ? "bg-brand-700" : "bg-border-hover"}`}><input type="checkbox" checked={Boolean(preferences[item.key])} onChange={() => setPreferences((current) => ({ ...current, [item.key]: !current[item.key] }))} className="sr-only" /><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${preferences[item.key] ? "left-6" : "left-1"}`} /></span></label>)}</div></section>)}<div className="flex justify-end gap-3"><Button type="button" onClick={cancelChanges} disabled={!hasChanges}>Cancelar alterações</Button><Button type="button" variant="primary" Icon={FiSave} disabled={!hasChanges} onClick={() => setDialog({ open: true, loading: false, error: "" })}>Salvar preferências</Button></div></div>} {!state.loading && !state.error && <PageFeedback empty={state.categories.length === 0} emptyTitle="Nenhuma notificação disponível" emptyDescription="Não existem notificações liberadas para o seu perfil." EmptyIcon={FiBell} />}<ConfirmDialog open={dialog.open} title="Salvar preferências?" description="As novas configurações de notificações serão aplicadas ao seu usuário." confirmLabel="Salvar preferências" loading={dialog.loading} error={dialog.error} onConfirm={confirm} onCancel={() => setDialog({ open: false, loading: false, error: "" })} /></div>;
};
