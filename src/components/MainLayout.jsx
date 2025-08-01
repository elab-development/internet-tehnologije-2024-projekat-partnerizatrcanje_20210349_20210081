// MainLayout.jsx
import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main style={{ paddingTop: '120px' }}>
        {children}
      </main>
    </>
  );
};

export default MainLayout;
