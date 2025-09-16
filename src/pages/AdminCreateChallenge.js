import React, { useState } from "react";
import "../styles/CreatePlan.css";

const AdminCreateChallenge = () => {
  const [challenge, setChallenge] = useState({
    name: "",
    description: "",
    target_distance: "",
    duration_days: "",
    start_date: "",
    prize: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
    setChallenge({ ...challenge, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const token = localStorage.getItem("auth_token");
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Proveri da li je korisnik admin
      if (!user || user.role !== 'admin') {
        alert("Samo administratori mogu da kreiraju izazove.");
        setLoading(false);
        return;
      }
      
      if (!token) {
        alert("Niste prijavljeni. Molimo prijavite se ponovo.");
        setLoading(false);
        return;
      }
      
      // Pripremi podatke za slanje
      const postData = {
        name: challenge.name,
        description: challenge.description,
        target_distance: parseFloat(challenge.target_distance),
        duration_days: parseInt(challenge.duration_days),
        start_date: challenge.start_date,
        prize: challenge.prize || null
      };
      
      console.log('Šaljem podatke:', postData);
      
      const response = await fetch("http://localhost:8000/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(postData)
      });
      
      const responseData = await response.json();
      console.log('Odgovor servera:', responseData);
      
      if (response.ok) {
        alert("Izazov uspešno kreiran!");
        setChallenge({ 
          name: "", 
          description: "",
          target_distance: "",
          duration_days: "",
          start_date: "",
          prize: ""
        });
      } else {
        console.error('Server greška:', responseData);
        setError(responseData.message || "Greška pri kreiranju izazova.");
      }
    } catch (error) {
      console.error("Greška:", error);
      setError("Došlo je do greške prilikom komunikacije sa serverom.");
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="running-plan-container">
      <h2>KREIRAJ IZAZOV</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      <form className="running-plan-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Naziv izazova"
          value={challenge.name}
          onChange={handleChange}
          className="running-plan-input"
          required
          disabled={loading}
        />
        
        <textarea
          name="description"
          placeholder="Opis izazova"
          value={challenge.description}
          onChange={handleChange}
          className="running-plan-textarea"
          required
          disabled={loading}
        ></textarea>
        
        <input
          type="number"
          name="target_distance"
          placeholder="Ciljna distanca (km)"
          value={challenge.target_distance}
          onChange={handleChange}
          className="running-plan-input"
          step="0.1"
          min="0.1"
          required
          disabled={loading}
        />
        
        <input
          type="number"
          name="duration_days"
          placeholder="Trajanje u danima"
          value={challenge.duration_days}
          onChange={handleChange}
          className="running-plan-input"
          min="1"
          max="365"
          required
          disabled={loading}
        />
        
        <input
          type="date"
          name="start_date"
          placeholder="Datum početka"
          value={challenge.start_date}
          onChange={handleChange}
          className="running-plan-input"
          min={today}
          required
          disabled={loading}
        />
        
        <input
          type="text"
          name="prize"
          placeholder="Nagrada (opciono)"
          value={challenge.prize}
          onChange={handleChange}
          className="running-plan-input"
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className="running-plan-button"
          disabled={loading}
        >
          {loading ? "Kreiram izazov..." : "KREIRAJ IZAZOV"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateChallenge;