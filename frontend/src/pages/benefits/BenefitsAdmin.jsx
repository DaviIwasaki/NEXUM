// src/pages/benefits/BenefitsAdmin.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const mockBeneficiosCadastrados = [
  {
    id: 1,
    nome: "Plano de Saúde",
    custoEmpresa: "R$ 600,00",
    custoColaborador: "R$ 200,00",
    permiteDependentes: true,
    regras: "Cobertura nacional, inclui odontológico. Dependentes até 2º grau.",
  },
  {
    id: 2,
    nome: "Vale Refeição",
    custoEmpresa: "R$ 40,00/dia",
    custoColaborador: "R$ 0,00",
    permiteDependentes: false,
    regras: "Crédito diário em cartão Sodexo. Sem possibilidade de dependentes.",
  },
];

export default function BenefitsAdmin() {
  const { user } = useAuth();
  const [beneficios, setBeneficios] = useState(mockBeneficiosCadastrados);
  const [mostrarForm, setMostrarForm] = useState(false);

  const initialValues = {
    nome: "",
    custoEmpresa: "",
    custoColaborador: "",
    permiteDependentes: false,
    regras: "",
  };

  const validationSchema = Yup.object({
    nome: Yup.string().required("Nome obrigatório"),
    custoEmpresa: Yup.string().required("Custo empresa obrigatório"),
    custoColaborador: Yup.string().required("Custo colaborador obrigatório"),
    regras: Yup.string().required("Regras obrigatórias"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const novoBeneficio = {
      id: beneficios.length + 1,
      ...values,
    };

    setBeneficios([...beneficios, novoBeneficio]);
    console.log("Novo benefício cadastrado por:", user?.nome, novoBeneficio);

    toast.success(`Benefício "${values.nome}" cadastrado com sucesso!`);

    resetForm();
    setMostrarForm(false);
    setSubmitting(false);
  };

  return (
    <main className="benefits-admin-container">
      <div className="admin-header">
        <h1>Administração de Benefícios</h1>
        <p>RH: {user?.nome}</p>
        <button className="btn-new" onClick={() => setMostrarForm(true)}>
          + Novo Benefício
        </button>
      </div>

      {mostrarForm && (
        <div className="new-benefit-form">
          <h2>Cadastrar Novo Benefício</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome do Benefício *</label>
                    <Field name="nome" placeholder="Ex: Plano de Saúde Premium" />
                    <ErrorMessage name="nome" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Custo Mensal Empresa *</label>
                    <Field name="custoEmpresa" placeholder="R$ 600,00" />
                    <ErrorMessage name="custoEmpresa" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Custo Mensal Colaborador *</label>
                    <Field name="custoColaborador" placeholder="R$ 200,00" />
                    <ErrorMessage name="custoColaborador" component="span" className="error" />
                  </div>

                  <div className="form-group checkbox">
                    <Field type="checkbox" name="permiteDependentes" />
                    <label>Permite inclusão de dependentes</label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Regras e Descrição *</label>
                  <Field as="textarea" name="regras" rows="5" placeholder="Descreva cobertura, condições, limitações..." />
                  <ErrorMessage name="regras" component="span" className="error" />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setMostrarForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Benefício"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <h2>Benefícios Cadastrados</h2>
      <table className="benefits-admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Custo Empresa</th>
            <th>Custo Colaborador</th>
            <th>Dependentes</th>
            <th>Regras</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {beneficios.map((beneficio) => (
            <tr key={beneficio.id}>
              <td><strong>{beneficio.nome}</strong></td>
              <td>{beneficio.custoEmpresa}</td>
              <td>{beneficio.custoColaborador}</td>
              <td>{beneficio.permiteDependentes ? "Sim" : "Não"}</td>
              <td>{beneficio.regras.substring(0, 80)}...</td>
              <td>
                <button>Editar</button>
                <button className="btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}