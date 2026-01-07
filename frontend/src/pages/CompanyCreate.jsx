// src/pages/CompanyCreate.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';
import '../styles/pages/company-create.css';

export default function CompanyCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialValues = {
    cnpj: '',
    nome: '',
    endereco: '',
    consentimento: false,
  };

  const validationSchema = Yup.object({
    cnpj: Yup.string()
      .test('cnpj-valido', 'CNPJ inválido', (value) =>
        value ? cnpjValidator.isValid(value.replace(/\D/g, '')) : false
      )
      .required('CNPJ obrigatório'),
    nome: Yup.string().required('Nome da empresa obrigatório'),
    endereco: Yup.string(),
    consentimento: Yup.boolean().oneOf([true], 'Consentimento obrigatório'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Limpa formatação do CNPJ
      const cleanedCnpj = values.cnpj.replace(/\D/g, '');

      // Mock de criação (depois POST /empresas)
      console.log('Empresa criada por:', user?.nome);
      console.log('Dados:', { ...values, cnpj: cleanedCnpj });

      toast.success('Empresa cadastrada com sucesso!');

      setTimeout(() => {
        navigate('/dashboard');
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
          <h1>Cadastrar Nova Empresa</h1>
          <p>Registre uma nova empresa para utilizar o sistema NEXUM</p>
        </header>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="company-create-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>CNPJ *</label>
                  <Field
                    name="cnpj"
                    placeholder="99.999.999/9999-99"
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                      value = value.replace(/(\d{4})(\d)/, '$1-$2');
                      setFieldValue('cnpj', value);
                    }}
                  />
                  <ErrorMessage name="cnpj" component="span" className="error" />
                </div>

                <div className="form-group">
                  <label>Nome da Empresa *</label>
                  <Field name="nome" placeholder="Ex: Tech Solutions Ltda" />
                  <ErrorMessage name="nome" component="span" className="error" />
                </div>

                <div className="form-group full-width">
                  <label>Endereço</label>
                  <Field name="endereco" as="textarea" rows="3" placeholder="Rua, número, bairro, cidade - UF" />
                </div>
              </div>

              <div className="consentimento">
                <Field type="checkbox" name="consentimento" />
                <label>
                  Consinto com o tratamento de dados conforme LGPD
                </label>
              </div>
              <ErrorMessage name="consentimento" component="span" className="error" />

              <div className="actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar Empresa'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}