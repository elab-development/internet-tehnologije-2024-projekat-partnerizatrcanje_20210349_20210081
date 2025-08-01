// MainLayout.jsx
import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        {children}
      </main>
    </>
  );
};

export default MainLayout;
