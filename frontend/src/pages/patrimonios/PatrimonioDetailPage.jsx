import { useEffect, useState } from "react";
import { FiArrowLeft, FiImage } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { getPatrimonio } from "../../services/patrimonioService";

const date = (value) => value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(value)) : "Não informado";
const money = (value) => value ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value)) : "Não informado";

export const PatrimonioDetailPage = () => {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, item: null, error: "" });
  useEffect(() => { getPatrimonio(id).then((item) => setState({ loading: false, item, error: "" })).catch((error) => setState({ loading: false, item: null, error: error.message })); }, [id]);

  if (state.loading) return <div className="p-10 text-center text-sm text-muted">Carregando patrimônio...</div>;
  if (state.error || !state.item) return <div className="mx-auto max-w-xl p-6 text-center"><div className="rounded-2xl border border-danger/20 bg-danger-soft p-8"><h2 className="font-bold">Patrimônio não encontrado</h2><p className="mt-2 text-sm text-muted">{state.error || "O item solicitado não existe ou foi removido."}</p><Link to="/patrimonios" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-brand-700"><FiArrowLeft /> Voltar à listagem</Link></div></div>;

  const item = state.item;
  const details = [["Código patrimonial", item.codigoPatrimonial], ["Departamento", item.departamento], ["Categoria", item.categoria], ["Líder responsável", item.responsavel], ["Tipo", item.tipo], ["Data de registro", date(item.dataRegistro)], ["Data de aquisição", date(item.dataAquisicao)], ["Valor", money(item.valor)]];
  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8 lg:p-10">
      <Link to="/patrimonios" className="mb-5 flex w-fit items-center gap-2 text-xs font-bold text-brand-700"><FiArrowLeft /> Voltar à listagem</Link>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="grid lg:grid-cols-[minmax(280px,38%)_1fr]">
          <div className="grid min-h-64 place-items-center bg-surface-subtle">
            {item.imagem ? <img src={item.imagem} alt={item.nome} className="h-full max-h-105 w-full object-cover" /> : <div className="text-center text-muted-faint"><FiImage className="mx-auto" size={42} /><p className="mt-2 text-xs">Imagem não disponível</p></div>}
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-[11px] font-bold text-brand-700">DETALHES DO PATRIMÔNIO</span><h2 className="mt-1 font-[Manrope] text-2xl font-bold">{item.nome}</h2></div><span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">{item.status}</span></div>
            <dl className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2">{details.map(([label, value]) => <div key={label}><dt className="text-[10px] font-bold tracking-wide text-muted uppercase">{label}</dt><dd className="mt-1 text-sm font-medium">{value || "Não informado"}</dd></div>)}</dl>
            <div className="mt-7 border-t border-border pt-6"><h3 className="text-xs font-bold text-label">Descrição</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{item.descricao}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};
