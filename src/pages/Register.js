import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Ovde ide logika za registraciju
    console.log("Registrovan:", name, email);
    navigate("/login"); // Preusmeravanje nakon registracije
  };

  return (
    <div className="auth-container">
      <h2>Registracija</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Ime i Prezime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Registruj se</button>
      </form>
      <p>Već imate nalog? <span onClick={() => navigate("/login")}>Prijavite se</span></p>
    </div>
  );
};

export default Register;
