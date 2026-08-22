import { SidebarMenuItem } from "./SidebarMenuItem";

export const SidebarMenu = ({ items, collapsed, activeItem, onSelect }) => (
  <nav aria-label="Navegação principal" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
    <p className={`mb-3 overflow-hidden px-3 text-[9px] font-bold tracking-[.18em] text-[#aaa3c3] uppercase transition-all ${collapsed ? "h-0 opacity-0" : "h-auto opacity-100"}`}>Navegação</p>
    {items.map((item) => <SidebarMenuItem key={item.id} item={item} collapsed={collapsed} active={activeItem === item.id} onSelect={onSelect} />)}
  </nav>
);
