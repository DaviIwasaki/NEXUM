// src/pages/AdminUserCreate.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/pages/register.css";

export default function AdminUserCreate() {
  const navigate = useNavigate();
  const [senhaGerada, setSenhaGerada] = useState("");

  const initialValues = {
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: "",
    role: "RH",
    senha: "",
    cargo: "",
    departamento: "",
    salario_inicial: "",
    data_admissao: "",
  };

  const validationSchema = Yup.object({
    nome: Yup.string().required("Nome completo obrigatório"),
    email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
    cpf: Yup.string()
      .test("cpf-valido", "CPF inválido", (value) =>
        value ? require("cpf-cnpj-validator").cpf.isValid(value.replace(/\D/g, "")) : false
      )
      .required("CPF obrigatório"),
    telefone: Yup.string(),
    endereco: Yup.string().required("Endereço completo obrigatório"),
    role: Yup.string()
      .oneOf(["RH", "GESTOR", "ADMIN", "AUDITOR", "COLABORADOR"], "Role inválido")
      .required("Role obrigatório"),
    senha: Yup.string().min(8, "Mínimo 8 caracteres").required("Senha inicial obrigatória"),

    // Condicionais para COLABORADOR
    cargo: Yup.string().when("role", {
      is: "COLABORADOR",
      then: (schema) => schema.required("Cargo obrigatório para Colaborador"),
    }),
    departamento: Yup.string().when("role", {
      is: "COLABORADOR",
      then: (schema) => schema.required("Departamento obrigatório para Colaborador"),
    }),
    salario_inicial: Yup.string().when("role", {
      is: "COLABORADOR",
      then: (schema) => schema.required("Salário inicial obrigatório para Colaborador"),
    }),
    data_admissao: Yup.date()
      .nullable()
      .when("role", {
        is: "COLABORADOR",
        then: (schema) => schema.required("Data de admissão obrigatória para Colaborador"),
      }),
  });

  const gerarSenhaAleatoria = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let senha = "";
    for (let i = 0; i < 12; i++) {
      senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSenhaGerada(senha);
    return senha;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = { ...values };
      if (senhaGerada) payload.senha = senhaGerada;

      if (values.role !== "COLABORADOR") {
        delete payload.cargo;
        delete payload.departamento;
        delete payload.salario_inicial;
        delete payload.data_admissao;
      }

      const response = await fetch("http://localhost:8000/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("nexum_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao criar usuário");
      }

      toast.success("Usuário criado com sucesso!");
      resetForm();
      setSenhaGerada("");
      navigate("/config/usuarios");
    } catch (err) {
      console.error("[AdminUserCreate] Erro:", err);
      toast.error(err.message || "Falha ao criar usuário. Verifique os dados.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="no-sidebar">
      <main className="register-page">
        <div className="register-container">
          <div className="register-header">
            <div className="logo-placeholder">NEXUM</div>
            <h1>Criar Usuário Interno</h1>
            <p>Preencha os dados para cadastrar RH, Gestor, Auditor, Admin ou Colaborador</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="register-form">
                <section>
                  <h3>Dados de Acesso</h3>
                  <div className="form-group">
                    <label>E-mail *</label>
                    <Field name="email" type="email" placeholder="seu@email.com" />
                    <ErrorMessage name="email" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Senha Inicial *</label>
                    <div className="senha-group">
                      <Field name="senha" type="password" placeholder="Senha inicial" />
                      <button
                        type="button"
                        className="btn-gerar-senha"
                        onClick={() => {
                          const novaSenha = gerarSenhaAleatoria();
                          setFieldValue("senha", novaSenha);
                        }}
                        disabled={isSubmitting}
                      >
                        Gerar Aleatória
                      </button>
                    </div>
                    <ErrorMessage name="senha" component="span" className="error" />
                    {senhaGerada && (
                      <small className="senha-gerada">
                        Senha gerada: <strong>{senhaGerada}</strong> (copie e informe ao usuário)
                      </small>
                    )}
                  </div>
                </section>

                <section>
                  <h3>Dados Pessoais</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome Completo *</label>
                      <Field name="nome" placeholder="Nome completo" />
                      <ErrorMessage name="nome" component="span" className="error" />
                    </div>

                    <div className="form-group">
                      <label>CPF *</label>
                      <Field
                        name="cpf"
                        placeholder="999.999.999-99"
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/(\d{3})(\d)/, "$1.$2");
                          value = value.replace(/(\d{3})(\d)/, "$1.$2");
                          value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                          setFieldValue("cpf", value);
                        }}
                      />
                      <ErrorMessage name="cpf" component="span" className="error" />
                    </div>

                    <div className="form-group">
                      <label>Telefone</label>
                      <Field
                        name="telefone"
                        placeholder="(99) 99999-9999"
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
                          value = value.replace(/(\d{5})(\d)/, "$1-$2");
                          setFieldValue("telefone", value);
                        }}
                      />
                      <ErrorMessage name="telefone" component="span" className="error" />
                    </div>

                    <div className="form-group full-width">
                      <label>Endereço Completo *</label>
                      <Field
                        name="endereco"
                        placeholder="Ex: Rua das Flores, 123 - Apto 45 - Bairro Centro - Belo Horizonte/MG - CEP 30123-456"
                      />
                      <ErrorMessage name="endereco" component="span" className="error" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3>Role e Contratação</h3>
                  <div className="form-group">
                    <label>Role *</label>
                    <Field as="select" name="role">
                      <option value="RH">RH</option>
                      <option value="GESTOR">GESTOR</option>
                      <option value="AUDITOR">AUDITOR</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="COLABORADOR">COLABORADOR</option>
                    </Field>
                    <ErrorMessage name="role" component="span" className="error" />
                  </div>

                  {values.role === "COLABORADOR" && (
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Cargo *</label>
                        <Field name="cargo" placeholder="Ex: Analista de Sistemas" />
                        <ErrorMessage name="cargo" component="span" className="error" />
                      </div>

                      <div className="form-group">
                        <label>Departamento *</label>
                        <Field name="departamento" placeholder="Ex: Tecnologia" />
                        <ErrorMessage name="departamento" component="span" className="error" />
                      </div>

                      <div className="form-group">
                        <label>Salário Inicial *</label>
                        <Field name="salario_inicial" placeholder="R$ 4.000,00" />
                        <ErrorMessage name="salario_inicial" component="span" className="error" />
                      </div>

                      <div className="form-group">
                        <label>Data de Admissão *</label>
                        <Field name="data_admissao" type="date" />
                        <ErrorMessage name="data_admissao" component="span" className="error" />
                      </div>
                    </div>
                  )}
                </section>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => navigate("/config/usuarios")}
                    disabled={isSubmitting}
                  >
                    Voltar
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Criando..." : "Criar Usuário"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </div>
  );
}