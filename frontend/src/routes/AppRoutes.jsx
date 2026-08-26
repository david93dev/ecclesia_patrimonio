import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { SystemLayout } from "../layouts/system/SystemLayout";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { AuthLogin } from "../pages/login/AuthLogin";
import { AssetCreatePage } from "../pages/assets/AssetCreatePage";
import { AssetDetailPage } from "../pages/assets/AssetDetailPage";
import { AssetEditPage } from "../pages/assets/AssetEditPage";
import { AssetListPage } from "../pages/assets/AssetListPage";
import { DepartmentCreatePage } from "../pages/departments/DepartmentCreatePage";
import { DepartmentEditPage } from "../pages/departments/DepartmentEditPage";
import { DepartmentListPage } from "../pages/departments/DepartmentListPage";
import { LoanCreatePage } from "../pages/loans/LoanCreatePage";
import { LoanDetailPage } from "../pages/loans/LoanDetailPage";
import { LoanHistoryPage } from "../pages/loans/LoanHistoryPage";
import { LoanListPage } from "../pages/loans/LoanListPage";
import { LoanReturnPage } from "../pages/loans/LoanReturnPage";
import { LoanTermPage } from "../pages/loans/LoanTermPage";
import { UserCreatePage } from "../pages/users/UserCreatePage";
import { UserEditPage } from "../pages/users/UserEditPage";
import { UserListPage } from "../pages/users/UserListPage";
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
            <Route path="/assets" element={<AssetListPage />} />
            <Route path="/assets/new" element={<AssetCreatePage />} />
            <Route path="/assets/:id/edit" element={<AssetEditPage />} />
            <Route path="/assets/:id" element={<AssetDetailPage />} />
            <Route path="/departments" element={<DepartmentListPage />} />
            <Route path="/departments/new" element={<DepartmentCreatePage />} />
            <Route path="/departments/:id/edit" element={<DepartmentEditPage />} />
            <Route path="/loans" element={<LoanListPage />} />
            <Route path="/loans/history" element={<LoanHistoryPage />} />
            <Route path="/loans/new" element={<LoanCreatePage />} />
            <Route path="/loans/:id/return" element={<LoanReturnPage />} />
            <Route path="/loans/:id/term" element={<LoanTermPage />} />
            <Route path="/loans/:id" element={<LoanDetailPage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/new" element={<UserCreatePage />} />
            <Route path="/users/:id/edit" element={<UserEditPage />} />
            {/* <Route path="/inventory" element={<PlaceholderPage title="Inventário" />} />
            <Route path="/maintenance" element={<PlaceholderPage title="Manutenções" />} />
            <Route path="/reports" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="/users" element={<PlaceholderPage title="Usuários" />} />
            <Route path="/settings" element={<PlaceholderPage title="Configurações" />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

