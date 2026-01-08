// src/pages/point/TimeClock.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/AuthStore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import "../../styles/pages/point/timeClock.css";

const mockRegistrosPonto = {
  "2026-01-08": [
    { tipo: "Entrada", hora: "08:00" },
    { tipo: "Saída Intervalo", hora: "12:00" },
    { tipo: "Entrada Intervalo", hora: "13:00" },
    { tipo: "Saída", hora: "17:00" },
  ],
  "2026-01-07": [
    { tipo: "Entrada", hora: "08:15" }, // atraso
    { tipo: "Saída", hora: "17:30" },
  ],
};

export default function TimeClock() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [justificativaModal, setJustificativaModal] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [bancoHoras, setBancoHoras] = useState("00:00"); // mock

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Mock cálculo de banco de horas
    setBancoHoras("+02:30"); // exemplo positivo
  }, []);

  const registrarPonto = (tipo) => {
    const horaAtual = currentTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const dataAtual = currentTime.toISOString().split("T")[0];

    console.log(`${tipo} registrado às ${horaAtual} por ${user?.nome}`);

    toast.success(`${tipo} registrado às ${horaAtual}`);

    // Aqui seria POST /ponto/register
  };

  const handleJustificativa = () => {
    if (!justificativa.trim()) {
      toast.error("Justificativa obrigatória");
      return;
    }
    console.log("Justificativa enviada:", justificativa);
    toast.success("Justificativa enviada para aprovação");
    setJustificativaModal(false);
    setJustificativa("");
  };

  const registrosDoDia = mockRegistrosPonto[selectedDate.toISOString().split("T")[0]] || [];

  return (
    <main className="timeclock-container">
      <div className="timeclock-header">
        <h1>Registro de Ponto</h1>
        <p>Bem-vindo, {user?.nome}</p>
        <div className="current-time">
          <strong>{currentTime.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong>
          <div className="clock">{currentTime.toLocaleTimeString("pt-BR")}</div>
        </div>
        <div className="banco-horas">
          <strong>Banco de Horas:</strong> <span className={bancoHoras.startsWith("+") ? "positivo" : "negativo"}>{bancoHoras}</span>
        </div>
      </div>

      <div className="timeclock-actions">
        <button className="btn-entrada" onClick={() => registrarPonto("Entrada")}>
          Entrada
        </button>
        <button className="btn-saida" onClick={() => registrarPonto("Saída")}>
          Saída
        </button>
        <button className="btn-justificativa" onClick={() => setJustificativaModal(true)}>
          Justificar Atraso/Falta
        </button>
      </div>

      <div className="calendar-section">
        <h2>Registros do Mês</h2>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date, view }) => {
            const dataStr = date.toISOString().split("T")[0];
            const registros = mockRegistrosPonto[dataStr];
            if (registros && view === "month") {
              return <div className="dot-indicator" />;
            }
            return null;
          }}
        />
      </div>

      <div className="daily-records">
        <h2>Registros de {selectedDate.toLocaleDateString("pt-BR")}</h2>
        {registrosDoDia.length > 0 ? (
          <ul>
            {registrosDoDia.map((reg, idx) => (
              <li key={idx}>
                <strong>{reg.tipo}:</strong> {reg.hora}
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem registros neste dia.</p>
        )}
      </div>

      {/* Modal de Justificativa */}
      {justificativaModal && (
        <div className="modal-overlay" onClick={() => setJustificativaModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Justificar Atraso/Falta</h2>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva o motivo (ex: consulta médica, problema de transporte...)"
              rows="5"
            />
            <div className="modal-actions">
              <button onClick={() => setJustificativaModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleJustificativa}>
                Enviar Justificativa
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}