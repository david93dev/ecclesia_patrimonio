import { useState } from "react";
import { SystemHeader } from "../../components/layout/SystemHeader";
import { Sidebar } from "../../components/sidebar/Sidebar";

const StatCard = ({ label, value, detail, tone, icon }) => (
  <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
    <div className="flex items-start justify-between">
      <span className={`grid size-10 place-items-center rounded-xl ${tone}`}><svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"><path d={icon}/></svg></span>
      <span className="rounded-full bg-success-soft px-2 py-1 text-[9px] font-bold text-success">+4,2%</span>
    </div>
    <p className="mt-5 text-xs font-medium text-muted">{label}</p>
    <strong className="mt-1 block font-[Manrope] text-2xl tracking-[-.8px] text-foreground-strong">{value}</strong>
    <small className="mt-2 block text-[10px] text-muted-faint">{detail}</small>
  </article>
);

const assets = [
  ["Igreja Matriz São José", "Imóvel", "Centro", "Regular"],
  ["Conjunto de cálices litúrgicos", "Objeto", "Sacristia", "Regular"],
  ["Imagem de Nossa Senhora", "Arte sacra", "Capela lateral", "Em atenção"],
  ["Arquivo paroquial — Livro 04", "Documento", "Arquivo", "Regular"],
];

export const SystemLayout = ({ children }) => {
  const [activeItem, setActiveItem] = useState("inicio");

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-app-background text-foreground">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <SystemHeader title={children ? "Área administrativa" : "Visão geral"} />

        {children || <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
          <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="text-[11px] font-semibold text-brand-700">QUARTA-FEIRA, 05 DE AGOSTO</span><h2 className="mt-1 font-[Manrope] text-2xl font-bold tracking-[-.8px] sm:text-[28px]">Olá, David. <span className="font-medium text-muted-soft">Tudo em ordem por aqui.</span></h2><p className="mt-2 text-xs text-muted">Acompanhe o patrimônio e as atividades recentes da sua comunidade.</p></div>
            <button type="button" className="flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-brand-900 to-brand-600 px-4 text-xs font-bold text-white shadow-primary hover:-translate-y-px"><span className="text-lg font-normal">+</span> Novo patrimônio</button>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Patrimônios cadastrados" value="248" detail="12 adicionados neste mês" tone="bg-brand-100 text-brand-700" icon="M4 21h16M6 21V9m12 12V9M3 9h18L12 3 3 9Z" />
            <StatCard label="Valor patrimonial" value="R$ 3,8 mi" detail="Valor total estimado" tone="bg-warning-soft text-warning-icon" icon="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <StatCard label="Itens inventariados" value="91%" detail="226 de 248 itens" tone="bg-success-soft text-success" icon="m5 12 4 4L19 6" />
            <StatCard label="Manutenções abertas" value="06" detail="2 requerem atenção" tone="bg-danger-soft text-danger" icon="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.4 7.2 6.1 4.9a4 4 0 0 0 5 5L5 16l3 3 6.1-6.1a4 4 0 0 0 5-5L16.8 10 14 7.2" />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
            <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4"><div><h3 className="text-sm font-bold">Patrimônios recentes</h3><p className="mt-0.5 text-[10px] text-muted-soft">Últimos itens adicionados ao acervo</p></div><button className="cursor-pointer text-[11px] font-bold text-brand-700">Ver todos</button></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-left"><thead><tr className="bg-surface-subtle text-[9px] tracking-[.1em] text-muted-faint uppercase"><th className="px-5 py-3 font-bold">Patrimônio</th><th className="px-4 py-3 font-bold">Categoria</th><th className="px-4 py-3 font-bold">Localização</th><th className="px-4 py-3 font-bold">Estado</th><th className="px-5 py-3" /></tr></thead><tbody>{assets.map(([name, category, location, status], i) => <tr key={name} className="border-t border-border-row text-xs hover:bg-surface-subtle"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-brand-100 font-[Manrope] text-[10px] font-bold text-brand-700">{String(i + 1).padStart(2,"0")}</span><strong className="font-semibold">{name}</strong></div></td><td className="px-4 py-3.5 text-muted">{category}</td><td className="px-4 py-3.5 text-muted">{location}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${status === "Regular" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{status}</span></td><td className="px-5 py-3.5 text-right text-muted-faint">•••</td></tr>)}</tbody></table></div>
            </article>

            <article className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">Distribuição do acervo</h3><p className="mt-0.5 text-[10px] text-muted-soft">Por categoria patrimonial</p></div><button className="text-muted-faint">•••</button></div>
              <div className="my-7 flex items-center justify-center"><div className="relative grid size-38 place-items-center rounded-full bg-[conic-gradient(var(--color-chart-1)_0_42%,var(--color-chart-2)_42%_67%,var(--color-chart-3)_67%_84%,var(--color-chart-4)_84%)] before:absolute before:size-25 before:rounded-full before:bg-surface"><span className="relative text-center"><strong className="block font-[Manrope] text-xl">248</strong><small className="text-[9px] text-muted-soft">itens</small></span></div></div>
              <div className="grid grid-cols-2 gap-3 text-[10px]">{[["var(--color-chart-1)","Imóveis","42%"],["var(--color-chart-2)","Arte sacra","25%"],["var(--color-chart-3)","Documentos","17%"],["var(--color-chart-4)","Outros","16%"]].map(([color,label,value])=><div key={label} className="flex items-center gap-2"><i className="size-2 rounded-full" style={{background:color}}/><span className="text-muted">{label}</span><strong className="ml-auto">{value}</strong></div>)}</div>
            </article>
          </section>
        </div>}
      </main>
    </div>
  );
};
