import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // API base URL - promeni ako je potrebno
  const API_BASE_URL = "http://localhost:8000/api";

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Osnovne validacije
    if (password !== confirmPassword) {
      setError("Lozinke se ne poklapaju!");
      return;
    }

    if (password.length < 8) {
      setError("Lozinka mora imati najmanje 8 karaktera!");
      return;
    }
    
    // Uklanjanje greške ako je sve u redu
    setError("");
    setLoading(true);
    
    try {
      // API poziv za registraciju - PRAVI ENDPOINT
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: ime,
          surname: prezime,
          email: email,
          password: password,
          password_confirmation: confirmPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Uspešna registracija
        console.log("Uspešno registrovan:", data.user);
        
        // Opciono: sačuvaj token u localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Preusmeravanje nakon registracije
        navigate("/login", { 
          state: { message: "Uspešno ste se registrovali! Možete se ulogovati." }
        });
        
      } else {
        // Rukovanje greškama sa backend-a
        if (data.errors) {
          // Laravel validation errors
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(data.message || "Došlo je do greške prilikom registracije.");
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setError("Greška sa mrežom. Molimo pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registracija</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Ime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Prezime"
          value={prezime}
          onChange={(e) => setPrezime(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Lozinka (min. 8 karaktera)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Potvrdi lozinku"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        {error && <p style={{color: 'red', fontSize: '14px', marginTop: '10px'}}>{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? "Registrovanje..." : "Registruj se"}
        </button>
      </form>
      
      <p>
        Već imate nalog? 
        <span 
          onClick={() => navigate("/login")} 
          style={{cursor: 'pointer', color: '#007bff'}}
        >
          Prijavite se
        </span>
      </p>
    </div>
  );
};

export default Register;