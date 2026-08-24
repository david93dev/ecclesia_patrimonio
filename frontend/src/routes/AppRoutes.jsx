import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { SystemLayout } from "../layouts/system/SystemLayout";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { AuthLogin } from "../pages/login/AuthLogin";
import { PatrimonioCreatePage } from "../pages/patrimonios/PatrimonioCreatePage";
import { PatrimonioDetailPage } from "../pages/patrimonios/PatrimonioDetailPage";
import { PatrimonioListPage } from "../pages/patrimonios/PatrimonioListPage";
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
            <Route path="/patrimonios" element={<PatrimonioListPage />} />
            <Route path="/patrimonios/novo" element={<PatrimonioCreatePage />} />
            <Route path="/patrimonios/:id" element={<PatrimonioDetailPage />} />
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
