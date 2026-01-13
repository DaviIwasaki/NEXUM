// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthStore";
import { toast } from "react-toastify";
import "../../styles/pages/auth/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: senha,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao fazer login");
      }

      const data = await response.json();
      const token = data.access_token;

      // Pega dados completos do usuário com /auth/me
      const meResponse = await fetch("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!meResponse.ok) {
        const meError = await meResponse.json();
        throw new Error(meError.detail || "Erro ao carregar dados do usuário");
      }

      const userData = await meResponse.json();

      // Salva no contexto e localStorage
      login(userData, token);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      console.error("[Login] Erro:", err);
      toast.error(err.message || "Email ou senha incorretos");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>NEXUM</h1>
          <p>Sistema de Recursos Humanos</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Entrar
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