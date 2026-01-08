// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthStore";
import ProtectedRoute from "./routes/ProtectedRoute";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import Login from "./pages/auth/Login"; // ajuste o caminho se necessário
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompanyCreate from "./pages/CompanyCreate";
import CreateJob from "./pages/CreateJob";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import SelectionProcess from "./pages/SelectionProcess";
import PersonProfile from "./pages/PersonProfile";
import CandidateProcessDetails from "./pages/CandidateProcessDetails";
import AuditLog from "./pages/AuditLog";
import EditJob from "./pages/EditJob";
import EmployeeList from "./pages/employees/EmployeeList";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Header />

          <div className="main-layout">
            <Sidebar />

            <main className="main-content">
              <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Rotas protegidas */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                {/* Admin */}
                <Route
                  path="/empresas/nova"
                  element={
                    <ProtectedRoute roles={["Admin"]}>
                      <CompanyCreate />
                    </ProtectedRoute>
                  }
                />
                {/* RH */}
                <Route
                  path="/vagas/nova"
                  element={
                    <ProtectedRoute roles={["RH"]}>
                      <CreateJob />
                    </ProtectedRoute>
                  }
                />
                {/* Todos logados */}
                <Route
                  path="/vagas"
                  element={
                    <ProtectedRoute>
                      <JobList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vagas/:id"
                  element={
                    <ProtectedRoute>
                      <JobDetails />
                    </ProtectedRoute>
                  }
                />
                {/* RH e Gestor */}
                <Route
                  path="/processo/:id"
                  element={
                    <ProtectedRoute roles={["RH", "Gestor"]}>
                      <SelectionProcess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/candidato/:candidaturaId"
                  element={
                    <ProtectedRoute roles={["RH", "Gestor"]}>
                      <CandidateProcessDetails />
                    </ProtectedRoute>
                  }
                />
                {/* Todos logados */}
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute roles={["Candidato", "Colaborador"]}>
                      <PersonProfile />
                    </ProtectedRoute>
                  }
                />
                {/* Admin, RH e Gestor */}
                <Route
                  path="/logs"
                  element={
                    <ProtectedRoute roles={["Admin", "RH", "Gestor"]}>
                      <AuditLog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vagas/:id/edit"
                  element={
                    <ProtectedRoute roles={["RH"]}>
                      <EditJob />
                    </ProtectedRoute>
                  }
                />
                {/* Rota fallback */}
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="/colaboradores"
                  element={
                    <ProtectedRoute
                      roles={["RH", "Admin", "Gestor", "Colaborador"]}
                    >
                      <EmployeeList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/colaboradores/:id"
                  element={
                    <ProtectedRoute roles={["RH", "Admin", "Gestor"]}>
                      <PersonProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/meu-perfil"
                  element={
                    <ProtectedRoute roles={["Colaborador"]}>
                      <PersonProfile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
