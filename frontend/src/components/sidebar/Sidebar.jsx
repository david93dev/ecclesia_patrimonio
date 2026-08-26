import { useEffect, useState } from "react";
import { FiChevronLeft, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/ecclesia-logo-v3.png";
import logoSymbol from "../../assets/ecclesia-symbol-v3.png";
import { SidebarMenu } from "./SidebarMenu";
import { SidebarUser } from "./SidebarUser";

const menuItems = [
  { id: "dashboard", label: "Visão geral", icon: "dashboard", to: "/dashboard" },
  {
    id: "assets",
    label: "Patrimônios",
    icon: "assets",
    to: "/assets",
  },
  {
    id: "departments",
    label: "Departamentos",
    icon: "departments",
    to: "/departments",
  },
  { id: "loans", label: "Empréstimos", icon: "loans", to: "/loans" },
  // {
  //   id: "inventory",
  //   label: "Inventário",
  //   icon: "inventory",
  //   to: "/inventory",
  // },
  // {
  //   id: "maintenance",
  //   label: "Manutenções",
  //   icon: "maintenance",
  //   to: "/maintenance",
  // },
  // {
  //   id: "reports",
  //   label: "Relatórios",
  //   icon: "reports",
  //   to: "/reports",
  // },
  // { id: "users", label: "Usuários", icon: "users", to: "/users" },
  // {
  //   id: "settings",
  //   label: "Configurações",
  //   icon: "settings",
  //   to: "/settings",
  // },
];

export const Sidebar = ({ activeItem, onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        className="fixed top-4 left-4 z-40 grid size-10 place-items-center rounded-xl border border-border-input bg-surface text-brand-900 shadow-lg lg:hidden"
      >
        <FiMenu size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-brand-700/15 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh flex-col overflow-hidden border-r border-white/7 bg-linear-to-b from-sidebar-start to-sidebar-end shadow-sidebar transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-sidebar-glow" />
        <header
          className={`relative flex h-20 shrink-0 items-center ${collapsed ? "justify-center px-3" : "justify-between px-4"}`}
        >
          <img
            src={collapsed ? logoSymbol : logo}
            alt="Ecclesia Patrimônio"
            className={`${collapsed ? "w-10" : "w-38"} h-auto object-contain`}
          />
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Recolher menu"
              className="hidden size-8 cursor-pointer place-items-center rounded-lg border border-white/8 text-sidebar-muted hover:bg-white/6 hover:text-white lg:grid"
            >
              <FiChevronLeft size={17} aria-hidden="true" />
            </button>
          )}
          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expandir menu"
              className="absolute inset-0 hidden cursor-pointer lg:block"
            />
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
            className="grid size-8 place-items-center text-sidebar-muted lg:hidden"
          >
            <FiX size={20} aria-hidden="true" />
          </button>
        </header>
        <SidebarMenu
          items={menuItems}
          collapsed={collapsed}
          activeItem={activeItem}
          onSelect={(id) => {
            onSelect(id);
            setMobileOpen(false);
          }}
        />
        <SidebarUser collapsed={collapsed} />
      </aside>
    </>
  );
};
