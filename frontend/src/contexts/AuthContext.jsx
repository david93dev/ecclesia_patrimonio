import { createContext, useContext, useMemo, useState } from "react";

const SESSION_KEY = "ecclesia:session";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  });

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: ({ email }) => {
      const session = { name: "David Silva", email, role: "Administrador", permissions: ["dashboard.view"] };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      setUser(session);
    },
    logout: () => {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    },
    hasPermission: (permission) => user?.role === "Administrador" || user?.permissions?.includes(permission) === true,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// O provider e o hook vivem juntos para manter a API de autenticação coesa.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
