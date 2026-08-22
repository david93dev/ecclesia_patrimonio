const MOCK_DASHBOARD = {
  indicators: { totalAssets: 150, availableAssets: 98, loanedAssets: 25, usufructAssets: 12, totalDonations: 15, activeLoans: 25, activeUsufructs: 12 },
  loans: { active: 25, overdue: 3, dueSoon: 6 },
  usufructs: { active: 12, endingSoon: 2, permanent: 4 },
};

const wait = (milliseconds, signal) => new Promise((resolve, reject) => {
  const timer = setTimeout(resolve, milliseconds);
  signal?.addEventListener("abort", () => { clearTimeout(timer); reject(new DOMException("Requisição cancelada", "AbortError")); }, { once: true });
});

// Substitua somente esta função pela chamada HTTP quando a API estiver disponível.
export const getDashboardData = async ({ signal } = {}) => {
  await wait(700, signal);
  const simulatedState = new URLSearchParams(window.location.search).get("dashboardState");
  if (simulatedState === "error") throw new Error("Não foi possível consultar os indicadores.");
  if (simulatedState === "empty") return { indicators: {}, loans: {}, usufructs: {}, updatedAt: new Date().toISOString() };
  return { ...MOCK_DASHBOARD, updatedAt: new Date().toISOString() };
};
