// src/pages/Home.js
import React from 'react';
import CommentSection from '../components/CommentSection';
import Feed from '../components/Feed';
import NavBar from '../components/NavBar';
import Post from '../components/Post';
import RunningPlanCard from '../components/RunningPlanCard';

const Home = () => {
  return (
    <div>
      <NavBar />
      <h1>Dobrodošli na Home stranicu</h1>
      <Feed />
      <RunningPlanCard />
      <Post />
      <CommentSection />
    </div>
  );
};

export default Home;
