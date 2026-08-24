/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import {
  FiArchive,
  FiBox,
  FiClock,
  FiGift,
  FiRefreshCw,
  FiRepeat,
  FiShield,
  FiSliders,
  FiXCircle,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardData } from "../../services/dashboardService";
import { IndicatorCard } from "../../components/dashboard/IndicatorCard";
import { IndicatorCardSkeleton } from "../../components/dashboard/IndicatorCardSkeleton";
import { SummaryCard } from "../../components/dashboard/SummaryCard";
import { Button } from "../../components/ui/Button";

const indicators = [
  [
    "totalAssets",
    "Patrimônios",
    "Total cadastrado",
    FiArchive,
    "bg-brand-100 text-brand-700",
  ],
  [
    "availableAssets",
    "Disponíveis",
    "Prontos para uso",
    FiBox,
    "bg-success-soft text-success",
  ],
  [
    "loanedAssets",
    "Em empréstimo",
    "Patrimônios cedidos",
    FiRepeat,
    "bg-warning-soft text-warning",
  ],
  [
    "usufructAssets",
    "Em usufruto",
    "Com direito de uso",
    FiShield,
    "bg-brand-100 text-brand-700",
  ],
  [
    "totalDonations",
    "Doações",
    "Total recebido",
    FiGift,
    "bg-danger-soft text-danger",
  ],
  [
    "activeLoans",
    "Empréstimos ativos",
    "Contratos em andamento",
    FiClock,
    "bg-warning-soft text-warning-icon",
  ],
  [
    "activeUsufructs",
    "Usufrutos ativos",
    "Termos em andamento",
    FiSliders,
    "bg-success-soft text-success",
  ],
];

export const DashboardPage = () => {
  const { user, hasPermission } = useAuth();
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  const load = useCallback(async (signal, showLoading = true) => {
    if (showLoading)
      setState((current) => ({ ...current, status: "loading", error: null }));
    try {
      const data = await getDashboardData({ signal });
      setState({
        status: Object.keys(data.indicators ?? {}).length ? "success" : "empty",
        data,
        error: null,
      });
    } catch (error) {
      if (error.name !== "AbortError")
        setState({ status: "error", data: null, error: error.message });
    }
  }, []);

  // Consulta inicial sincronizada com a montagem; as atualizações de estado ocorrem após a resposta assíncrona.
   
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal, false);
    return () => controller.abort();
  }, [load]);

  if (!hasPermission("dashboard.view"))
    return (
      <div className="mx-auto max-w-375 p-6 sm:p-10">
        <section className="rounded-2xl border border-danger/20 bg-danger-soft p-8 text-center">
          <FiShield className="mx-auto text-danger" size={28} />
          <h2 className="mt-3 font-bold">Acesso não autorizado</h2>
          <p className="mt-1 text-sm text-muted">
            Seu perfil não possui permissão para visualizar os indicadores.
          </p>
        </section>
      </div>
    );

  const updatedAt =
    state.data?.updatedAt &&
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(state.data.updatedAt));
  return (
    <div className="mx-auto max-w-375 p-5 sm:p-8 lg:p-10">
      <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-[11px] font-semibold text-brand-700">
            DASHBOARD GERAL
          </span>
          <h2 className="mt-1 font-[Manrope] text-2xl font-bold tracking-[-.8px] sm:text-[28px]">
            Olá, {user?.name?.split(" ")[0] ?? "usuário"}.
          </h2>
          <p className="mt-2 text-xs text-muted">
            Visão consolidada do patrimônio, empréstimos e usufrutos.
          </p>
          {updatedAt && (
            <p className="mt-1 text-[10px] text-muted-faint">
              Atualizado em {updatedAt}
            </p>
          )}
        </div>
        <Button
          onClick={() => load()}
          Icon={FiRefreshCw}
          iconAnimation="rotate"
          loading={state.status === "loading"}
          loadingLabel="Atualizando..."
        >
          Atualizar dados
        </Button>
      </section>
      {state.status === "loading" && (
        <section
          aria-label="Carregando indicadores"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {Array.from({ length: 7 }, (_, index) => (
            <IndicatorCardSkeleton key={index} />
          ))}
        </section>
      )}
      {state.status === "error" && (
        <section className="rounded-2xl border border-danger/20 bg-danger-soft p-8 text-center">
          <FiXCircle className="mx-auto text-danger" size={30} />
          <h3 className="mt-3 font-bold">Falha ao carregar o dashboard</h3>
          <p className="mt-1 text-sm text-muted">{state.error}</p>
          <button
            onClick={() => load()}
            className="mt-4 cursor-pointer text-xs font-bold text-danger"
          >
            Tentar novamente
          </button>
        </section>
      )}
      {state.status === "empty" && (
        <section className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
          <FiArchive className="mx-auto text-muted-faint" size={30} />
          <h3 className="mt-3 font-bold">Nenhum dado encontrado</h3>
          <p className="mt-1 text-sm text-muted">
            Cadastre patrimônios, empréstimos ou usufrutos para visualizar os
            indicadores.
          </p>
        </section>
      )}
      {state.status === "success" && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {indicators.map(([key, label, detail, Icon, tone]) => (
              <IndicatorCard
                key={key}
                label={label}
                detail={detail}
                Icon={Icon}
                tone={tone}
                value={state.data.indicators[key]}
              />
            ))}
          </section>
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <SummaryCard
              title="Resumo de empréstimos"
              description="Situação atual dos contratos"
              Icon={FiRepeat}
              tone="warning"
              values={[
                { label: "Ativos", value: state.data.loans.active },
                { label: "Em atraso", value: state.data.loans.overdue },
                { label: "Vencem em breve", value: state.data.loans.dueSoon },
              ]}
            />
            <SummaryCard
              title="Resumo de usufrutos"
              description="Situação atual dos termos"
              Icon={FiShield}
              tone="success"
              values={[
                { label: "Ativos", value: state.data.usufructs.active },
                {
                  label: "Encerram em breve",
                  value: state.data.usufructs.endingSoon,
                },
                { label: "Permanentes", value: state.data.usufructs.permanent },
              ]}
            />
          </section>
        </>
      )}
    </div>
  );
};
