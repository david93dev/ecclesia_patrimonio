const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const STORAGE_KEY = "ecclesia:users";
const DEMO_PASSWORD_HASH = "54cee4ae05440e1ebb3039a04ef8ba5af793becf2f92846fb9302b07cb5538cd";
const MOCK_USERS = [
  { id: "usr-001", name: "David Silva", email: "admin@ecclesia.com.br", phone: "(85) 99911-2200", role: "Administrador", departmentId: "dep-002", departmentName: "Administração", status: "Ativo", temporaryPassword: false, passwordHash: DEMO_PASSWORD_HASH, registeredAt: "2026-01-08T09:00:00.000Z", registeredBy: "Sistema" },
  { id: "usr-002", name: "Padre Lucas Ferreira", email: "lucas.ferreira@ecclesia.com.br", phone: "(85) 98821-3040", role: "Pastor", departmentId: null, departmentName: null, status: "Ativo", temporaryPassword: false, passwordHash: DEMO_PASSWORD_HASH, registeredAt: "2026-02-12T14:20:00.000Z", registeredBy: "David Silva" },
  { id: "usr-003", name: "Mariana Alves", email: "mariana.alves@ecclesia.com.br", phone: "(85) 99742-1158", role: "Supervisor", departmentId: "dep-001", departmentName: "Comunicação", status: "Ativo", temporaryPassword: false, passwordHash: DEMO_PASSWORD_HASH, registeredAt: "2026-03-04T10:15:00.000Z", registeredBy: "David Silva" },
  { id: "usr-004", name: "Carlos Henrique", email: "carlos.henrique@ecclesia.com.br", phone: "(85) 98650-4432", role: "Líder", departmentId: "dep-002", departmentName: "Administração", status: "Ativo", temporaryPassword: false, passwordHash: DEMO_PASSWORD_HASH, registeredAt: "2026-04-18T16:40:00.000Z", registeredBy: "David Silva" },
  { id: "usr-005", name: "Camila Ferreira", email: "camila.ferreira@ecclesia.com.br", phone: null, role: "Líder", departmentId: "dep-003", departmentName: "Liturgia", status: "Ativo", temporaryPassword: false, passwordHash: DEMO_PASSWORD_HASH, registeredAt: "2026-05-23T11:30:00.000Z", registeredBy: "David Silva" },
  { id: "usr-006", name: "Fernanda Costa", email: "fernanda.costa@ecclesia.com.br", phone: "(85) 99125-7780", role: "Supervisor", departmentId: "dep-004", departmentName: "Pastoral Social", status: "Ativo", temporaryPassword: false, passwordHash: DEMO_PASSWORD_HASH, registeredAt: "2026-06-09T08:45:00.000Z", registeredBy: "David Silva" },
];

const wait = (milliseconds = 350) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();
const toPublicUser = (user) => {
  const publicUser = { ...user };
  delete publicUser.passwordHash;
  return publicUser;
};
const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const readLocal = () => {
  try {
    const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
    const storedIds = new Set(storedUsers.map((user) => String(user.id)));
    return [...storedUsers, ...MOCK_USERS.filter((user) => !storedIds.has(user.id))];
  }
  catch { return MOCK_USERS; }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json", ...options.headers }, ...options });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message ?? "Não foi possível concluir a operação."); }
  return response.status === 204 ? null : response.json();
};

export const listUsers = async () => {
  if (API_URL) return request("/usuarios");
  await wait();
  return readLocal().map(toPublicUser);
};

export const getUser = async (id) => {
  if (API_URL) return request(`/usuarios/${id}`);
  await wait();
  const user = readLocal().find((item) => String(item.id) === String(id));
  return user ? toPublicUser(user) : null;
};

export const createUser = async (data, registeredBy) => {
  if (API_URL) return request("/usuarios", { method: "POST", body: JSON.stringify(data) });
  await wait(500);
  const users = readLocal();
  const email = normalizeEmail(data.email);
  if (users.some((user) => normalizeEmail(user.email) === email)) throw new Error("Já existe um usuário cadastrado com este e-mail.");
  const user = { id: crypto.randomUUID(), name: data.name.trim(), email, phone: data.phone?.trim() || null, role: data.role, departmentId: data.departmentId || null, departmentName: data.departmentName || null, status: "Ativo", temporaryPassword: Boolean(data.temporaryPassword), passwordHash: await hashPassword(data.password), registeredAt: new Date().toISOString(), registeredBy: registeredBy?.name ?? "Administrador" };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([user, ...users]));
  return toPublicUser(user);
};

export const updateUser = async (id, data, updatedBy) => {
  if (API_URL) return request(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(data) });
  await wait(500);
  const users = readLocal();
  const index = users.findIndex((user) => String(user.id) === String(id));
  if (index < 0) throw new Error("Usuário não encontrado.");
  const email = normalizeEmail(data.email);
  if (users.some((user) => String(user.id) !== String(id) && normalizeEmail(user.email) === email)) throw new Error("Este e-mail já está sendo utilizado por outro usuário.");
  const updated = { ...users[index], name: data.name.trim(), email, phone: data.phone?.trim() || null, role: data.role, departmentId: data.departmentId || null, departmentName: data.departmentName || null, ...(data.password && { passwordHash: await hashPassword(data.password), temporaryPassword: false }), updatedAt: new Date().toISOString(), updatedBy: updatedBy?.name ?? "Administrador" };
  users[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return toPublicUser(updated);
};

const changeUserStatus = async (id, status, responsibleUser) => {
  const action = status === "Ativo" ? "reativado" : "desativado";
  if (API_URL) return request(`/usuarios/${id}/${status === "Ativo" ? "reativar" : "desativar"}`, { method: "PATCH" });
  await wait(500);
  const users = readLocal();
  const index = users.findIndex((user) => String(user.id) === String(id));
  if (index < 0) throw new Error("Usuário não encontrado.");
  if (users[index].status === status) throw new Error(`Este usuário já está ${status.toLowerCase()}.`);
  const now = new Date().toISOString();
  const event = { action, date: now, responsibleUser: responsibleUser?.name ?? "Administrador" };
  users[index] = {
    ...users[index],
    status,
    ...(status === "Inativo"
      ? { deactivatedAt: now, deactivatedBy: event.responsibleUser }
      : { reactivatedAt: now, reactivatedBy: event.responsibleUser }),
    statusHistory: [...(users[index].statusHistory ?? []), event],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return toPublicUser(users[index]);
};

export const deactivateUser = (id, responsibleUser) => changeUserStatus(id, "Inativo", responsibleUser);
export const reactivateUser = (id, responsibleUser) => changeUserStatus(id, "Ativo", responsibleUser);

export const authenticateUser = async (email, password) => {
  if (API_URL) return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  const users = readLocal();
  const account = users.find((item) => normalizeEmail(item.email) === normalizeEmail(email));
  if (account && (account.passwordHash !== await hashPassword(password) || account.status !== "Ativo")) throw new Error("E-mail ou senha inválidos.");
  const user = account;
  if (!user) return null;
  return toPublicUser(user);
};
