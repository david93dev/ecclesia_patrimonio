import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthLogin } from "./pages/login/AuthLogin";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { SystemLayout } from "./layouts/system/SystemLayout";
import { PlaceholderPage } from "./pages/system/PlaceholderPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";


function App() {
  return (
    <BrowserRouter><AuthProvider><Routes>
      <Route element={<PublicRoute />}><Route path="/login" element={<AuthLogin />} /></Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<SystemLayout><DashboardPage /></SystemLayout>} />
        <Route path="/patrimonios" element={<SystemLayout><PlaceholderPage title="Patrimônios" /></SystemLayout>} />
        <Route path="/inventario" element={<SystemLayout><PlaceholderPage title="Inventário" /></SystemLayout>} />
        <Route path="/manutencoes" element={<SystemLayout><PlaceholderPage title="Manutenções" /></SystemLayout>} />
        <Route path="/relatorios" element={<SystemLayout><PlaceholderPage title="Relatórios" /></SystemLayout>} />
        <Route path="/usuarios" element={<SystemLayout><PlaceholderPage title="Usuários" /></SystemLayout>} />
        <Route path="/configuracoes" element={<SystemLayout><PlaceholderPage title="Configurações" /></SystemLayout>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes></AuthProvider></BrowserRouter>
  );
}

export default App;
