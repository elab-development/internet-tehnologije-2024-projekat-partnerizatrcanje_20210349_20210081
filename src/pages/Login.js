import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // API base URL
  const API_BASE_URL = "http://localhost:8000/api";

  // Prikaži success poruku iz registracije (ako postoji)
  const successMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Uspešan login
        console.log("Uspešno ulogovan:", data.user);
        
        // Sačuvaj token i korisnika u localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Preusmeravanje na home stranicu
        navigate("/home");
        
      } else {
        // Login neuspešan
        setError(data.message || "Neispravni podaci za prijavu.");
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError("Greška sa mrežom. Molimo pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/guest-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Uspešan guest login
        console.log("Uspešno ulogovan kao gost:", data.user);
        
        // Sačuvaj token i guest korisnika
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Preusmeravanje na home stranicu
        navigate("/home");
        
      } else {
        setError(data.message || "Greška prilikom prijave kao gost.");
      }
      
    } catch (error) {
      console.error('Guest login error:', error);
      setError("Greška sa mrežom. Molimo pokušajte ponovo.");
    } finally {
      setGuestLoading(false);
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    // TODO: Implementiraj password reset API poziv
    console.log("Zahtev za reset lozinke poslat za:", resetEmail);
    alert("Ako postoji nalog sa ovom email adresom, poslat je link za resetovanje lozinke.");
    setShowModal(false);
    setResetEmail("");
  };

  return (
    <div className="auth-container">
      <h2>Prijava</h2>
      
      {/* Success poruka iz registracije */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading || guestLoading}
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || guestLoading}
        />
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" disabled={loading || guestLoading}>
          {loading ? "Prijavljujem..." : "Prijavi se"}
        </button>
      </form>

      <p>
        Nemate nalog? 
        <span onClick={() => navigate("/register")}>Registrujte se</span>
      </p>

      <p>
        <span onClick={() => setShowModal(true)}>Zaboravili ste lozinku?</span>
      </p>

      <p>
        <button 
          onClick={handleGuestLogin} 
          className="guest-button"
          disabled={loading || guestLoading}
        >
          {guestLoading ? "Prijavljujem kao gost..." : "Prijavi se kao gost"}
        </button>
      </p>

      {/* Modal za reset lozinke */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Resetuj lozinku</h3>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Unesite email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit">Pošalji zahtev</button>
            </form>
            <button 
              className="close-modal" 
              onClick={() => {
                setShowModal(false);
                setResetEmail("");
              }}
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;