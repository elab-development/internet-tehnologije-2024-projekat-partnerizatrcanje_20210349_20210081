import React, { useState } from 'react';  // Don't forget to import useState
import CommentSection from '../components/CommentSection'; // If needed
import Feed from '../components/Feed';  // Importing Feed component
import Post from '../components/Post';  // If needed
import RunningPlanCard from '../components/RunningPlanCard';  // If needed
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Feed />  {/* Use the Feed component imported */}
    </div>
  );
};

export default Home;

