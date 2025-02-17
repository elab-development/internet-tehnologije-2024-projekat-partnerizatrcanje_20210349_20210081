import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Ulogovan:", email);
    navigate("/home");
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    console.log("Zahtev za reset lozinke poslat za:", resetEmail);
    alert("Ako postoji nalog sa ovom email adresom, poslat je link za resetovanje lozinke.");
    setShowModal(false);
  };

  return (
    <div className="auth-container">
      <h2>Prijava</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Prijavi se</button>
      </form>
      <p>
        Nemate nalog? <span onClick={() => navigate("/register")}>Registrujte se</span>
      </p>
      <p>
        <span onClick={() => setShowModal(true)}>Zaboravili ste lozinku?</span>
      </p>

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
            <button className="close-modal" onClick={() => setShowModal(false)}>Zatvori</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
