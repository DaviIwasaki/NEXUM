import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/authStore';
import ProtectedRoute from './routes/ProtectedRoute';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import './pages/Register.jsx';
import Register from './pages/Register.jsx';

function Dashboard() {
  return <h1>Dashboard</h1>;
}

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
            </Routes>
          </main>
        </div>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
