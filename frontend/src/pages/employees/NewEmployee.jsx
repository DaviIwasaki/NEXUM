// src/pages/employees/NewEmployee.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "../../styles/pages/employees/newEmployee.css";

export default function NewEmployee() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialValues = {
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    cargo: "",
    departamento: "",
    salario: "",
    dataAdmissao: "",
    dependentes: [
      { nome: "", parentesco: "", dataNascimento: "" },
    ],
  };

  const validationSchema = Yup.object({
    nome: Yup.string().required("Nome obrigatório"),
    email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
    cpf: Yup.string()
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
      .required("CPF obrigatório"),
    telefone: Yup.string().required("Telefone obrigatório"),
    cargo: Yup.string().required("Cargo obrigatório"),
    departamento: Yup.string().required("Departamento obrigatório"),
    salario: Yup.number().min(0, "Salário deve ser positivo").required("Salário obrigatório"),
    dataAdmissao: Yup.date().required("Data de admissão obrigatória"),
  });

  const addDependente = (values, setFieldValue) => {
    setFieldValue("dependentes", [
      ...values.dependentes,
      { nome: "", parentesco: "", dataNascimento: "" },
    ]);
  };

  const removeDependente = (index, values, setFieldValue) => {
    if (values.dependentes.length > 1) {
      const newDependentes = values.dependentes.filter((_, i) => i !== index);
      setFieldValue("dependentes", newDependentes);
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    // Mock criação
    console.log("Novo colaborador criado por:", user?.nome);
    console.log("Dados:", values);

    toast.success("Colaborador cadastrado com sucesso!");

    setTimeout(() => {
      navigate("/colaboradores");
    }, 1500);

    setSubmitting(false);
  };

  return (
    <main className="new-employee-container">
      <div className="form-header">
        <h1>Novo Colaborador</h1>
        <p>Preencha os dados para admitir um novo funcionário</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="new-employee-form">
            {/* Seção 1: Dados Pessoais */}
            <div className="accordion-section">
              <h2>Dados Pessoais</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <Field name="nome" placeholder="João Silva" />
                  <ErrorMessage name="nome" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>E-mail *</label>
                  <Field name="email" type="email" />
                  <ErrorMessage name="email" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>CPF *</label>
                  <Field name="cpf" placeholder="999.999.999-99" />
                  <ErrorMessage name="cpf" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>Telefone *</label>
                  <Field name="telefone" placeholder="(31) 99999-9999" />
                  <ErrorMessage name="telefone" component="span" className="error" />
                </div>
              </div>
            </div>

            {/* Seção 2: Dados do Contrato */}
            <div className="accordion-section">
              <h2>Dados do Contrato</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Cargo *</label>
                  <Field name="cargo" placeholder="Desenvolvedor Frontend" />
                  <ErrorMessage name="cargo" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>Departamento *</label>
                  <Field as="select" name="departamento">
                    <option value="">Selecione</option>
                    <option value="TI">TI</option>
                    <option value="RH">Recursos Humanos</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Produto">Produto</option>
                    <option value="Design">Design</option>
                  </Field>
                  <ErrorMessage name="departamento" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>Salário (R$) *</label>
                  <Field name="salario" type="number" min="0" step="0.01" />
                  <ErrorMessage name="salario" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>Data de Admissão *</label>
                  <Field name="dataAdmissao" type="date" />
                  <ErrorMessage name="dataAdmissao" component="span" className="error" />
                </div>
              </div>
            </div>

            {/* Seção 3: Dependentes */}
            <div className="accordion-section">
              <h2>Dependentes</h2>
              {values.dependentes.map((dep, index) => (
                <div key={index} className="dependente-group">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome do Dependente</label>
                      <Field name={`dependentes[${index}].nome`} />
                    </div>
                    <div className="form-group">
                      <label>Parentesco</label>
                      <Field as="select" name={`dependentes[${index}].parentesco`}>
                        <option value="">Selecione</option>
                        <option value="Cônjuge">Cônjuge</option>
                        <option value="Filho(a)">Filho(a)</option>
                        <option value="Outro">Outro</option>
                      </Field>
                    </div>
                    <div className="form-group">
                      <label>Data de Nascimento</label>
                      <Field name={`dependentes[${index}].dataNascimento`} type="date" />
                    </div>
                  </div>
                  {values.dependentes.length > 1 && (
                    <button
                      type="button"
                      className="remove-dependente"
                      onClick={() => removeDependente(index, values, setFieldValue)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-dependente"
                onClick={() => addDependente(values, setFieldValue)}
              >
                + Adicionar Dependente
              </button>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/colaboradores")}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Admitir Colaborador"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}