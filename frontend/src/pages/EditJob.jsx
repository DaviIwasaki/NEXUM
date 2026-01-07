// src/pages/EditJob.jsx (cópia adaptada do CreateJob)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// ... importe o mesmo que CreateJob

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null); // inicia null

  useEffect(() => {
    // Mock fetch da vaga para edição
    const mockVaga = {
      titulo: "Desenvolvedor Frontend",
      descricao: "Trabalhe com React...",
      requisitos: "React, TS...",
      salarioMin: "6000",
      salarioMax: "12000",
      diversidade: { pcd: true, genero: false, raca: true },
      etapas: [
        { nome: "Triagem", ordem: 1, responsavel: "RH", descricao: "" },
        { nome: "Entrevista Técnica", ordem: 2, responsavel: "Gestor", descricao: "" },
      ],
    };
    setForm(mockVaga);
  }, [id]);

  if (!form) return <div>Carregando vaga...</div>;

  // O resto é igual ao CreateJob, mas com handleSubmit editando
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock PATCH
    console.log("Vaga editada ID:", id, form);
    toast.success("Vaga atualizada!");
    navigate(`/vagas/${id}`);
  };

  // ... resto do form igual ao CreateJob (accordion, etc.)
}