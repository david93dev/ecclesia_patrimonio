const Icon = ({ name, className = "size-[18px]" }) => {
  const paths = {
    inicio: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>,
    patrimonio: <><path d="M4 21h16M6 21V9m12 12V9M3 9h18L12 3 3 9Zm7 4h4m-4 4h4"/></>,
    inventario: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    manutencao: <><path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.4 7.2 6.1 4.9a4 4 0 0 0 5 5L5 16l3 3 6.1-6.1a4 4 0 0 0 5-5L16.8 10 14 7.2l.7-.9Z"/></>,
    relatorios: <><path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/></>,
    usuarios: <><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0m1-12a4 4 0 0 1 0 8"/></>,
    configuracoes: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  };
  return <svg viewBox="0 0 24 24" className={`${className} fill-none stroke-current stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]`} aria-hidden="true">{paths[name]}</svg>;
};

export const SidebarMenuItem = ({ item, collapsed, active, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(item.id)}
    title={collapsed ? item.label : undefined}
    className={`group relative flex h-11 w-full cursor-pointer items-center rounded-xl border transition-all duration-200 ${collapsed ? "justify-center px-2" : "gap-3 px-3"} ${active ? "border-[#8066e8]/25 bg-linear-to-r from-[#7457dc]/20 to-[#7457dc]/5 text-white" : "border-transparent text-[#aaa3c3] hover:border-white/8 hover:bg-white/5 hover:text-white"}`}
  >
    {active && <span className="absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-r-full bg-[#9b83fa] shadow-[0_0_12px_rgba(155,131,250,.8)]" />}
    <span className={`grid size-8 shrink-0 place-items-center rounded-lg transition ${active ? "bg-[#7659df]/20 text-[#b7a5ff]" : "text-[#81799e] group-hover:text-[#b7a5ff]"}`}><Icon name={item.icon} /></span>
    <span className={`overflow-hidden whitespace-nowrap text-[13px] font-medium transition-all ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>{item.label}</span>
    {item.badge && !collapsed && <span className="ml-auto rounded-full bg-[#e7ad46]/15 px-2 py-0.5 text-[9px] font-bold text-[#f0c36f]">{item.badge}</span>}
  </button>
);
