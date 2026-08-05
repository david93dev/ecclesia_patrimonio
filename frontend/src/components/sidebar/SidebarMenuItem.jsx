import { FiArchive, FiBarChart2, FiBox, FiClipboard, FiHome, FiSettings, FiTool, FiUsers } from "react-icons/fi";

const icons = {
  inicio: FiHome,
  patrimonio: FiArchive,
  inventario: FiClipboard,
  manutencao: FiTool,
  relatorios: FiBarChart2,
  usuarios: FiUsers,
  configuracoes: FiSettings,
};

const Icon = ({ name }) => {
  const IconComponent = icons[name] ?? FiBox;
  return <IconComponent size={18} aria-hidden="true" />;
};

export const SidebarMenuItem = ({ item, collapsed, active, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(item.id)}
    title={collapsed ? item.label : undefined}
    className={`group relative flex h-11 w-full cursor-pointer items-center rounded-xl border transition-all duration-200 ${collapsed ? "justify-center px-2" : "gap-3 px-3"} ${active ? "border-[#8066e8]/25 bg-linear-to-r from-[#7457dc]/20 to-[#7457dc]/5 text-white" : "border-transparent text-[#aaa3c3] hover:border-white/8 hover:bg-white/5 hover:text-white"}`}
  >
    {active && <span className="absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-r-full bg-[#e7ad46] shadow-[0_0_12px_rgba(231,173,70,.65)]" />}
    <span className={`relative grid size-8 shrink-0 place-items-center rounded-lg transition ${active ? "bg-[#7659df]/20 text-[#b7a5ff]" : "text-[#81799e] group-hover:text-[#b7a5ff]"}`}>
      <Icon name={item.icon} />
      <i className={`absolute top-1 right-1 size-1 rounded-full bg-[#e7ad46] transition-all ${active ? "scale-100 opacity-100 shadow-[0_0_7px_rgba(231,173,70,.75)]" : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-80"}`} />
    </span>
    <span className={`overflow-hidden whitespace-nowrap text-[13px] font-medium transition-all ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>{item.label}</span>
    {item.badge && !collapsed && <span className="ml-auto rounded-full bg-[#e7ad46]/15 px-2 py-0.5 text-[9px] font-bold text-[#f0c36f]">{item.badge}</span>}
  </button>
);
