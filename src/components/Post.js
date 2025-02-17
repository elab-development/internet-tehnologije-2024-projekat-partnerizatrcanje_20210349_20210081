import React, { useState } from "react";
import "../styles/Post.css";
import CommentSection from "./CommentSection"; // Uvozimo sekciju za komentare

const Post = ({ id, name, date, distance, description, comments, addComment }) => {
  const [newComment, setNewComment] = useState(""); // Držimo unos novog komentara
  const [showCommentForm, setShowCommentForm] = useState(false); // Da li prikazujemo formu za komentar

  // Funkcija za unos komentara
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Funkcija za slanje komentara
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      addComment(id, newComment); // Pozivamo funkciju za dodavanje komentara
      setNewComment(""); // Resetujemo unos
      setShowCommentForm(false); // Sakrivamo formu nakon slanja
    }
  };

  return (
    <div className="post">
      <h3>{name}</h3>
      <p><strong>Datum:</strong> {date}</p>
      <p><strong>Dužina trčanja:</strong> {distance} km</p>
      <p>{description}</p>

      <CommentSection comments={comments} /> {/* Prikaz komentara */}

      {/* Klik na post prikazuje formu za komentar */}
      <button onClick={() => setShowCommentForm(!showCommentForm)}>
        {showCommentForm ? "Otkrij komentar" : "Postavi komentar"}
      </button>

      {showCommentForm && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Napišite komentar..."
            required
          ></textarea>
          <button type="submit">Pošaljite komentar</button>
        </form>
      )}
    </div>
  );
};

export default Post;
