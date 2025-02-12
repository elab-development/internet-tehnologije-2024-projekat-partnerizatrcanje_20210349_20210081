import React from 'react';
import "../styles/CommentSection.css";

const CommentSection = ({ comments }) => {
  return (
    <div className="comment-section">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          {comment.content}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;

  