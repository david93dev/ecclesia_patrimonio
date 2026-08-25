import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { SystemLayout } from "../layouts/system/SystemLayout";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { AuthLogin } from "../pages/login/AuthLogin";
import { PatrimonioCreatePage } from "../pages/patrimonios/PatrimonioCreatePage";
import { PatrimonioDetailPage } from "../pages/patrimonios/PatrimonioDetailPage";
import { PatrimonioEditPage } from "../pages/patrimonios/PatrimonioEditPage";
import { PatrimonioListPage } from "../pages/patrimonios/PatrimonioListPage";
import { DepartamentoCreatePage } from "../pages/departamentos/DepartamentoCreatePage";
import { DepartamentoEditPage } from "../pages/departamentos/DepartamentoEditPage";
import { DepartamentoListPage } from "../pages/departamentos/DepartamentoListPage";
import { EmprestimoCreatePage } from "../pages/emprestimos/EmprestimoCreatePage";
import { EmprestimoDetailPage } from "../pages/emprestimos/EmprestimoDetailPage";
import { EmprestimoListPage } from "../pages/emprestimos/EmprestimoListPage";
import { EmprestimoReturnPage } from "../pages/emprestimos/EmprestimoReturnPage";
import { EmprestimoTermPage } from "../pages/emprestimos/EmprestimoTermPage";
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
            <Route path="/patrimonios/:id/editar" element={<PatrimonioEditPage />} />
            <Route path="/patrimonios/:id" element={<PatrimonioDetailPage />} />
            <Route path="/departamentos" element={<DepartamentoListPage />} />
            <Route path="/departamentos/novo" element={<DepartamentoCreatePage />} />
            <Route path="/departamentos/:id/editar" element={<DepartamentoEditPage />} />
            <Route path="/emprestimos" element={<EmprestimoListPage />} />
            <Route path="/emprestimos/novo" element={<EmprestimoCreatePage />} />
            <Route path="/emprestimos/:id/devolver" element={<EmprestimoReturnPage />} />
            <Route path="/emprestimos/:id/termo" element={<EmprestimoTermPage />} />
            <Route path="/emprestimos/:id" element={<EmprestimoDetailPage />} />
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
