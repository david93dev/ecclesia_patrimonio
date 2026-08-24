import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export const BackLink = ({ to, children = "Voltar", className = "" }) => (
  <Link
    to={to}
    className={`flex w-fit items-center gap-2 text-xs font-bold text-brand-700 transition hover:text-brand-900 ${className}`}
  >
    <FiArrowLeft size={15} aria-hidden="true" />
    {children}
  </Link>
);
