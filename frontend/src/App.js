import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/authStore";
import ProtectedRoute from "./routes/ProtectedRoute";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import "./styles/global.css";
import Login from "./pages/auth/Login";
import "./pages/Register.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CompanyCreate from "./pages/CompanyCreate.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import JobList from "./pages/JobList.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import SelectionProcess from "./pages/SelectionProcess.jsx";
import CandidateProfile from "./pages/CandidateProfile.jsx";
import CandidateProcessDetails from "./pages/CandidateProcessDetails.jsx";
import AuditLog from "./pages/AuditLog.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <div className="main-layout">
          <Sidebar />

          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/register" element={<Register />} />

              <Route
                path="/empresas/nova"
                element={
                  <ProtectedRoute roles={["Admin"]}>
                    <CompanyCreate />
                  </ProtectedRoute>
                }
              />

              <Route path="/vagas/nova" element={<CreateJob />} />

              <Route path="/vagas" element={<JobList />} />

              <Route path="/vagas/:id" element={<JobDetails user={{ role: "Candidato" }} />} />

              <Route path="/processoSeletivo" element={<SelectionProcess />} />

              <Route path="/perfil" element={<CandidateProfile />} />

              <Route path="/processoSeletivo/:id" element={<CandidateProcessDetails />} />

              <Route path="/logs" element={<AuditLog />} />

            </Routes>
          </main>
        </div>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
