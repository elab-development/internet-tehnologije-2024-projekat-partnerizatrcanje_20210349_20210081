import React, { useState } from "react";
import "../styles/CreatePlan.css";

const CreatePlan = () => {
  const [plan, setPlan] = useState({
    title: "",
    content: "",
    duration: "",
    frequency: "",
    distance: "",
    max_participants: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const token = localStorage.getItem("auth_token"); // Ispravljeno sa "token" na "auth_token"
      const user = JSON.parse(localStorage.getItem("user"));
      
      // Proveri da li je korisnik guest
      if (user && user.role === 'guest') {
        alert("Gost korisnici ne mogu da kreiraju planove. Molimo registrujte se.");
        setLoading(false);
        return;
      }
      
      if (!token) {
        alert("Niste prijavljeni. Molimo prijavite se ponovo.");
        setLoading(false);
        return;
      }
      
      // Pripremi podatke za slanje (struktura koju PostController očekuje)
      const postData = {
        title: plan.title,
        content: plan.content,
        duration: parseInt(plan.duration),
        frequency: parseInt(plan.frequency),
        distance: parseFloat(plan.distance),
        max_participants: parseInt(plan.max_participants)
      };
      
      console.log('Šaljem podatke:', postData); // Debug
      
      const response = await fetch("http://localhost:8000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(postData)
      });
      
      const responseData = await response.json();
      console.log('Odgovor servera:', responseData); // Debug
      
      if (response.ok) {
        alert("Plan uspešno kreiran!");
        setPlan({ 
          title: "", 
          content: "",
          duration: "",
          frequency: "",
          distance: "", 
          max_participants: ""
        });
      } else {
        console.error('Server greška:', responseData);
        setError(responseData.message || "Greška pri kreiranju plana.");
      }
    } catch (error) {
      console.error("Greška:", error);
      setError("Došlo je do greške prilikom komunikacije sa serverom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="running-plan-container">
      <h2>Kreiraj plan trčanja</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      <form className="running-plan-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Naziv plana"
          value={plan.title}
          onChange={handleChange}
          className="running-plan-input"
          required
          disabled={loading}
        />
        
        <textarea
          name="content"
          placeholder="Opis plana trčanja"
          value={plan.content}
          onChange={handleChange}
          className="running-plan-textarea"
          required
          disabled={loading}
        ></textarea>
        
        <input
          type="number"
          name="duration"
          placeholder="Trajanje (minuti)"
          value={plan.duration}
          onChange={handleChange}
          className="running-plan-input"
          min="1"
          required
          disabled={loading}
        />
        
        <input
          type="number"
          name="frequency"
          placeholder="Učestalost (puta nedeljno)"
          value={plan.frequency}
          onChange={handleChange}
          className="running-plan-input"
          min="1"
          max="7"
          required
          disabled={loading}
        />
        
        <input
          type="number"
          name="distance"
          placeholder="Dužina trčanja (km)"
          value={plan.distance}
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
          value={plan.max_participants}
          onChange={handleChange}
          className="running-plan-input"
          min="1"
          required
          disabled={loading}
        />
        
        <button 
          type="submit" 
          className="running-plan-button"
          disabled={loading}
        >
          {loading ? "Kreiram plan..." : "Kreiraj plan"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlan;