import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Ovde ide logika za autentifikaciju
    console.log("Ulogovan:", email);
    navigate("/home"); // Preusmeravanje nakon logina
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
      <p>Nemate nalog? <span onClick={() => navigate("/register")}>Registrujte se</span></p>
    </div>
  );
};

export default Login;
