// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import "../../styles/pages/auth/login.css"; // você pode criar um CSS básico depois

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("Candidato");
  const { login } = useAuth();
  const navigate = useNavigate();

  const fakeUsers = {
    Candidato: {
      id: 101,
      nome: "Mariana Oliveira",
      email: "mariana@candidato.com",
      role: "Candidato",
    },
    RH: {
      id: 201,
      nome: "Ana Souza",
      email: "ana@rh.com",
      role: "RH",
    },
    Gestor: {
      id: 301,
      nome: "Carlos Lima",
      email: "carlos@gestor.com",
      role: "Gestor",
    },
    Admin: {
      id: 401,
      nome: "Admin Master",
      email: "admin@nexum.com",
      role: "Admin",
    },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = fakeUsers[selectedRole];
    login(userData, "fake-token-123");
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>NEXUM</h1>
          <p>Sistema de Recursos Humanos</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <h2>Login para testes</h2>
          <p>Escolha seu perfil para entrar rapidamente</p>

          <div className="role-selection">
            {Object.keys(fakeUsers).map((role) => (
              <label key={role} className="role-option">
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="btn-login">
            Entrar como {selectedRole}
          </button>

          <div className="login-footer">
            <p>
              <a href="/register">Criar conta como Candidato</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}