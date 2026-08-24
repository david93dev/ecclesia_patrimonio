import { useEffect, useState } from "react";
import { FiArchive, FiEye, FiPlus, FiXCircle } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { listPatrimonios } from "../../services/patrimonioService";

export const PatrimonioListPage = () => {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, items: [], error: "" });

  useEffect(() => {
    listPatrimonios()
      .then((items) => setState({ loading: false, items, error: "" }))
      .catch((error) => setState({ loading: false, items: [], error: error.message }));
  }, []);

  return (
    <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] font-bold text-brand-700">GESTÃO PATRIMONIAL</span>
          <h2 className="mt-1 font-[Manrope] text-2xl font-bold">Patrimônios</h2>
          <p className="mt-1 text-sm text-muted">Consulte e cadastre os bens da instituição.</p>
        </div>
        <Link to="/patrimonios/novo" className="flex h-10 w-fit items-center gap-2 rounded-xl bg-brand-700 px-4 text-xs font-semibold text-white shadow-primary hover:bg-brand-900">
          <FiPlus /> Novo patrimônio
        </Link>
      </div>

      {location.state?.success && (
        <div role="status" className="mb-5 rounded-xl border border-success/20 bg-success-soft p-4 text-sm font-medium text-success">
          {location.state.success}
        </div>
      )}

      {state.loading && <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">Carregando patrimônios...</div>}
      {state.error && <div className="rounded-2xl border border-danger/20 bg-danger-soft p-8 text-center"><FiXCircle className="mx-auto text-danger" size={28} /><p className="mt-2 text-sm text-danger">{state.error}</p></div>}
      {!state.loading && !state.error && state.items.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
          <FiArchive className="mx-auto text-muted-faint" size={32} />
          <h3 className="mt-3 font-bold">Nenhum patrimônio cadastrado</h3>
          <p className="mt-1 text-sm text-muted">Comece adicionando o primeiro item.</p>
        </div>
      )}
      {state.items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_120px_44px] gap-4 border-b border-border bg-surface-subtle px-5 py-3 text-[11px] font-bold text-muted md:grid">
            <span>ITEM</span><span>DEPARTAMENTO</span><span>CATEGORIA</span><span>STATUS</span><span />
          </div>
          {state.items.map((item) => (
            <div key={item.id} className="grid gap-2 border-b border-border-row p-5 last:border-0 md:grid-cols-[1.4fr_1fr_1fr_120px_44px] md:items-center md:gap-4">
              <div><strong className="block text-sm">{item.nome}</strong><small className="text-muted">{item.codigoPatrimonial}</small></div>
              <span className="text-sm text-muted">{item.departamento}</span>
              <span className="text-sm text-muted">{item.categoria}</span>
              <span className="w-fit rounded-full bg-success-soft px-2.5 py-1 text-[10px] font-bold text-success">{item.status}</span>
              <Link aria-label={`Visualizar ${item.nome}`} to={`/patrimonios/${item.id}`} className="grid size-9 place-items-center rounded-lg border border-border text-muted hover:text-brand-700"><FiEye /></Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
