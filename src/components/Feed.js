import React, { useState } from "react";
import Post from "./Post"; // Uvozimo Post komponentu
import "../styles/Feed.css";

const Feed = () => {
  const initialPlans = [
    {
      id: 1,
      name: "Jutarnje trčanje u parku",
      date: "2025-02-20",
      distance: 5,
      description: "Lagana petica kroz gradski park za osveženje dana!",
      comments: [
        { id: 1, content: "Odličan plan! Pridružiću se sutra." },
        { id: 2, content: "Koje vreme ciljaš?" },
      ]
    },
    {
      id: 2,
      name: "Priprema za polumaraton",
      date: "2025-03-05",
      distance: 15,
      description: "Dugoprugaški trening sa tempom 5:30 min/km.",
      comments: [
        { id: 3, content: "Sjajan plan, treba mi ovako nešto!" },
      ]
    },
    {
      id: 3,
      name: "Brzi intervali",
      date: "2025-02-25",
      distance: 8,
      description: "Intervalni trening: 6x800m sa pauzama od 90 sekundi.",
      comments: []
    }
  ];

  const [plans, setPlans] = useState(initialPlans);

  // Funkcija za dodavanje komentara u određeni plan
  const addComment = (postId, commentContent) => {
    const newPlans = plans.map((plan) => {
      if (plan.id === postId) {
        const newComment = {
          id: plan.comments.length + 1, // Novi ID za komentar
          content: commentContent
        };
        return { ...plan, comments: [...plan.comments, newComment] };
      }
      return plan;
    });

    setPlans(newPlans); // Ažuriramo stanje plans
  };

  return (
    <div className="feed">
      {plans.map((plan) => (
        <Post
          key={plan.id}
          id={plan.id}
          name={plan.name}
          date={plan.date}
          distance={plan.distance}
          description={plan.description}
          comments={plan.comments}
          addComment={addComment} // Prosleđujemo funkciju za dodavanje komentara
        />
      ))}
    </div>
  );
};

export default Feed;
