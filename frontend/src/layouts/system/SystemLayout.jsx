import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SystemHeader } from "../../components/layout/SystemHeader";
import { Sidebar } from "../../components/sidebar/Sidebar";

const routeTitles = { "/dashboard": "Visão geral", "/patrimonios": "Patrimônios", "/inventario": "Inventário", "/manutencoes": "Manutenções", "/relatorios": "Relatórios", "/usuarios": "Usuários", "/configuracoes": "Configurações" };

export const SystemLayout = ({ children }) => {
  const [activeItem, setActiveItem] = useState("inicio");
  const { pathname } = useLocation();
  return <div className="flex h-dvh min-h-0 overflow-hidden bg-app-background text-foreground">
    <Sidebar activeItem={activeItem} onSelect={setActiveItem} />
    <main className="min-w-0 flex-1 overflow-y-auto"><SystemHeader title={routeTitles[pathname] ?? "Área administrativa"} />{children}</main>
  </div>;
};
