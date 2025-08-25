import React from "react";
import "../styles/CommentSection.css";

const CommentSection = ({ comments }) => {
  return (
    <div className="comment-section">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            {comment.content}
          </div>
        ))
      ) : (
        <p className="no-comments">Nema komentara još uvek.</p>
      )}
    </div>
  );
};

export default CommentSection;


  