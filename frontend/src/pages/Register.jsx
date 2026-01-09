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
      // Limpa formatação do CPF
      const cpfLimpo = values.cpf.replace(/\D/g, "");

      let textoExtraido = null;
      if (curriculo) {
        try {
          const arrayBuffer = await curriculo.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => item.str)
              .join(" ");
            fullText += pageText + " ";
          }
          textoExtraido = fullText.substring(0, 1000); // limite para preview
          console.log("Texto extraído do currículo:", textoExtraido);
        } catch (err) {
          console.error("Erro ao extrair texto do PDF:", err);
          toast.warning(
            "Não foi possível ler o currículo. Cadastro continua sem preview."
          );
        }
      }

      // Mock de criação de usuário
      const novoUsuario = {
        id: Date.now(), // ID temporário
        nome: values.nome,
        email: values.email,
        role: "Candidato",
        cpf: cpfLimpo,
        telefone: values.telefone,
        endereco: values.endereco, // NOVO: Salva endereço
        pretensaoSalarial: values.pretensaoSalarial,
        curriculo: curriculo ? curriculo.name : null,
        curriculoTexto: textoExtraido,
      };

      console.log("Candidato cadastrado:", novoUsuario);
      if (curriculo) console.log("Currículo recebido:", curriculo.name);

      toast.success("Conta criada com sucesso! Bem-vindo ao NEXUM.");

      // Login automático
      login(novoUsuario, "fake-token-candidato");

      // Redireciona
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
