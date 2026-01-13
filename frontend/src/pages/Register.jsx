// src/pages/Register.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import "../styles/pages/register.css";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Register() {
  const [curriculo, setCurriculo] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = {
    email: "",
    senha: "",
    confirmarSenha: "",
    nome: "",
    cpf: "",
    telefone: "",
    endereco: "", // NOVO: Endereço completo
    pretensaoSalarial: "",
    consentimento: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("E-mail inválido").required("E-mail obrigatório"),
    senha: Yup.string()
      .min(8, "Mínimo 8 caracteres")
      .required("Senha obrigatória"),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref("senha")], "As senhas não conferem")
      .required("Confirmação obrigatória"),
    nome: Yup.string().required("Nome completo obrigatório"),
    cpf: Yup.string()
      .test("cpf-valido", "CPF inválido", (value) =>
        value ? cpfValidator.isValid(value.replace(/\D/g, "")) : false
      )
      .required("CPF obrigatório"),
    telefone: Yup.string().required("Telefone obrigatório"),
    endereco: Yup.string().required("Endereço obrigatório"), // NOVO: Obrigatório
    pretensaoSalarial: Yup.string(),
    consentimento: Yup.boolean().oneOf([true], "Você deve aceitar os termos"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("[Register] Iniciando cadastro com valores:", values);

      const formData = new FormData();

      // Campos normais
      formData.append("nome", values.nome.trim());
      formData.append("email", values.email.trim().toLowerCase());
      formData.append("cpf", values.cpf.replace(/\D/g, "")); // já limpo no form
      formData.append("telefone", values.telefone || "");
      formData.append("endereco", values.endereco.trim());
      formData.append("pretensao_salarial", values.pretensaoSalarial || "");
      formData.append("senha", values.senha);
      formData.append("confirmar_senha", values.confirmarSenha);
      formData.append("consentimento_lgpd", values.consentimento);

      if (curriculo) {
        formData.append("curriculo", curriculo);
      }

      console.log("[Register] Enviando FormData para /auth/register");

      const registerResponse = await fetch(
        "http://localhost:8000/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        console.error("[Register] Erro no register:", errorData);
        throw new Error(errorData.detail || "Erro ao cadastrar");
      }

      const registerData = await registerResponse.json();
      const token = registerData.access_token;
      console.log("[Register] Token recebido:", token.substring(0, 20) + "...");

      // NOVO: Puxar usuário completo com ID via /auth/me
      console.log(
        "[Register] Buscando dados completos do usuário via /auth/me"
      );
      const meResponse = await fetch("http://localhost:8000/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!meResponse.ok) {
        const meError = await meResponse.json();
        console.error("[Register] Erro no /auth/me:", meError);
        throw new Error(meError.detail || "Erro ao carregar dados do usuário");
      }

      const userData = await meResponse.json();
      console.log("[Register] Usuário completo recebido:", userData);

      // Login com dados reais (agora inclui id!)
      login(userData, token);

      toast.success("Conta criada com sucesso! Bem-vindo ao NEXUM.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("[Register] Erro completo no submit:", err);
      toast.error(err.message || "Erro ao criar conta. Tente novamente.");
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
            <h1>Criar conta como Candidato</h1>
            <p>Preencha seus dados para começar a se candidatar</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="register-form">
                <section>
                  <h3>Dados de Acesso</h3>
                  <div className="form-group">
                    <label>E-mail *</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="error"
                    />
                  </div>

                  <div className="form-group">
                    <label>Senha *</label>
                    <Field name="senha" type="password" />
                    <ErrorMessage
                      name="senha"
                      component="span"
                      className="error"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Senha *</label>
                    <Field name="confirmarSenha" type="password" />
                    <ErrorMessage
                      name="confirmarSenha"
                      component="span"
                      className="error"
                    />
                  </div>
                </section>

                <section>
                  <h3>Dados Pessoais</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nome Completo *</label>
                      <Field name="nome" placeholder="João Silva" />
                      <ErrorMessage
                        name="nome"
                        component="span"
                        className="error"
                      />
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
                      <ErrorMessage
                        name="cpf"
                        component="span"
                        className="error"
                      />
                    </div>

                    <div className="form-group">
                      <label>Telefone *</label>
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
                      <ErrorMessage
                        name="telefone"
                        component="span"
                        className="error"
                      />
                    </div>

                    <div className="form-group">
                      <label>Pretensão Salarial (opcional)</label>
                      <Field
                        name="pretensaoSalarial"
                        placeholder="R$ 5.000,00"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Endereço Completo *</label>
                      <Field
                        name="endereco"
                        placeholder="Rua das Flores, 123 - Bairro Centro - Belo Horizonte/MG"
                      />
                      <ErrorMessage
                        name="endereco"
                        component="span"
                        className="error"
                      />
                    </div>
                  </div>
                </section>

                <section>
                  <h3>Currículo (PDF recomendado)</h3>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setCurriculo(e.target.files[0])}
                  />
                  {curriculo && (
                    <small className="file-info">
                      📄 Arquivo selecionado: {curriculo.name}
                    </small>
                  )}
                </section>

                <div className="consentimento">
                  <Field type="checkbox" name="consentimento" />
                  <label>
                    Consinto com o tratamento de dados conforme a LGPD *
                  </label>
                  <ErrorMessage
                    name="consentimento"
                    component="span"
                    className="error"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => navigate("/login")}
                    disabled={isSubmitting}
                  >
                    Voltar ao Login
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Criando conta..." : "Cadastrar"}
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
