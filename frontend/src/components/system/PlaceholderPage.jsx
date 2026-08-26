import { FiArrowLeft, FiGrid } from "react-icons/fi";
import { Link } from "react-router-dom";

export const PlaceholderPage = ({ title }) => (
  <div className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-375 place-items-center p-6">
    <section className="w-full max-w-lg rounded-3xl border border-border bg-surface p-10 text-center shadow-panel">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-100 text-brand-700"><FiGrid size={24} /></span>
      <h2 className="mt-5 font-[Manrope] text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted">Esta área já faz parte das rotas privadas e está pronta para receber o seu conteúdo.</p>
      <Link to="/dashboard" className="mx-auto mt-6 flex w-fit items-center gap-2 text-xs font-bold text-brand-700"><FiArrowLeft /> Voltar ao dashboard</Link>
    </section>
  </div>
);
