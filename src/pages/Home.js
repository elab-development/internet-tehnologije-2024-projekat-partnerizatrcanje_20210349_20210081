import React, { useState } from 'react';  // Don't forget to import useState
import Feed from '../components/Feed';  // Importing Feed component

import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Feed />  {/* Use the Feed component imported */}
    </div>
  );
};

export default Home;

