import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const SidebarUser = ({ collapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="p-3">
      <div
        className={`flex h-11 items-center rounded-xl border border-white/7 bg-white/4 ${collapsed ? "justify-center" : "gap-3 px-2"}`}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-linear-to-br from-brand-500 to-brand-900 text-xs font-bold text-white shadow-avatar">
          {user?.name?.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "US"}
        </span>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-xs font-semibold text-white">
                {user?.name || "Usuário"}
              </strong>
              <small className="block truncate text-[9px] tracking-wide text-sidebar-profile uppercase">
                {user?.role || "Sem perfil"}
              </small>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sair"
              title="Sair"
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-sidebar-profile hover:bg-white/8 hover:text-white"
            >
              <FiLogOut size={17} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
import { FiLogOut } from "react-icons/fi";
