import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { PatrimonioForm } from "../../components/patrimonios/PatrimonioForm";
import { BackLink } from "../../components/ui/BackLink";
import { PageFeedback } from "../../components/ui/PageFeedback";
import {
  getPatrimonio,
  updatePatrimonio,
} from "../../services/patrimonioService";

export const PatrimonioEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, item: null, error: "" });

  useEffect(() => {
    getPatrimonio(id)
      .then((item) => setState({ loading: false, item, error: "" }))
      .catch((error) =>
        setState({ loading: false, item: null, error: error.message }),
      );
  }, [id]);

  const submit = async (values) => {
    await updatePatrimonio(id, values);
    navigate(`/patrimonios/${id}`, {
      replace: true,
      state: { success: "Patrimônio atualizado com sucesso." },
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <BackLink to={`/patrimonios/${id}`} className="mb-5">
        Voltar aos detalhes
      </BackLink>
      <PageHeader
        eyebrow="GESTÃO PATRIMONIAL"
        title="Editar patrimônio"
        description="Atualize as informações do item selecionado."
      />
      <PageFeedback
        loading={state.loading}
        loadingMessage="Carregando patrimônio..."
        error={state.error}
        empty={!state.item}
        emptyTitle="Patrimônio não encontrado"
      />
      {!state.loading && !state.error && state.item && (
        <PatrimonioForm
          initialValues={state.item}
          onSubmit={submit}
          submitLabel="Salvar alterações"
          loadingLabel="Salvando..."
          requireChanges
        />
      )}
    </div>
  );
};
