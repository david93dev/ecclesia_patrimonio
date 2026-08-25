import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SystemHeader } from "../../components/layout/SystemHeader";
import { Sidebar } from "../../components/sidebar/Sidebar";

const routeTitles = {
  "/dashboard": "Visão geral",
  "/patrimonios": "Patrimônios",
  "/departamentos": "Departamentos",
  "/emprestimos": "Empréstimos",
  "/inventario": "Inventário",
  "/manutencoes": "Manutenções",
  "/relatorios": "Relatórios",
  "/usuarios": "Usuários",
  "/configuracoes": "Configurações",
};

export const SystemLayout = () => {
  const [activeItem, setActiveItem] = useState("inicio");
  const { pathname } = useLocation();
  const title = pathname.startsWith("/patrimonios")
    ? "Gestão de Patrimônios"
    : pathname.startsWith("/departamentos")
      ? "Gestão de Departamentos"
    : pathname.startsWith("/emprestimos")
      ? "Gestão de Empréstimos"
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
