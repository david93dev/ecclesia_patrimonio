import { useState } from "react";
import { SystemHeader } from "../../components/layout/SystemHeader";
import { Sidebar } from "../../components/sidebar/Sidebar";

const StatCard = ({ label, value, detail, tone, icon }) => (
  <article className="rounded-2xl border border-[#e5e3eb] bg-white p-5 shadow-[0_7px_25px_rgba(31,24,61,.045)]">
    <div className="flex items-start justify-between">
      <span className={`grid size-10 place-items-center rounded-xl ${tone}`}><svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"><path d={icon}/></svg></span>
      <span className="rounded-full bg-[#e2f7f0] px-2 py-1 text-[9px] font-bold text-[#168765]">+4,2%</span>
    </div>
    <p className="mt-5 text-xs font-medium text-[#777486]">{label}</p>
    <strong className="mt-1 block font-[Manrope] text-2xl tracking-[-.8px] text-[#211e32]">{value}</strong>
    <small className="mt-2 block text-[10px] text-[#9895a2]">{detail}</small>
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
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#f7f7fa] text-[#19172c]">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <SystemHeader title={children ? "Área administrativa" : "Visão geral"} />

        {children || <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
          <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="text-[11px] font-semibold text-[#5b3fd1]">QUARTA-FEIRA, 05 DE AGOSTO</span><h2 className="mt-1 font-[Manrope] text-2xl font-bold tracking-[-.8px] sm:text-[28px]">Olá, David. <span className="font-medium text-[#8b8797]">Tudo em ordem por aqui.</span></h2><p className="mt-2 text-xs text-[#777486]">Acompanhe o patrimônio e as atividades recentes da sua comunidade.</p></div>
            <button type="button" className="flex h-10 w-fit cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-[#4931a8] to-[#6d50e8] px-4 text-xs font-bold text-white shadow-[0_9px_20px_rgba(73,49,168,.2)] hover:-translate-y-px"><span className="text-lg font-normal">+</span> Novo patrimônio</button>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Patrimônios cadastrados" value="248" detail="12 adicionados neste mês" tone="bg-[#eeeafd] text-[#5b3fd1]" icon="M4 21h16M6 21V9m12 12V9M3 9h18L12 3 3 9Z" />
            <StatCard label="Valor patrimonial" value="R$ 3,8 mi" detail="Valor total estimado" tone="bg-[#fff4d9] text-[#bd8120]" icon="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <StatCard label="Itens inventariados" value="91%" detail="226 de 248 itens" tone="bg-[#e2f7f0] text-[#168765]" icon="m5 12 4 4L19 6" />
            <StatCard label="Manutenções abertas" value="06" detail="2 requerem atenção" tone="bg-[#fdebed] text-[#c64b5d]" icon="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.4 7.2 6.1 4.9a4 4 0 0 0 5 5L5 16l3 3 6.1-6.1a4 4 0 0 0 5-5L16.8 10 14 7.2" />
          </section>

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
            <article className="overflow-hidden rounded-2xl border border-[#e5e3eb] bg-white shadow-[0_7px_25px_rgba(31,24,61,.04)]">
              <div className="flex items-center justify-between border-b border-[#eeecf1] px-5 py-4"><div><h3 className="text-sm font-bold">Patrimônios recentes</h3><p className="mt-0.5 text-[10px] text-[#8b8797]">Últimos itens adicionados ao acervo</p></div><button className="cursor-pointer text-[11px] font-bold text-[#5b3fd1]">Ver todos</button></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-left"><thead><tr className="bg-[#faf9fc] text-[9px] tracking-[.1em] text-[#9895a2] uppercase"><th className="px-5 py-3 font-bold">Patrimônio</th><th className="px-4 py-3 font-bold">Categoria</th><th className="px-4 py-3 font-bold">Localização</th><th className="px-4 py-3 font-bold">Estado</th><th className="px-5 py-3" /></tr></thead><tbody>{assets.map(([name, category, location, status], i) => <tr key={name} className="border-t border-[#f0eef3] text-xs hover:bg-[#faf9fc]"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-[#eeeafd] font-[Manrope] text-[10px] font-bold text-[#5b3fd1]">{String(i + 1).padStart(2,"0")}</span><strong className="font-semibold">{name}</strong></div></td><td className="px-4 py-3.5 text-[#716f80]">{category}</td><td className="px-4 py-3.5 text-[#716f80]">{location}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${status === "Regular" ? "bg-[#e2f7f0] text-[#168765]" : "bg-[#fff4d9] text-[#a36c13]"}`}>{status}</span></td><td className="px-5 py-3.5 text-right text-[#9895a2]">•••</td></tr>)}</tbody></table></div>
            </article>

            <article className="rounded-2xl border border-[#e5e3eb] bg-white p-5 shadow-[0_7px_25px_rgba(31,24,61,.04)]">
              <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">Distribuição do acervo</h3><p className="mt-0.5 text-[10px] text-[#8b8797]">Por categoria patrimonial</p></div><button className="text-[#9895a2]">•••</button></div>
              <div className="my-7 flex items-center justify-center"><div className="relative grid size-38 place-items-center rounded-full bg-[conic-gradient(#5b3fd1_0_42%,#9b83fa_42%_67%,#e7ad46_67%_84%,#20a981_84%)] before:absolute before:size-25 before:rounded-full before:bg-white"><span className="relative text-center"><strong className="block font-[Manrope] text-xl">248</strong><small className="text-[9px] text-[#8b8797]">itens</small></span></div></div>
              <div className="grid grid-cols-2 gap-3 text-[10px]">{[["#5b3fd1","Imóveis","42%"],["#9b83fa","Arte sacra","25%"],["#e7ad46","Documentos","17%"],["#20a981","Outros","16%"]].map(([color,label,value])=><div key={label} className="flex items-center gap-2"><i className="size-2 rounded-full" style={{background:color}}/><span className="text-[#777486]">{label}</span><strong className="ml-auto">{value}</strong></div>)}</div>
            </article>
          </section>
        </div>}
      </main>
    </div>
  );
};
