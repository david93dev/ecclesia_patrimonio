import { useEffect, useState } from "react";
import logo from "../../assets/ecclesia-logo-v3.png";
import isotipo from "../../assets/ecclesia-isotipo-v3.png";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarUser } from "./SidebarUser";

const menuItems = [
  { id: "inicio", label: "Visão geral", icon: "inicio" },
  { id: "patrimonio", label: "Patrimônios", icon: "patrimonio", badge: "248" },
  { id: "inventario", label: "Inventário", icon: "inventario" },
  { id: "manutencao", label: "Manutenções", icon: "manutencao", badge: "6" },
  { id: "relatorios", label: "Relatórios", icon: "relatorios" },
  { id: "usuarios", label: "Usuários", icon: "usuarios" },
  { id: "configuracoes", label: "Configurações", icon: "configuracoes" },
];

export const Sidebar = ({ activeItem, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return <>
    <button type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir menu" className="fixed top-4 left-4 z-40 grid size-10 place-items-center rounded-xl border border-[#dedde6] bg-white text-[#4931a8] shadow-lg lg:hidden"><svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <button type="button" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className={`fixed inset-0 z-40 bg-[#16103d]/55 backdrop-blur-[2px] transition lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} />
    <aside className={`fixed inset-y-0 left-0 z-50 flex h-dvh flex-col overflow-hidden border-r border-white/7 bg-[linear-gradient(180deg,#1c1544_0%,#120e31_100%)] shadow-[14px_0_45px_rgba(22,16,61,.22)] transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "w-20" : "w-64"}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(128,99,232,.23),transparent_68%)]" />
      <header className={`relative flex h-20 shrink-0 items-center border-b border-white/7 ${collapsed ? "justify-center px-3" : "justify-between px-4"}`}>
        <img src={collapsed ? isotipo : logo} alt="Ecclesia Patrimônio" className={`${collapsed ? "w-10" : "w-38"} h-auto object-contain`} />
        {!collapsed && <button type="button" onClick={() => setCollapsed(true)} aria-label="Recolher menu" className="hidden size-8 cursor-pointer place-items-center rounded-lg border border-white/8 text-[#81799e] hover:bg-white/6 hover:text-white lg:grid"><svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2"><path d="m15 18-6-6 6-6"/></svg></button>}
        {collapsed && <button type="button" onClick={() => setCollapsed(false)} aria-label="Expandir menu" className="absolute inset-0 hidden cursor-pointer lg:block" />}
        <button type="button" onClick={() => setMobileOpen(false)} aria-label="Fechar menu" className="grid size-8 place-items-center text-[#aaa3c3] lg:hidden"><svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </header>
      <SidebarMenu items={menuItems} collapsed={collapsed} activeItem={activeItem} onSelect={(id) => { onSelect(id); setMobileOpen(false); }} />
      <SidebarUser collapsed={collapsed} />
    </aside>
  </>;
};
