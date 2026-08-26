import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { DepartmentForm } from "../../components/departments/DepartmentForm";
import { BackLink } from "../../components/ui/BackLink";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import {
  getDepartment,
  updateDepartment,
} from "../../services/departmentService";

export const DepartmentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, item: null, error: "" });
  useEffect(() => {
    getDepartment(id)
      .then((item) =>
        setState({
          loading: false,
          item,
          error: item ? "" : "Departamento não encontrado.",
        }),
      )
      .catch((error) =>
        setState({ loading: false, item: null, error: error.message }),
      );
  }, [id]);
  const submit = async (values) => {
    await updateDepartment(id, values, user);
    navigate("/departments", {
      replace: true,
      state: { success: "Departamento atualizado com sucesso." },
    });
  };
  const isAdmin = user?.role === "Administrador";
  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <BackLink to="/departments" className="mb-5">
        Voltar à listagem
      </BackLink>
      <PageHeader
        eyebrow="GESTÃO ORGANIZACIONAL"
        title="Editar departamento"
        description="Atualize os dados do setor selecionado."
      />
      <PageFeedback
        loading={state.loading}
        loadingMessage="Carregando departamento..."
        error={
          state.error ||
          (!isAdmin && "Apenas administradores podem editar departamentos.")
        }
      />
      {isAdmin && !state.loading && !state.error && state.item && (
        <DepartmentForm initialValues={state.item} onSubmit={submit} editing />
      )}
    </div>
  );
};
