import React from 'react';
import "../styles/Post.css"
import CommentSection from './CommentSection'; // Uvozimo CommentSection

const Post = ({ content, comments }) => {
  return (
    <div className="post">
      <p>{content}</p>
      <CommentSection comments={comments} /> {/* Prosleđujemo komentare u CommentSection */}
    </div>
  );
};

export default Post;
