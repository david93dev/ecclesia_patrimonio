import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { DepartmentForm } from "../../components/departments/DepartmentForm";
import { BackLink } from "../../components/ui/BackLink";
import { PageFeedback } from "../../components/ui/PageFeedback";
import { useAuth } from "../../contexts/AuthContext";
import { createDepartment } from "../../services/departmentService";

export const DepartmentCreatePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrador";
  const submit = async (values) => {
    await createDepartment(values, user);
    navigate("/departments", {
      replace: true,
      state: { success: "Departamento cadastrado com sucesso." },
    });
  };
  return (
    <div className="mx-auto max-w-5xl p-5 sm:p-8 lg:p-10">
      <BackLink to="/departments" className="mb-5">
        Voltar à listagem
      </BackLink>
      <PageHeader
        eyebrow="GESTÃO ORGANIZACIONAL"
        title="Cadastrar departamento"
        description="Registre um novo setor e seu líder responsável."
      />
      {isAdmin ? (
        <DepartmentForm onSubmit={submit} />
      ) : (
        <PageFeedback error="Apenas administradores podem cadastrar departamentos." />
      )}
    </div>
  );
};
