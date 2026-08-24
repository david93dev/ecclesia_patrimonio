import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { SystemLayout } from "../layouts/system/SystemLayout";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { AuthLogin } from "../pages/login/AuthLogin";
import { PlaceholderPage } from "../pages/system/PlaceholderPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const AppRoutes = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthLogin />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<SystemLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/patrimonios" element={<PlaceholderPage title="Gestão de Patrimônios" />} />
            {/* <Route path="/inventario" element={<PlaceholderPage title="Inventário" />} />
            <Route path="/manutencoes" element={<PlaceholderPage title="Manutenções" />} />
            <Route path="/relatorios" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="/usuarios" element={<PlaceholderPage title="Usuários" />} />
            <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
