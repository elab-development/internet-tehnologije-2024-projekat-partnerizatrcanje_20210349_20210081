import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { ThemeManager } from '../utils/ThemeManager';

const MainLayout = ({ children }) => {
  useEffect(() => {
    // Primeni temu kad se komponenta mount-uje
    ThemeManager.applyTheme();
    
    // Listener za promene localStorage (kada se user uloguje/izloguje)
    const handleStorageChange = () => {
      ThemeManager.applyTheme();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;