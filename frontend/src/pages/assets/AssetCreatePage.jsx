import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { AssetForm } from "../../components/assets/AssetForm";
import { BackLink } from "../../components/ui/BackLink";
import { createAsset } from "../../services/assetService";

export const AssetCreatePage = () => {
  const navigate = useNavigate();
  const submit = async (values) => {
    await createAsset(values);
    navigate("/assets", {
      replace: true,
      state: { success: "Patrimônio cadastrado com sucesso." },
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <BackLink to="/assets" className="mb-5">
        Voltar à listagem
      </BackLink>
      <PageHeader
        eyebrow="GESTÃO PATRIMONIAL"
        title="Cadastrar patrimônio"
        description="Preencha os dados para registrar um novo item."
      />
      <AssetForm
        onSubmit={submit}
        submitLabel="Cadastrar patrimônio"
        loadingLabel="Cadastrando..."
      />
    </div>
  );
};

