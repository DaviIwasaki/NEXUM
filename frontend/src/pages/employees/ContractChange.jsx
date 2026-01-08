// src/pages/employees/ContractChange.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import Steps from "react-steps"; // npm i react-steps se não tiver
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "../../styles/pages/employees/contractChange.css";

const steps = [
  { title: "Dados do Contrato" },
  { title: "Documentos" },
  { title: "Aprovação" },
];

export default function ContractChange() {
  const { id } = useParams(); // id do colaborador
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialValues = {
    tipoAlteracao: "Admissão",
    cargo: "",
    salario: "",
    dataInicio: "",
    documentos: [],
    aprovador: "",
    observacoes: "",
  };

  const validationSchema = Yup.object({
    cargo: Yup.string().required("Cargo obrigatório"),
    salario: Yup.number().min(0).required("Salário obrigatório"),
    dataInicio: Yup.date().required("Data obrigatória"),
    aprovador: Yup.string().required("Aprovador obrigatório"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Alteração contratual para colaborador ID:", id);
    console.log("Dados:", values);

    toast.success("Alteração contratual registrada com sucesso!");

    setTimeout(() => {
      navigate(`/colaboradores/${id}`);
    }, 1500);

    setSubmitting(false);
  };

  return (
    <main className="contract-change-container">
      <h1>Alteração Contratual</h1>
      <p>Colaborador ID: {id || "Novo"}</p>

      <Steps steps={steps} current={0} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="contract-form">
            {/* Step 1: Dados do Contrato */}
            <div className="step-section">
              <h2>Dados do Contrato</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Tipo de Alteração</label>
                  <Field as="select" name="tipoAlteracao">
                    <option value="Admissão">Admissão</option>
                    <option value="Promoção">Promoção</option>
                    <option value="Transferência">Transferência</option>
                    <option value="Ajuste Salarial">Ajuste Salarial</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label>Novo Cargo *</label>
                  <Field name="cargo" />
                  <ErrorMessage name="cargo" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>Novo Salário (R$) *</label>
                  <Field name="salario" type="number" />
                  <ErrorMessage name="salario" component="span" className="error" />
                </div>
                <div className="form-group">
                  <label>Data de Início *</label>
                  <Field name="dataInicio" type="date" />
                  <ErrorMessage name="dataInicio" component="span" className="error" />
                </div>
              </div>
            </div>

            {/* Step 2: Documentos */}
            <div className="step-section">
              <h2>Documentos Necessários</h2>
              <input
                type="file"
                multiple
                onChange={(e) => setFieldValue("documentos", e.target.files)}
              />
              <p>Arquivos selecionados: {values.documentos.length}</p>
            </div>

            {/* Step 3: Aprovação */}
            <div className="step-section">
              <h2>Aprovação</h2>
              <div className="form-group">
                <label>Aprovador *</label>
                <Field as="select" name="aprovador">
                  <option value="">Selecione</option>
                  <option value="Gestor">Gestor da Área</option>
                  <option value="RH">Recursos Humanos</option>
                  <option value="Diretoria">Diretoria</option>
                </Field>
                <ErrorMessage name="aprovador" component="span" className="error" />
              </div>
              <div className="form-group">
                <label>Observações</label>
                <Field as="textarea" name="observacoes" rows="4" />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(`/colaboradores/${id}`)}
              >
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Alteração"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}