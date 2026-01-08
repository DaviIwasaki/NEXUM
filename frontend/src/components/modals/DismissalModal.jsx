// src/components/modals/DismissalModal.jsx
import React from "react";
import Modal from "react-modal";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const validationSchema = Yup.object({
  motivo: Yup.string().required("Motivo obrigatório"),
  dataDemissao: Yup.date().required("Data obrigatória"),
  observacoes: Yup.string(),
});

export default function DismissalModal({ isOpen, onClose, colaborador, onConfirm }) {
  const initialValues = {
    motivo: "",
    dataDemissao: new Date().toISOString().split("T")[0],
    observacoes: "",
    documentos: null,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Demissão registrada:", values);

    toast.success(`Demissão de ${colaborador.nome} registrada em ${values.dataDemissao}. Relatório PDF gerado (mock).`);

    onConfirm({
      ...values,
      status: "Desligado",
      eventoHistorico: {
        data: values.dataDemissao,
        evento: "Demissão",
        motivo: values.motivo,
      },
    });

    setSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal-box" overlayClassName="modal-overlay">
      <h2>Registro de Demissão</h2>
      <p>
        <strong>Colaborador:</strong> {colaborador?.nome} ({colaborador?.cargo})
      </p>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className="form-group">
              <label>Motivo da Demissão *</label>
              <Field as="select" name="motivo">
                <option value="">Selecione o motivo</option>
                <option value="Pedido de demissão">Pedido de demissão</option>
                <option value="Demissão sem justa causa">Demissão sem justa causa</option>
                <option value="Demissão por justa causa">Demissão por justa causa</option>
                <option value="Término de contrato">Término de contrato</option>
                <option value="Aposentadoria">Aposentadoria</option>
                <option value="Acordo mútuo">Acordo mútuo</option>
              </Field>
              <ErrorMessage name="motivo" component="span" className="error" />
            </div>

            <div className="form-group">
              <label>Data da Demissão *</label>
              <Field name="dataDemissao" type="date" />
              <ErrorMessage name="dataDemissao" component="span" className="error" />
            </div>

            <div className="form-group">
              <label>Anexar Documentos (Termo de demissão, etc.)</label>
              <input
                type="file"
                multiple
                onChange={(e) => setFieldValue("documentos", e.target.files)}
              />
            </div>

            <div className="form-group">
              <label>Observações adicionais</label>
              <Field as="textarea" name="observacoes" rows="4" placeholder="Detalhes sobre o processo, acordos, etc." />
            </div>

            <div className="modal-actions">
              <button type="button" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </button>
              <button type="submit" className="btn-danger" disabled={isSubmitting}>
                {isSubmitting ? "Processando..." : "Confirmar Demissão"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}