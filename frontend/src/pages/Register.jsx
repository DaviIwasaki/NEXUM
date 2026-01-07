import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { toast } from 'react-toastify';
import '../styles/pages/register.css';

export default function Register() {
  const [curriculo, setCurriculo] = useState(null);

  const initialValues = {
    email: '',
    senha: '',
    confirmarSenha: '',
    nome: '',
    cpf: '',
    telefone: '',
    pretensaoSalarial: '',
    consentimento: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('E-mail inválido').required('Obrigatório'),
    senha: Yup.string().min(8, 'Mínimo 8 caracteres').required('Obrigatório'),
    confirmarSenha: Yup.string()
      .oneOf([Yup.ref('senha')], 'Senhas não conferem')
      .required('Obrigatório'),
    nome: Yup.string().required('Obrigatório'),
    cpf: Yup.string()
      .test('cpf-valido', 'CPF inválido', (value) =>
        value ? cpfValidator.isValid(value) : false
      )
      .required('Obrigatório'),
    telefone: Yup.string().required('Obrigatório'),
    consentimento: Yup.boolean().oneOf(
      [true],
      'É necessário aceitar o consentimento'
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log({ ...values, curriculo });

      // 🔥 backend ainda não existe
      toast.success('Conta criada com sucesso! Faça login.');

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      toast.error('Erro ao criar conta');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="no-sidebar">

      <main className="register-page">
        <div className="register-container">
          <div className="register-header">
            <div className="logo-placeholder">LOGO</div>
            <h1>Criar conta</h1>
            <p>Cadastre-se para se candidatar às vagas</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="register-form">
                <section>
                  <h3>Dados Pessoais</h3>

                  <div className="form-group">
                    <label>E-mail</label>
                    <Field name="email" type="email" />
                    <ErrorMessage name="email" component="span" />
                  </div>

                  <div className="form-group">
                    <label>Senha</label>
                    <Field name="senha" type="password" />
                    <ErrorMessage name="senha" component="span" />
                  </div>

                  <div className="form-group">
                    <label>Confirmar Senha</label>
                    <Field name="confirmarSenha" type="password" />
                    <ErrorMessage name="confirmarSenha" component="span" />
                  </div>

                  <div className="form-group">
                    <label>Nome Completo</label>
                    <Field name="nome" />
                    <ErrorMessage name="nome" component="span" />
                  </div>

                  <div className="form-group">
                    <label>CPF</label>
                    <Field name="cpf" placeholder="999.999.999-99" />
                    <ErrorMessage name="cpf" component="span" />
                  </div>

                  <div className="form-group">
                    <label>Telefone</label>
                    <Field name="telefone" placeholder="(99) 99999-9999" />
                    <ErrorMessage name="telefone" component="span" />
                  </div>

                  <div className="form-group">
                    <label>Pretensão Salarial</label>
                    <Field name="pretensaoSalarial" placeholder="R$ 0,00" />
                  </div>
                </section>

                <section>
                  <h3>Currículo</h3>

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCurriculo(e.target.files[0])}
                  />

                  {curriculo && (
                    <small>Arquivo selecionado: {curriculo.name}</small>
                  )}
                </section>

                <div className="consentimento">
                  <Field type="checkbox" name="consentimento" />
                  <label>
                    Consinto com o tratamento de dados conforme a LGPD
                  </label>
                </div>
                <ErrorMessage name="consentimento" component="span" />

                <button type="submit" disabled={isSubmitting}>
                  Cadastrar
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </div>
  );
}
