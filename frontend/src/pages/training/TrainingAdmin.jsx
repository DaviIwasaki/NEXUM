// src/pages/training/TrainingAdmin.jsx
import React, { useState } from "react";
import { useAuth } from "../../store/AuthStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "../../styles/pages/training/trainingAdmin.css";

const mockCursosCadastrados = [
  {
    id: 1,
    nome: "React Avançado com Hooks e Context",
    descricao: "Aprofunde-se em padrões modernos de React para aplicações escaláveis.",
    duracao: "40 horas",
    obrigatorio: true,
    validade: "Ilimitado",
    categoria: "Desenvolvimento Frontend",
  },
  {
    id: 2,
    nome: "LGPD na Prática",
    descricao: "Entenda obrigações legais e como proteger dados na empresa.",
    duracao: "8 horas",
    obrigatorio: true,
    validade: "1 ano",
    categoria: "Compliance",
  },
];

export default function TrainingAdmin() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState(mockCursosCadastrados);
  const [mostrarForm, setMostrarForm] = useState(false);

  const initialValues = {
    nome: "",
    descricao: "",
    duracao: "",
    categoria: "",
    obrigatorio: false,
    validade: "",
  };

  const validationSchema = Yup.object({
    nome: Yup.string().required("Nome obrigatório"),
    descricao: Yup.string().required("Descrição obrigatória"),
    duracao: Yup.string().required("Duração obrigatória"),
    categoria: Yup.string().required("Categoria obrigatória"),
    validade: Yup.string().required("Validade obrigatória"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const novoCurso = {
      id: cursos.length + 1,
      ...values,
    };

    setCursos([...cursos, novoCurso]);
    console.log("Novo curso cadastrado por:", user?.nome, novoCurso);

    toast.success(`Curso "${values.nome}" cadastrado com sucesso!`);

    resetForm();
    setMostrarForm(false);
    setSubmitting(false);
  };

  return (
    <main className="training-admin-container">
      <div className="admin-header">
        <h1>Administração de Treinamento & Desenvolvimento</h1>
        <p>RH: {user?.nome}</p>
        <button className="btn-new" onClick={() => setMostrarForm(true)}>
          + Cadastrar Novo Curso
        </button>
      </div>

      {mostrarForm && (
        <div className="new-course-form">
          <h2>Cadastrar Novo Curso</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome do Curso *</label>
                    <Field name="nome" placeholder="Ex: Liderança e Gestão de Equipes" />
                    <ErrorMessage name="nome" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Categoria *</label>
                    <Field as="select" name="categoria">
                      <option value="">Selecione</option>
                      <option value="Desenvolvimento Frontend">Desenvolvimento Frontend</option>
                      <option value="Liderança">Liderança</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Saúde e Segurança">Saúde e Segurança</option>
                      <option value="Idiomas">Idiomas</option>
                      <option value="Outro">Outro</option>
                    </Field>
                    <ErrorMessage name="categoria" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Duração *</label>
                    <Field name="duracao" placeholder="Ex: 20 horas" />
                    <ErrorMessage name="duracao" component="span" className="error" />
                  </div>

                  <div className="form-group checkbox">
                    <Field type="checkbox" name="obrigatorio" />
                    <label>Curso obrigatório</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrição do Conteúdo *</label>
                  <Field as="textarea" name="descricao" rows="5" placeholder="Descreva os tópicos abordados, objetivos de aprendizagem..." />
                  <ErrorMessage name="descricao" component="span" className="error" />
                </div>

                <div className="form-group">
                  <label>Validade do Certificado *</label>
                  <Field name="validade" placeholder="Ex: Ilimitado, 1 ano, 2 anos" />
                  <ErrorMessage name="validade" component="span" className="error" />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setMostrarForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Curso"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <h2>Cursos Cadastrados</h2>
      <table className="training-admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Duração</th>
            <th>Obrigatório</th>
            <th>Validade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td><strong>{curso.nome}</strong></td>
              <td>{curso.categoria}</td>
              <td>{curso.duracao}</td>
              <td>{curso.obrigatorio ? "Sim" : "Não"}</td>
              <td>{curso.validade}</td>
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