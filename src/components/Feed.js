import React, { useState } from 'react';
import Post from './Post';  // Uvozimo Post komponentu

const Feed = () => {
  const mockPosts = [
    {
      id: 1,
      content: "Ovo je prvi post. Podelite svoje misli!",
      comments: [
        { id: 1, content: "Odlično! Drago mi je što ste podelili." },
        { id: 2, content: "Zanimljivo, jedva čekam da pročitam još!" },
      ]
    },
    {
      id: 2,
      content: "Drugi post je ovde. Bilo bi sjajno ako biste ostavili komentar.",
      comments: [
        { id: 3, content: "Prava inspiracija!" },
        { id: 4, content: "Slažem se sa tobom." },
        { id: 5, content: "Puno sreće sa projektom!" },
      ]
    }
  ];

  const [posts] = useState(mockPosts);

  return (
    <div className="feed">
      {posts.map(post => (
        <Post key={post.id} content={post.content} comments={post.comments} />
      ))}
    </div>
  );
};

export default Feed;
