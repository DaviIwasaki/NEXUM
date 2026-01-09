// src/App.js
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
import PayslipIndividual from "./pages/payroll/PayslipIndividual";
import FiscalReports from "./pages/payroll/FiscalReports";
import BenefitsCatalog from "./pages/benefits/BenefitsCatalog";
import MyBenefits from "./pages/benefits/MyBenefits";
import BenefitsAdmin from "./pages/benefits/BenefitsAdmin";
import EvaluationCycles from "./pages/performance/EvaluationCycles";
import EvaluationForm from "./pages/performance/EvaluationForm";
import PDI from "./pages/performance/PDI";
import TrainingCatalog from "./pages/training/TrainingCatalog";
import TrainingHistory from "./pages/training/TrainingHistory";
import TrainingAdmin from "./pages/training/TrainingAdmin";
import HealthRequest from "./pages/health/HealthRequest";
import ComplianceReports from "./pages/reports/ComplianceReports";
import StrategicReports from "./pages/reports/StrategicReports";
import UsersManagement from "./pages/config/UsersManagement";
import PositionsDepts from "./pages/config/PositionsDepts";

import "./styles/global.css";

// Layout privado com Header/Sidebar/Footer
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
          {/* Rotas públicas (sem layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas privadas (com layout) */}
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
          <Route
            path="/config/usuarios"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AppLayout>
                  <UsersManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/config/cargos-departamentos"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <AppLayout>
                  <PositionsDepts />
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
          <Route
            path="/folha-calculo"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <AppLayout>
                  <PayrollCalculation />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorios-fiscais"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <AppLayout>
                  <FiscalReports />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficios/admin"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <AppLayout>
                  <BenefitsAdmin />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/treinamentos/admin"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <AppLayout>
                  <TrainingAdmin />
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
            path="/perfil"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PersonProfile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meu-perfil"
            element={
              <ProtectedRoute roles={["Colaborador"]}>
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
          <Route
            path="/colaboradores"
            element={
              <ProtectedRoute roles={["RH", "Admin", "Gestor"]}>
                <AppLayout>
                  <EmployeeList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/colaboradores/novo"
            element={
              <ProtectedRoute roles={["Gestor", "Admin"]}>
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
                <AppLayout>
                  <TimeClock />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/espelho-ponto"
            element={
              <ProtectedRoute roles={["Colaborador", "Gestor", "RH"]}>
                <AppLayout>
                  <PointMirror />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/aprovacoes-pendentes"
            element={
              <ProtectedRoute roles={["Gestor"]}>
                <AppLayout>
                  <PendingApprovals />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/holerite"
            element={
              <ProtectedRoute roles={["Colaborador", "RH", "Admin"]}>
                <AppLayout>
                  <PayslipIndividual />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorios/compliance"
            element={
              <ProtectedRoute roles={["RH", "Admin", "Auditor"]}>
                <AppLayout>
                  <ComplianceReports />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorios/estrategicos"
            element={
              <ProtectedRoute roles={["RH", "Admin", "Gestor"]}>
                <AppLayout>
                  <StrategicReports />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficios/catalogo"
            element={
              <ProtectedRoute roles={["Colaborador"]}>
                <AppLayout>
                  <BenefitsCatalog />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/meus-beneficios"
            element={
              <ProtectedRoute roles={["Colaborador", "RH", "Admin"]}>
                <AppLayout>
                  <MyBenefits />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficios/admin"
            element={
              <ProtectedRoute roles={["RH", "Admin"]}>
                <AppLayout>
                  <BenefitsAdmin />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ciclos-avaliacao"
            element={
              <ProtectedRoute roles={["Gestor", "RH", "Admin"]}>
                <AppLayout>
                  <EvaluationCycles />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/avaliacao/formulario/:cicloId"
            element={
              <ProtectedRoute roles={["Gestor", "Colaborador", "RH"]}>
                <AppLayout>
                  <EvaluationForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pdi"
            element={
              <ProtectedRoute roles={["Colaborador", "Gestor", "RH"]}>
                <AppLayout>
                  <PDI />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trilhas-aprendizagem"
            element={
              <ProtectedRoute roles={["Colaborador"]}>
                <AppLayout>
                  <TrainingCatalog />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/historico-treinamentos"
            element={
              <ProtectedRoute roles={["Colaborador", "RH", "Admin"]}>
                <AppLayout>
                  <TrainingHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saude/solicitacoes"
            element={
              <ProtectedRoute roles={["Colaborador", "Gestor", "RH"]}>
                <AppLayout>
                  <HealthRequest />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirecionamento padrão */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
