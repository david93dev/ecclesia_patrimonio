const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const STORAGE_KEY = "ecclesia:patrimonios";

const MOCK_ASSETS = [
  {
    id: "pat-001",
    nome: "Projetor Epson PowerLite",
    descricao: "Projetor multimídia utilizado em formações, reuniões e eventos no salão paroquial.",
    categoria: "Equipamentos audiovisuais",
    departamento: "Comunicação",
    responsavel: "Mariana Alves",
    tipo: "Próprio",
    valor: "3890.00",
    dataAquisicao: "2025-02-18",
    dataRegistro: "2025-02-20T14:30:00.000Z",
    codigoPatrimonial: "PAT-00001",
    status: "Disponível",
    imagem: null,
  },
  {
    id: "pat-002",
    nome: "Mesa de reunião em madeira",
    descricao: "Mesa com capacidade para dez pessoas, instalada na sala do conselho pastoral.",
    categoria: "Móveis e utensílios",
    departamento: "Administração",
    responsavel: "Carlos Henrique",
    tipo: "Doação",
    valor: "2400.00",
    dataAquisicao: "2024-11-05",
    dataRegistro: "2024-11-08T11:00:00.000Z",
    codigoPatrimonial: "PAT-00002",
    status: "Em uso",
    imagem: null,
  },
  {
    id: "pat-003",
    nome: "Notebook Dell Latitude",
    descricao: "Notebook destinado às atividades administrativas e ao controle financeiro da paróquia.",
    categoria: "Informática",
    departamento: "Financeiro",
    responsavel: "Ana Paula Rocha",
    tipo: "Próprio",
    valor: "4750.00",
    dataAquisicao: "2025-06-12",
    dataRegistro: "2025-06-13T13:15:00.000Z",
    codigoPatrimonial: "PAT-00003",
    status: "Em uso",
    imagem: null,
  },
  {
    id: "pat-004",
    nome: "Caixa de som JBL",
    descricao: "Caixa amplificada portátil usada nas celebrações realizadas em áreas externas.",
    categoria: "Áudio e som",
    departamento: "Liturgia",
    responsavel: "João Batista Lima",
    tipo: "Usufruto",
    valor: "2100.00",
    dataAquisicao: "2026-01-10",
    dataRegistro: "2026-01-12T16:45:00.000Z",
    codigoPatrimonial: "PAT-00004",
    status: "Em manutenção",
    imagem: null,
  },
  {
    id: "pat-005",
    nome: "Cálice litúrgico dourado",
    descricao: "Cálice em metal dourado destinado exclusivamente às celebrações eucarísticas.",
    categoria: "Objetos litúrgicos",
    departamento: "Sacristia",
    responsavel: "Padre Lucas Ferreira",
    tipo: "Doação",
    valor: "",
    dataAquisicao: "2023-12-24",
    dataRegistro: "2023-12-26T10:00:00.000Z",
    codigoPatrimonial: "PAT-00005",
    status: "Disponível",
    imagem: null,
  },
  {
    id: "pat-006",
    nome: "Ar-condicionado 18.000 BTUs",
    descricao: "Equipamento instalado na secretaria para climatização durante o atendimento ao público.",
    categoria: "Eletrodomésticos",
    departamento: "Secretaria",
    responsavel: "Beatriz Sousa",
    tipo: "Próprio",
    valor: "3299.90",
    dataAquisicao: "2025-09-03",
    dataRegistro: "2025-09-05T12:20:00.000Z",
    codigoPatrimonial: "PAT-00006",
    status: "Em uso",
    imagem: null,
  },
];

const wait = (milliseconds = 350) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const readLocal = () => {
  try {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    const customItems = storedItems ? JSON.parse(storedItems) : [];
    const customIds = new Set(customItems.map((item) => String(item.id)));
    return [...customItems, ...MOCK_ASSETS.filter((item) => !customIds.has(item.id))];
  } catch {
    return MOCK_ASSETS;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Não foi possível concluir a operação.");
  }
  return response.status === 204 ? null : response.json();
};

export const listAssets = async () => {
  if (API_URL) return request("/patrimonios");
  await wait();
  return readLocal();
};

export const getAsset = async (id) => {
  if (API_URL) return request(`/patrimonios/${id}`);
  await wait();
  return readLocal().find((item) => String(item.id) === String(id)) ?? null;
};

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  if (!file) return resolve(null);
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error("Não foi possível processar a imagem."));
  reader.readAsDataURL(file);
});

export const createAsset = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== "" && value != null) formData.append(key, value);
  });

  if (API_URL) return request("/patrimonios", { method: "POST", body: formData });

  await wait(600);
  const items = readLocal();
  const item = {
    ...data,
    id: crypto.randomUUID(),
    codigoPatrimonial: `PAT-${String(items.length + 1).padStart(5, "0")}`,
    status: "Disponível",
    dataRegistro: new Date().toISOString(),
    imagem: await fileToDataUrl(data.imagem),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...items]));
  return item;
};

export const updateAsset = async (id, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "imagem" && !(value instanceof File)) return;
    if (value !== "" && value != null) formData.append(key, value);
  });

  if (API_URL) {
    return request(`/patrimonios/${id}`, { method: "PUT", body: formData });
  }

  await wait(600);
  const items = readLocal();
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error("Patrimônio não encontrado.");

  const current = items[index];
  const editableFields = ["nome", "descricao", "categoria", "departamento", "tipo", "responsavel", "valor", "dataAquisicao"];
  const changes = editableFields
    .filter((field) => String(current[field] ?? "") !== String(data[field] ?? ""))
    .map((field) => ({ campo: field, anterior: current[field] ?? "", atual: data[field] ?? "" }));
  if (data.imagem instanceof File) changes.push({ campo: "imagem", anterior: current.imagem ? "Imagem anterior" : "Sem imagem", atual: data.imagem.name });

  const updated = {
    ...current,
    ...data,
    imagem: data.imagem instanceof File ? await fileToDataUrl(data.imagem) : current.imagem,
    atualizadoEm: new Date().toISOString(),
    historico: [...(current.historico ?? []), { data: new Date().toISOString(), acao: "Patrimônio atualizado", alteracoes: changes }],
  };
  items[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return updated;
};

export const inactivateAsset = async (id) => {
  if (API_URL) return request(`/patrimonios/${id}/inativar`, { method: "PATCH" });
  await wait(500);
  const items = readLocal();
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error("Patrimônio não encontrado.");
  const current = items[index];
  if (current.emprestimoAtivo || String(current.status).toLowerCase() === "emprestado") {
    throw new Error("Este patrimônio possui um empréstimo ativo e não pode ser inativado.");
  }
  if (String(current.status).toLowerCase() === "inativo") throw new Error("Este patrimônio já está inativo.");
  const now = new Date().toISOString();
  const updated = {
    ...current,
    status: "Inativo",
    atualizadoEm: now,
    historico: [...(current.historico ?? []), { data: now, acao: "Patrimônio inativado", alteracoes: [{ campo: "status", anterior: current.status, atual: "Inativo" }] }],
  };
  items[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return updated;
};

