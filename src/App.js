import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePlan from "./pages/CreatePlan";
import AdminCreateChallenge from "./pages/AdminCreateChallenge"; // DODANO
import AdminCreateRace from "./pages/AdminCreateRace";           // DODANO
import Challenges from "./pages/Challenges";
import Races from "./pages/Races";
import MainLayout from "./components/MainLayout";
import './styles/styles-main.css';

const RoleGuard = ({ children, allowedRoles = [], fallbackMessage = null }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'guest';

  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          borderLeft: '5px solid #dc3545'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>Pristup odbijen</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {fallbackMessage || "Nemate dozvolu za pristup ovoj stranici."}
          </p>
          <button 
            onClick={() => window.history.back()}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Nazad
          </button>
        </div>
      </div>
    );
  }

  return children;
};

const RegisteredUsersOnly = ({ children }) => (
  <RoleGuard 
    allowedRoles={['user', 'admin']} 
    fallbackMessage="Gost korisnici ne mogu pristupiti ovoj stranici. Molimo registrujte se."
  >
    {children}
  </RoleGuard>
);

// NOVA KOMPONENTA - AdminOnly guard
const AdminOnly = ({ children }) => (
  <RoleGuard 
    allowedRoles={['admin']} 
    fallbackMessage="Samo administratori mogu pristupiti ovoj stranici."
  >
    {children}
  </RoleGuard>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Sve rute sa navbarom unutar MainLayout */}
        <Route path="/home" element={
          <MainLayout>
            <Home />
          </MainLayout>
        } />

        <Route path="/profile" element={
          <MainLayout>
            <RegisteredUsersOnly>
              <Profile />
            </RegisteredUsersOnly>
          </MainLayout>
        } />

        <Route path="/create-plan" element={
          <MainLayout>
            <RegisteredUsersOnly>
              <CreatePlan />
            </RegisteredUsersOnly>
          </MainLayout>
        } />

        {/* NOVE ADMIN RUTE */}
        <Route path="/create-challenge" element={
          <MainLayout>
            <AdminOnly>
              <AdminCreateChallenge />
            </AdminOnly>
          </MainLayout>
        } />

        <Route path="/create-race" element={
          <MainLayout>
            <AdminOnly>
              <AdminCreateRace />
            </AdminOnly>
          </MainLayout>
        } />

        <Route path="/challenges" element={
          <MainLayout>
            <RegisteredUsersOnly>
              <Challenges />
            </RegisteredUsersOnly>
          </MainLayout>
        } />

        <Route path="/races" element={
          <MainLayout>
            <RegisteredUsersOnly>
              <Races />
            </RegisteredUsersOnly>
          </MainLayout>
        } />

        {/* Kompatibilnost */}
        <Route path="/Races" element={
          <MainLayout>
            <RegisteredUsersOnly>
              <Races />
            </RegisteredUsersOnly>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;