import { listPatrimonios } from "./patrimonioService";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const LOAN_KEY = "ecclesia:emprestimos";
const ASSET_KEY = "ecclesia:patrimonios";
const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const getEmprestimoStatus = (loan) => {
  if (loan.status === "Devolvido") return "Devolvido";
  const today = new Date().toLocaleDateString("en-CA");
  return loan.dataPrevistaDevolucao < today ? "Atrasado" : "Emprestado";
};

const MOCK_EMPRESTIMOS = [
  {
    id: "emp-001",
    patrimonioId: "pat-003",
    patrimonio: { id: "pat-003", nome: "Notebook Dell Latitude", codigoPatrimonial: "PAT-00003", categoria: "Informática", departamento: "Financeiro" },
    responsavel: "Rafael Martins",
    finalidade: "Encontro regional da Pastoral da Juventude",
    dataRetirada: "2026-08-22",
    dataPrevistaDevolucao: "2026-08-28",
    status: "Em aberto",
    cadastradoEm: "2026-08-22T09:15:00.000Z",
    cadastradoPor: "David Silva",
  },
  {
    id: "emp-002",
    patrimonioId: "pat-004",
    patrimonio: { id: "pat-004", nome: "Caixa de som JBL", codigoPatrimonial: "PAT-00004", categoria: "Áudio e som", departamento: "Liturgia" },
    responsavel: "Camila Ferreira",
    finalidade: "Celebração na comunidade São Francisco",
    dataRetirada: "2026-08-18",
    dataPrevistaDevolucao: "2026-08-23",
    status: "Em aberto",
    cadastradoEm: "2026-08-18T13:40:00.000Z",
    cadastradoPor: "David Silva",
  },
  {
    id: "emp-003",
    patrimonioId: "pat-001",
    patrimonio: { id: "pat-001", nome: "Projetor Epson PowerLite", codigoPatrimonial: "PAT-00001", categoria: "Equipamentos audiovisuais", departamento: "Comunicação" },
    responsavel: "João Silva",
    finalidade: "Formação de catequistas",
    dataRetirada: "2026-08-10",
    dataPrevistaDevolucao: "2026-08-15",
    dataDevolucao: "2026-08-15",
    condicao: "Bom estado",
    observacoes: "Devolvido com todos os acessórios.",
    status: "Devolvido",
    cadastradoEm: "2026-08-10T11:00:00.000Z",
    cadastradoPor: "David Silva",
    devolvidoEm: "2026-08-15T16:25:00.000Z",
    devolvidoPor: "David Silva",
  },
];

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? "Não foi possível concluir a operação.");
  }
  return response.status === 204 ? null : response.json();
};

const readLoans = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(LOAN_KEY)) ?? [];
    const storedIds = new Set(stored.map((item) => String(item.id)));
    return [...stored, ...MOCK_EMPRESTIMOS.filter((item) => !storedIds.has(item.id))];
  } catch { return MOCK_EMPRESTIMOS; }
};

const changeAssetStatus = async (assetId, status, historyAction, extra = {}) => {
  const assets = await listPatrimonios();
  const index = assets.findIndex((item) => String(item.id) === String(assetId));
  if (index < 0) throw new Error("Patrimônio não encontrado.");
  const current = assets[index];
  const updated = {
    ...current, ...extra, status, atualizadoEm: new Date().toISOString(),
    historico: [...(current.historico ?? []), {
      data: new Date().toISOString(), acao: historyAction,
      alteracoes: [{ campo: "status", anterior: current.status, atual: status }],
    }],
  };
  assets[index] = updated;
  localStorage.setItem(ASSET_KEY, JSON.stringify(assets));
  return updated;
};

export const listEmprestimos = async () => {
  if (API_URL) return request("/emprestimos");
  await wait();
  return readLoans();
};

export const listPatrimoniosDisponiveis = async () => {
  if (API_URL) return request("/patrimonios?status=Disponível");
  const assets = await listPatrimonios();
  return assets.filter((item) => String(item.status).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === "disponivel");
};

export const createEmprestimo = async (data, user) => {
  if (API_URL) return request("/emprestimos", { method: "POST", body: JSON.stringify(data) });
  await wait(600);
  const available = await listPatrimoniosDisponiveis();
  const asset = available.find((item) => String(item.id) === String(data.patrimonioId));
  if (!asset) throw new Error("Este patrimônio não está mais disponível para empréstimo.");
  const now = new Date().toISOString();
  const loan = {
    id: crypto.randomUUID(), ...data,
    patrimonio: { id: asset.id, nome: asset.nome, codigoPatrimonial: asset.codigoPatrimonial, categoria: asset.categoria, departamento: asset.departamento },
    status: "Em aberto", cadastradoEm: now,
    cadastradoPor: user?.name ?? user?.email ?? "Usuário do sistema",
  };
  localStorage.setItem(LOAN_KEY, JSON.stringify([loan, ...readLoans()]));
  await changeAssetStatus(asset.id, "Emprestado", "Patrimônio emprestado", { emprestimoAtivo: loan.id });
  return loan;
};

export const devolverEmprestimo = async (id, data, user) => {
  if (API_URL) return request(`/emprestimos/${id}/devolucao`, { method: "POST", body: JSON.stringify(data) });
  await wait(600);
  const loans = readLoans();
  const index = loans.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error("Empréstimo não encontrado.");
  if (loans[index].status !== "Em aberto") throw new Error("Este empréstimo já foi encerrado.");
  const occurrence = data.condicao !== "Bom estado" ? { condicao: data.condicao, observacoes: data.observacoes } : null;
  loans[index] = { ...loans[index], ...data, status: "Devolvido", devolvidoEm: new Date().toISOString(), devolvidoPor: user?.name ?? user?.email ?? "Usuário do sistema" };
  localStorage.setItem(LOAN_KEY, JSON.stringify(loans));
  await changeAssetStatus(loans[index].patrimonioId, "Disponível", "Devolução de empréstimo registrada", { emprestimoAtivo: null, ...(occurrence && { ultimaOcorrencia: occurrence }) });
  return loans[index];
};

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("Não foi possível processar o documento.")); reader.readAsDataURL(file);
});

export const anexarTermoAssinado = async (id, file, user) => {
  if (API_URL) { const body = new FormData(); body.append("termo", file); return request(`/emprestimos/${id}/termo-assinado`, { method: "POST", body, headers: {} }); }
  await wait(500); const loans = readLoans(); const index = loans.findIndex((item) => String(item.id) === String(id));
  if (index < 0) throw new Error("Empréstimo não encontrado.");
  loans[index] = { ...loans[index], termoAssinado: { nome: file.name, tipo: file.type, tamanho: file.size, dados: await fileToDataUrl(file), anexadoEm: new Date().toISOString(), anexadoPor: user?.name ?? user?.email ?? "Usuário do sistema" } };
  localStorage.setItem(LOAN_KEY, JSON.stringify(loans)); return loans[index];
};
