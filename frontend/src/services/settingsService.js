const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const INSTITUTION_STORAGE_KEY = "ecclesia:institution-settings";
const NOTIFICATION_STORAGE_KEY = "ecclesia:notification-settings";
const DEFAULT_INSTITUTION = {
  churchName: "Paróquia Nossa Senhora das Graças",
  document: "12.345.678/0001-90",
  phone: "(85) 3333-4455",
  email: "contato@ecclesia.com.br",
  address: "Avenida Central",
  number: "120",
  complement: "",
  neighborhood: "Centro",
  city: "Fortaleza",
  state: "CE",
  zipCode: "60000-000",
};

const MOCK_SETTINGS = [
  {
    id: "system",
    title: "Configurações do sistema",
    description: "Identificação e preferências gerais da aplicação.",
    permission: "settings.view",
    items: [
      { key: "systemName", label: "Nome do sistema", value: "Ecclesia Patrimônio", editable: false },
      { key: "institutionalEmail", label: "E-mail institucional", value: "contato@ecclesia.com.br", editable: true },
      { key: "itemsPerPage", label: "Quantidade máxima de itens por página", value: 20, editable: true },
      { key: "timezone", label: "Fuso horário", value: "America/Fortaleza", editable: false },
    ],
  },
  {
    id: "institution",
    title: "Informações da igreja",
    description: "Dados institucionais utilizados em documentos e comunicações.",
    permission: "settings.institution.view",
    items: [
      { key: "churchName", label: "Nome da igreja", value: "Paróquia Nossa Senhora das Graças", editable: true },
      { key: "document", label: "CNPJ", value: "12.345.678/0001-90", editable: true },
      { key: "phone", label: "Telefone", value: "(85) 3333-4455", editable: true },
      { key: "address", label: "Endereço", value: "Av. Central, 120 — Fortaleza/CE", editable: true },
    ],
  },
  {
    id: "assets",
    title: "Configurações de patrimônio",
    description: "Parâmetros usados no cadastro e na movimentação dos bens.",
    permission: "settings.assets.view",
    items: [
      { key: "categories", label: "Categorias de patrimônio", value: "8 categorias cadastradas", editable: true },
      { key: "statuses", label: "Situações disponíveis", value: "Disponível, Em uso, Emprestado, Em manutenção e Inativo", editable: false },
      { key: "defaultUsufructTerm", label: "Prazo padrão para usufruto", value: "12 meses", editable: true },
      { key: "activeLoanRule", label: "Regra de empréstimo ativo", value: "Um empréstimo ativo por patrimônio", editable: false },
    ],
  },
  {
    id: "notifications",
    title: "Notificações",
    description: "Preferências para alertas e comunicações automáticas.",
    permission: "settings.notifications.view",
    items: [
      { key: "overdueLoanAlerts", label: "Alertas de empréstimos atrasados", value: "Ativados", editable: true },
      { key: "returnReminder", label: "Lembrete antes da devolução", value: "2 dias", editable: true },
      { key: "notificationEmail", label: "E-mail para notificações", value: "patrimonio@ecclesia.com.br", editable: true },
    ],
  },
];

const wait = (milliseconds = 500) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const getSettings = async ({ signal } = {}) => {
  if (API_URL) {
    const response = await fetch(`${API_URL}/configuracoes`, { signal });
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message ?? "Não foi possível carregar as configurações."); }
    return response.json();
  }
  await wait();
  if (signal?.aborted) throw new DOMException("Requisição cancelada", "AbortError");
  const institution = await getInstitutionSettings();
  return MOCK_SETTINGS.map((category) => category.id !== "institution" ? category : {
    ...category,
    items: [
      { key: "churchName", label: "Nome da igreja", value: institution.churchName, editable: true },
      { key: "document", label: "CNPJ", value: institution.document, editable: true },
      { key: "phone", label: "Telefone", value: institution.phone || "Não informado", editable: true },
      { key: "email", label: "E-mail", value: institution.email, editable: true },
      { key: "address", label: "Endereço", value: `${institution.address}, ${institution.number}${institution.complement ? ` — ${institution.complement}` : ""}, ${institution.neighborhood}, ${institution.city}/${institution.state} — ${institution.zipCode}`, editable: true },
    ],
  });
};

