// src/pages/Register.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthStore";
import "../styles/pages/register.css";
import pdfParse from "pdf-parse";

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
    pretensaoSalarial: Yup.string(),
    consentimento: Yup.boolean().oneOf([true], "Você deve aceitar os termos"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Limpa formatação do CPF
      const cpfLimpo = values.cpf.replace(/\D/g, "");

      if (curriculo) {
        const arrayBuffer = await curriculo.arrayBuffer();
        const pdfData = await pdfParse(arrayBuffer);
        const textoExtraido = pdfData.text.substring(0, 500); // limite para preview
        novoUsuario.curriculoTexto = textoExtraido;
        console.log("Texto extraído do currículo:", textoExtraido);
      }

      // Mock de criação de usuário (depois será POST /usuarios + upload currículo)
      const novoUsuario = {
        id: Date.now(), // ID temporário
        nome: values.nome,
        email: values.email,
        role: "Candidato",
        cpf: cpfLimpo,
        telefone: values.telefone,
        pretensaoSalarial: values.pretensaoSalarial,
        curriculo: curriculo ? curriculo.name : null,
      };

      console.log("Candidato cadastrado:", novoUsuario);
      if (curriculo) console.log("Currículo recebido:", curriculo.name);

      toast.success("Conta criada com sucesso! Bem-vindo ao NEXUM.");

      // Faz login automático após cadastro
      login(novoUsuario, "fake-token-candidato");

      // Redireciona para dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      toast.error("Erro ao criar conta. Tente novamente.");
      console.error(err);
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
                    <Field name="pretensaoSalarial" placeholder="R$ 5.000,00" />
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
