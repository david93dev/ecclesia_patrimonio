import { FiArchive, FiBarChart2, FiBox, FiClipboard, FiHome, FiSettings, FiTool, FiUsers } from "react-icons/fi";
import { NavLink } from "react-router-dom";

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

export const SidebarMenuItem = ({ item, collapsed, onSelect }) => (
  <NavLink
    to={item.to}
    onClick={() => onSelect(item.id)}
    title={collapsed ? item.label : undefined}
    className={({ isActive }) => `group relative flex h-11 w-full cursor-pointer items-center rounded-xl border transition-all duration-200 ${collapsed ? "justify-center px-2" : "gap-3 px-3"} ${isActive ? "border-white/18 bg-linear-to-r from-white/16 to-white/6 text-white shadow-[inset_3px_0_0_var(--color-accent)]" : "border-transparent text-sidebar-foreground hover:border-white/15 hover:bg-white/10 hover:text-white"}`}
  >
    <span className="relative grid size-8 shrink-0 place-items-center rounded-lg text-current transition group-hover:text-white">
      <Icon name={item.icon} />
      <i className="absolute top-1 right-1 size-1 scale-75 rounded-full bg-accent opacity-0 transition-all group-hover:scale-100 group-hover:opacity-80" />
    </span>
    <span className={`overflow-hidden whitespace-nowrap text-[13px] font-semibold tracking-[.01em] transition-all ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>{item.label}</span>
    {item.badge && !collapsed && <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-bold text-accent-soft">{item.badge}</span>}
  </NavLink>
);
