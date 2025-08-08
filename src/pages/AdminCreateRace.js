import React, { useState } from "react";
import "../styles/CreatePlan.css";

const AdminCreateRace = () => {
  const [race, setRace] = useState({
    name: "",
    description: "",
    race_date: "",
    start_time: "",
    end_time: "",
    distance: "",
    max_participants: "",
    prize: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
    setRace({ ...race, [e.target.name]: e.target.value });
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
        alert("Samo administratori mogu da kreiraju biznis trke.");
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
        name: race.name,
        description: race.description,
        race_date: race.race_date,
        start_time: race.start_time,
        end_time: race.end_time,
        distance: parseFloat(race.distance),
        max_participants: parseInt(race.max_participants),
        prize: race.prize || null
      };
      
      console.log('Šaljem podatke:', postData);
      
      const response = await fetch("http://localhost:8000/api/races", {
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
        alert("Biznis trka uspešno kreirana!");
        setRace({ 
          name: "", 
          description: "",
          race_date: "",
          start_time: "",
          end_time: "",
          distance: "",
          max_participants: "",
          prize: ""
        });
      } else {
        console.error('Server greška:', responseData);
        setError(responseData.message || "Greška pri kreiranju biznis trke.");
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
      <h2>KREIRAJ BIZNIS TRKU</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      <form className="running-plan-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Naziv trke"
          value={race.name}
          onChange={handleChange}
          className="running-plan-input"
          required
          disabled={loading}
        />
        
        <textarea
          name="description"
          placeholder="Opis trke"
          value={race.description}
          onChange={handleChange}
          className="running-plan-textarea"
          required
          disabled={loading}
        ></textarea>
        
        <input
          type="date"
          name="race_date"
          placeholder="Datum trke"
          value={race.race_date}
          onChange={handleChange}
          className="running-plan-input"
          min={today}
          required
          disabled={loading}
        />
        
        <input
          type="time"
          name="start_time"
          placeholder="Vreme početka"
          value={race.start_time}
          onChange={handleChange}
          className="running-plan-input"
          required
          disabled={loading}
        />
        
        <input
          type="time"
          name="end_time"
          placeholder="Vreme kraja"
          value={race.end_time}
          onChange={handleChange}
          className="running-plan-input"
          required
          disabled={loading}
        />
        
        <input
          type="number"
          name="distance"
          placeholder="Distanca trke (km)"
          value={race.distance}
          onChange={handleChange}
          className="running-plan-input"
          step="0.1"
          min="0.1"
          required
          disabled={loading}
        />
        
        <input
          type="number"
          name="max_participants"
          placeholder="Maksimalan broj učesnika"
          value={race.max_participants}
          onChange={handleChange}
          className="running-plan-input"
          min="1"
          required
          disabled={loading}
        />
        
        <input
          type="text"
          name="prize"
          placeholder="Nagrada (opciono)"
          value={race.prize}
          onChange={handleChange}
          className="running-plan-input"
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className="running-plan-button"
          disabled={loading}
        >
          {loading ? "Kreiram trku..." : "KREIRAJ TRKU"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateRace;