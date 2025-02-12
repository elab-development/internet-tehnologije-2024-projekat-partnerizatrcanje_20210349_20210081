import React, { useState } from "react";
import "../styles/CreatePlan.css";

const CreatePlan = () => {
  const [plan, setPlan] = useState({
    name: "",
    date: "",
    distance: "",
    description: ""
  });
  
  const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:8000/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(plan)
      });
      
      if (response.ok) {
        alert("Plan uspešno kreiran!");
        setPlan({ name: "", date: "", distance: "", description: "" });
      } else {
        alert("Greška pri kreiranju plana.");
      }
    } catch (error) {
      console.error("Greška:", error);
      alert("Došlo je do greške.");
    }
  };

  return (
    <div className="running-plan-container">
      <h2>Kreiraj plan trčanja</h2>
      <form className="running-plan-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Naziv plana"
          value={plan.name}
          onChange={handleChange}
          className="running-plan-input"
          required
        />
        <input
          type="date"
          name="date"
          value={plan.date}
          onChange={handleChange}
          className="running-plan-input"
          required
        />
        <input
          type="number"
          name="distance"
          placeholder="Dužina trčanja (km)"
          value={plan.distance}
          onChange={handleChange}
          className="running-plan-input"
          required
        />
        <textarea
          name="description"
          placeholder="Opis"
          value={plan.description}
          onChange={handleChange}
          className="running-plan-textarea"
        ></textarea>
        <button type="submit" className="running-plan-button">Kreiraj plan</button>
      </form>
    </div>
  );
};

export default CreatePlan;