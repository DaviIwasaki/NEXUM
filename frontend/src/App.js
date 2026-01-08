import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthStore";
import ProtectedRoute from "./routes/ProtectedRoute";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

import Login from "./pages/auth/Login";
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
import NewEmployee from "./pages/employees/NewEmployee";
import ContractChange from "./pages/employees/ContractChange";
import TimeClock from "./pages/point/TimeClock";
import PointMirror from "./pages/point/PointMirror";
import PendingApprovals from "./pages/point/PendingApprovals";
import PayrollCalculation from "./pages/payroll/PayrollCalculation";

import "./styles/global.css";

/* ===================== LAYOUT PRIVADO ===================== */
function AppLayout({ children }) {
  return (
    <div className="app-wrapper">
      <Header />
      <div className="main-layout">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ===================== ROTAS PÚBLICAS ===================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===================== ROTAS PRIVADAS ===================== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/empresas/nova"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AppLayout>
                  <CompanyCreate />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* RH */}
          <Route
            path="/vagas/nova"
            element={
              <ProtectedRoute roles={["RH"]}>
                <AppLayout>
                  <CreateJob />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Todos logados */}
          <Route
            path="/vagas"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <JobList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vagas/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <JobDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vagas/:id/edit"
            element={
              <ProtectedRoute roles={["RH"]}>
                <AppLayout>
                  <EditJob />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* RH e Gestor */}
          <Route
            path="/processo/:id"
            element={
              <ProtectedRoute roles={["RH", "Gestor"]}>
                <AppLayout>
                  <SelectionProcess />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidato/:candidaturaId"
            element={
              <ProtectedRoute roles={["RH", "Gestor"]}>
                <AppLayout>
                  <CandidateProcessDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Perfil */}
          <Route
            path="/meu-perfil"
            element={
              <ProtectedRoute roles={["Candidato", "Colaborador"]}>
                <AppLayout>
                  <PersonProfile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/colaboradores/:id"
            element={
              <ProtectedRoute roles={["RH", "Admin", "Gestor"]}>
                <AppLayout>
                  <PersonProfile />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin, RH e Gestor */}
          <Route
            path="/logs"
            element={
              <ProtectedRoute roles={["Admin", "RH", "Gestor"]}>
                <AppLayout>
                  <AuditLog />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Colaboradores */}
          <Route
            path="/colaboradores"
            element={
              <ProtectedRoute roles={["RH", "Admin", "Gestor", "Colaborador"]}>
                <AppLayout>
                  <EmployeeList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/colaboradores/novo"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <AppLayout>
                  <NewEmployee />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/colaboradores/:id/alteracao"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <AppLayout>
                  <ContractChange />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ponto"
            element={
              <ProtectedRoute roles={["Colaborador"]}>
                <TimeClock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/espelho-ponto"
            element={
              <ProtectedRoute roles={["Colaborador", "Gestor", "RH"]}>
                <PointMirror />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aprovacoes-pendentes"
            element={
              <ProtectedRoute roles={["Gestor"]}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/folha-calculo"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <PayrollCalculation />
              </ProtectedRoute>
            }
          />

          {/* ===================== REDIRECIONAMENTO PADRÃO ===================== */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
