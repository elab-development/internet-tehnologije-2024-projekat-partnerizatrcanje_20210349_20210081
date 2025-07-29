import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePlan from "./pages/CreatePlan";
import Challenges from "./pages/Challenges";
import Races from "./pages/Races";
import Navbar from "./components/Navbar";
import './styles/styles-main.css';

// Jednostavan RoleGuard komponenta
const RoleGuard = ({ children, allowedRoles = [], fallbackMessage = null }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'guest';

  // Proveri da li korisnik ima dozvoljenu ulogu
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    // Prikaži poruku o odbijenom pristupu
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

// Wrapper komponente za lakše korišćenje
const RegisteredUsersOnly = ({ children }) => (
  <RoleGuard 
    allowedRoles={['user', 'admin']} 
    fallbackMessage="Gost korisnici ne mogu pristupiti ovoj stranici. Molimo registrujte se."
  >
    {children}
  </RoleGuard>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Početna stranica preusmerava na login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login i Register stranice bez Navbar-a */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Home stranica - dostupna svima uključujući guest */}
        <Route path="/home" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        
        {/* Profil - samo registrovani korisnici */}
        <Route path="/profile" element={
          <>
            <Navbar />
            <RegisteredUsersOnly>
              <Profile />
            </RegisteredUsersOnly>
          </>
        } />
        
        {/* Create Plan - samo registrovani korisnici */}
        <Route path="/create-plan" element={
          <>
            <Navbar />
            <RegisteredUsersOnly>
              <CreatePlan />
            </RegisteredUsersOnly>
          </>
        } />
        
        {/* Challenges - samo registrovani korisnici */}
        <Route path="/challenges" element={
          <>
            <Navbar />
            <RegisteredUsersOnly>
              <Challenges />
            </RegisteredUsersOnly>
          </>
        } />
        
        {/* Races - samo registrovani korisnici */}
        <Route path="/races" element={
          <>
            <Navbar />
            <RegisteredUsersOnly>
              <Races />
            </RegisteredUsersOnly>
          </>
        } />
        
        {/* Races sa velikim R - za kompatibilnost */}
        <Route path="/Races" element={
          <>
            <Navbar />
            <RegisteredUsersOnly>
              <Races />
            </RegisteredUsersOnly>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;