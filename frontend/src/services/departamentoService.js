import { listPatrimonios } from "./patrimonioService";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const STORAGE_KEY = "ecclesia:departamentos";
const MOCK_DEPARTAMENTOS = [
  { id: "dep-001", nome: "Comunicação", descricao: "Responsável pela comunicação institucional e mídias.", lider: "Mariana Alves", status: "Ativo", dataCadastro: "2025-01-10T13:00:00.000Z", cadastradoPor: "David Silva", historico: [] },
  { id: "dep-002", nome: "Administração", descricao: "Gestão administrativa e apoio às atividades paroquiais.", lider: "Carlos Henrique", status: "Ativo", dataCadastro: "2025-01-11T13:00:00.000Z", cadastradoPor: "David Silva", historico: [] },
  { id: "dep-003", nome: "Liturgia", descricao: "Organização das celebrações e equipes litúrgicas.", lider: "João Batista Lima", status: "Ativo", dataCadastro: "2025-01-12T13:00:00.000Z", cadastradoPor: "David Silva", historico: [] },
  { id: "dep-004", nome: "Pastoral Social", descricao: "Coordenação das ações sociais e comunitárias.", lider: "Fernanda Costa", status: "Ativo", dataCadastro: "2025-01-13T13:00:00.000Z", cadastradoPor: "David Silva", historico: [] },
];

const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));
const readLocal = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const custom = stored ? JSON.parse(stored) : [];
    const ids = new Set(custom.map((item) => String(item.id)));
    return [...custom, ...MOCK_DEPARTAMENTOS.filter((item) => !ids.has(item.id))];
  } catch { return MOCK_DEPARTAMENTOS; }
};
const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json", ...options.headers }, ...options });
  if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message ?? "Não foi possível concluir a operação."); }
  return response.status === 204 ? null : response.json();
};

export const listDepartamentos = async () => { if (API_URL) return request("/departamentos"); await wait(); return readLocal(); };
export const getDepartamento = async (id) => { if (API_URL) return request(`/departamentos/${id}`); await wait(); return readLocal().find((item) => String(item.id) === String(id)) ?? null; };

export const createDepartamento = async (data, user) => {
  if (API_URL) return request("/departamentos", { method: "POST", body: JSON.stringify(data) });
  await wait(500); const items = readLocal();
  if (items.some((item) => normalize(item.nome) === normalize(data.nome))) throw new Error("Já existe um departamento cadastrado com este nome.");
  const item = { ...data, id: crypto.randomUUID(), status: "Ativo", dataCadastro: new Date().toISOString(), cadastradoPor: user?.name ?? "Usuário não identificado", historico: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...items])); return item;
};

export const updateDepartamento = async (id, data, user) => {
  if (API_URL) return request(`/departamentos/${id}`, { method: "PUT", body: JSON.stringify(data) });
  await wait(500); const items = readLocal(); const index = items.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error("Departamento não encontrado.");
  if (items.some((item) => String(item.id) !== String(id) && normalize(item.nome) === normalize(data.nome))) throw new Error("Já existe um departamento cadastrado com este nome.");
  const current = items[index]; const now = new Date().toISOString();
  const alteracoes = ["nome", "descricao", "lider"].filter((field) => String(current[field] ?? "") !== String(data[field] ?? "")).map((field) => ({ campo: field, anterior: current[field] ?? "", atual: data[field] ?? "" }));
  const updated = { ...current, ...data, atualizadoEm: now, atualizadoPor: user?.name ?? "Usuário não identificado", historico: [...(current.historico ?? []), { data: now, acao: "Departamento atualizado", usuario: user?.name, alteracoes }] };
  items[index] = updated; localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); return updated;
};

export const deleteDepartamento = async (id) => {
  if (API_URL) return request(`/departamentos/${id}`, { method: "DELETE" });
  await wait(500); const items = readLocal(); const department = items.find((item) => String(item.id) === String(id));
  if (!department) throw new Error("Departamento não encontrado.");
  const patrimonios = await listPatrimonios();
  if (patrimonios.some((item) => normalize(item.departamento) === normalize(department.nome))) throw new Error("Não foi possível excluir este departamento. Existem patrimônios vinculados a ele. Para realizar a exclusão, primeiro é necessário desvincular esses patrimônios.");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.filter((item) => String(item.id) !== String(id))));
};
