import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { toast } from 'react-toastify';
import '../styles/pages/company-create.css';

export default function CompanyCreate() {
  const initialValues = {
    cnpj: '',
    nome: '',
    endereco: '',
    consentimento: false,
  };

  const validationSchema = Yup.object({
    cnpj: Yup.string()
      .test('cnpj-valido', 'CNPJ inválido', (value) =>
        value ? cnpjValidator.isValid(value) : false
      )
      .required('Obrigatório'),
    nome: Yup.string().required('Obrigatório'),
    endereco: Yup.string(),
    consentimento: Yup.boolean().oneOf(
      [true],
      'Consentimento obrigatório'
    ),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log(values);

      // Backend ainda não implementado
      toast.success('Empresa cadastrada com sucesso!');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error) {
      toast.error('Erro ao cadastrar empresa');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="company-create-page">
      <div className="company-create-container">
        <header className="company-create-header">
          <h1>Cadastrar Empresa</h1>
          <p>Registre uma nova empresa no sistema</p>
        </header>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="company-create-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>CNPJ</label>
                  <Field name="cnpj" placeholder="99.999.999/9999-99" />
                  <ErrorMessage name="cnpj" component="span" />
                </div>

                <div className="form-group">
                  <label>Nome da Empresa</label>
                  <Field name="nome" />
                  <ErrorMessage name="nome" component="span" />
                </div>

                <div className="form-group full-width">
                  <label>Endereço</label>
                  <Field name="endereco" as="textarea" rows="3" />
                </div>
              </div>

              <div className="consentimento">
                <Field type="checkbox" name="consentimento" />
                <label>
                  Consinto com o tratamento de dados conforme LGPD
                </label>
              </div>
              <ErrorMessage name="consentimento" component="span" />

              <div className="actions">
                <button type="submit" disabled={isSubmitting}>
                  Cadastrar Empresa
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