export const getInstitutionSettings = async () => {
  if (API_URL) {
    const response = await fetch(`${API_URL}/configuracoes/igreja`);
    if (!response.ok) throw new Error("Não foi possível carregar as informações da igreja.");
    return response.json();
  }
  await wait(300);
  try { return { ...DEFAULT_INSTITUTION, ...(JSON.parse(localStorage.getItem(INSTITUTION_STORAGE_KEY)) ?? {}) }; }
  catch { return DEFAULT_INSTITUTION; }
};

export const updateInstitutionSettings = async (data, responsibleUser) => {
  if (API_URL) {
    const response = await fetch(`${API_URL}/configuracoes/igreja`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message ?? "Não foi possível atualizar as informações da igreja."); }
    return response.json();
  }
  await wait(600);
  const updated = { ...data, updatedAt: new Date().toISOString(), updatedBy: responsibleUser?.name ?? "Usuário do sistema" };
  localStorage.setItem(INSTITUTION_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

const NOTIFICATION_CATALOG = [
  { id: "loans", title: "Empréstimos", items: [
    { key: "newLoan", label: "Novo empréstimo", description: "Avisar quando um empréstimo for registrado.", roles: ["Administrador", "Pastor", "Supervisor"] },
    { key: "loanReturn", label: "Devolução de empréstimo", description: "Avisar quando uma devolução for registrada.", roles: ["Administrador", "Pastor", "Supervisor"] },
    { key: "overdueLoan", label: "Empréstimo atrasado", description: "Alertar quando a data prevista de devolução for ultrapassada.", roles: ["Administrador", "Pastor", "Supervisor", "Líder"] },
  ] },
  { id: "usufructs", title: "Usufrutos", items: [
    { key: "usufructDueSoon", label: "Devolução de usufruto próxima", description: "Avisar antes do encerramento previsto do usufruto.", roles: ["Administrador", "Pastor", "Supervisor", "Líder"] },
    { key: "overdueUsufruct", label: "Usufruto vencido", description: "Alertar quando um usufruto ultrapassar o prazo.", roles: ["Administrador", "Pastor", "Supervisor", "Líder"] },
  ] },
  { id: "assets", title: "Patrimônio e doações", items: [
    { key: "newDonation", label: "Nova doação", description: "Avisar quando uma doação patrimonial for cadastrada.", roles: ["Administrador", "Pastor"] },
    { key: "assetMaintenance", label: "Patrimônio em manutenção", description: "Alertar sobre alterações relacionadas à manutenção dos bens.", roles: ["Administrador", "Pastor", "Supervisor"] },
    { key: "assetInactivation", label: "Patrimônio inativado", description: "Avisar quando um patrimônio for inativado.", roles: ["Administrador", "Pastor"] },
  ] },
];

const getNotificationUserKey = (user) => String(user?.id ?? user?.email ?? "anonymous").toLowerCase();
const availableNotifications = (role) => NOTIFICATION_CATALOG.map((category) => ({ ...category, items: category.items.filter((item) => item.roles.includes(role)) })).filter((category) => category.items.length > 0);
const readNotificationStorage = () => {
  try { return JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY)) ?? {}; }
  catch { return {}; }
};

export const getNotificationSettings = async (user) => {
  if (API_URL) {
    const response = await fetch(`${API_URL}/configuracoes/notificacoes`);
    if (!response.ok) throw new Error("Não foi possível carregar as preferências de notificações.");
    return response.json();
  }
  await wait(350);
  const stored = readNotificationStorage();
  const preferences = stored[getNotificationUserKey(user)]?.preferences ?? {};
  return availableNotifications(user?.role).map((category) => ({ ...category, items: category.items.map((item) => ({ ...item, enabled: preferences[item.key] ?? true })) }));
};

export const updateNotificationSettings = async (preferences, user) => {
  if (API_URL) {
    const response = await fetch(`${API_URL}/configuracoes/notificacoes`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ preferences }) });
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message ?? "Não foi possível salvar as preferências de notificações."); }
    return response.json();
  }
  await wait(600);
  const stored = readNotificationStorage();
  stored[getNotificationUserKey(user)] = { preferences, updatedAt: new Date().toISOString(), updatedBy: user?.name ?? "Usuário do sistema" };
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(stored));
  return stored[getNotificationUserKey(user)];
};
