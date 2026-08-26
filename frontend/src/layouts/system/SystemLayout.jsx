import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SystemHeader } from "../../components/layout/SystemHeader";
import { Sidebar } from "../../components/sidebar/Sidebar";

const routeTitles = {
  "/dashboard": "Visão geral",
  "/assets": "Patrimônios",
  "/departments": "Departamentos",
  "/loans": "Empréstimos",
  "/loans/history": "Histórico de empréstimos",
  "/inventory": "Inventário",
  "/maintenance": "Manutenções",
  "/reports": "Relatórios",
  "/users": "Usuários",
  "/settings": "Configurações",
};

export const SystemLayout = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { pathname } = useLocation();
  const title = pathname === "/loans/history"
    ? routeTitles[pathname]
    : pathname.startsWith("/assets")
    ? "Gestão de Patrimônios"
    : pathname.startsWith("/departments")
      ? "Gestão de Departamentos"
    : pathname.startsWith("/loans")
      ? "Gestão de Empréstimos"
    : pathname.startsWith("/users")
      ? "Gestão de Usuários"
    : routeTitles[pathname] ?? "Área administrativa";
  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-app-background text-foreground">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <SystemHeader title={title} />
        <Outlet />
      </main>
    </div>
  );
};
