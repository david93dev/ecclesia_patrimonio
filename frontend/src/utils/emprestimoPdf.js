const formatDate = (value) => value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${value.slice(0, 10)}T12:00:00Z`)) : "—";

export const createEmprestimoPdf = async (loan) => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const left = 20; const width = 170;
  doc.setProperties({ title: `Termo de Empréstimo - ${loan.patrimonio?.nome}`, subject: "Termo de responsabilidade patrimonial", creator: "Ecclesia Patrimônio" });
  doc.setTextColor(73, 49, 168); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("TERMO DE EMPRÉSTIMO", 105, 24, { align: "center" });
  doc.setTextColor(80); doc.setFontSize(9); doc.text("RESPONSABILIDADE SOBRE PATRIMÔNIO", 105, 31, { align: "center" });
  doc.setDrawColor(109, 80, 232); doc.line(left, 37, 190, 37);
  doc.setTextColor(35); doc.setFontSize(11); doc.setFont("helvetica", "normal");
  const intro = `Pelo presente termo, ${loan.responsavel}, declara receber temporariamente o patrimônio abaixo identificado, comprometendo-se a utilizá-lo exclusivamente para a finalidade informada e a devolvê-lo no prazo e nas condições estabelecidas.`;
  doc.text(doc.splitTextToSize(intro, width), left, 48, { lineHeightFactor: 1.45 });
  const rows = [
    ["Patrimônio", `${loan.patrimonio?.nome} (${loan.patrimonio?.codigoPatrimonial})`], ["Departamento", loan.patrimonio?.departamento],
    ["Responsável", loan.responsavel], ["Finalidade", loan.finalidade], ["Data de retirada", formatDate(loan.dataRetirada)],
    ["Devolução prevista", formatDate(loan.dataPrevistaDevolucao)], ["Cadastrado por", loan.cadastradoPor],
  ];
  let y = 76;
  rows.forEach(([label, value]) => { doc.setFont("helvetica", "bold"); doc.text(`${label}:`, left, y); doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(String(value ?? "—"), 125); doc.text(lines, 55, y); y += Math.max(8, lines.length * 5); });
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Termos e condições", left, y + 5); y += 14;
  const terms = [
    "O patrimônio deverá ser utilizado somente para a finalidade registrada neste termo.",
    "O responsável compromete-se a conservar o item e não transferi-lo a terceiros sem autorização.",
    "Qualquer avaria, perda ou alteração deverá ser comunicada imediatamente à administração.",
    "O patrimônio deverá ser devolvido até a data prevista, acompanhado de seus acessórios.",
    "Na devolução, o estado do item será conferido e eventuais ocorrências serão registradas no histórico.",
  ];
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  terms.forEach((term, index) => { const lines = doc.splitTextToSize(`${index + 1}. ${term}`, width); doc.text(lines, left, y, { lineHeightFactor: 1.35 }); y += lines.length * 5 + 3; });
  y = Math.max(y + 18, 225); doc.line(25, y, 90, y); doc.line(120, y, 185, y);
  doc.setFontSize(9); doc.text(loan.responsavel, 57.5, y + 6, { align: "center" }); doc.text("Responsável pela entrega", 152.5, y + 6, { align: "center" });
  doc.setTextColor(110); doc.text(`Documento gerado em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date())}`, 105, 282, { align: "center" });
  return doc;
};

export const downloadEmprestimoPdf = async (loan) => { const doc = await createEmprestimoPdf(loan); doc.save(`termo-emprestimo-${loan.patrimonio?.codigoPatrimonial ?? loan.id}.pdf`); };
export const printEmprestimoPdf = async (loan) => { const doc = await createEmprestimoPdf(loan); doc.autoPrint(); window.open(doc.output("bloburl"), "_blank", "noopener,noreferrer"); };
