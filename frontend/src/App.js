import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/authStore';
import Login from './pages/auth/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

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
            </Routes>
          </main>
        </div>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
