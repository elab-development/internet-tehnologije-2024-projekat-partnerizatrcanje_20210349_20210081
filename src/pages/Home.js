import React from 'react';
import CommentSection from '../components/CommentSection';
import Feed from '../components/Feed';
import Post from '../components/Post';
import RunningPlanCard from '../components/RunningPlanCard';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Dobrodošli na Home stranicu</h1>
      <Feed />
      <RunningPlanCard />
      <Post />
      <CommentSection />
    </div>
  );
};

export default Home;
