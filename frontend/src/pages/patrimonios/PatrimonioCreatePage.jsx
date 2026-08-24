import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { PatrimonioForm } from "../../components/patrimonios/PatrimonioForm";
import { BackLink } from "../../components/ui/BackLink";
import { createPatrimonio } from "../../services/patrimonioService";

export const PatrimonioCreatePage = () => {
  const navigate = useNavigate();
  const submit = async (values) => {
    await createPatrimonio(values);
    navigate("/patrimonios", {
      replace: true,
      state: { success: "Patrimônio cadastrado com sucesso." },
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <BackLink to="/patrimonios" className="mb-5">
        Voltar à listagem
      </BackLink>
      <PageHeader
        eyebrow="GESTÃO PATRIMONIAL"
        title="Cadastrar patrimônio"
        description="Preencha os dados para registrar um novo item."
      />
      <PatrimonioForm
        onSubmit={submit}
        submitLabel="Cadastrar patrimônio"
        loadingLabel="Cadastrando..."
      />
    </div>
  );
};
