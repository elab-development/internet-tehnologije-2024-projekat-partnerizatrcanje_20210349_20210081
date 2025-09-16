import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import { ThemeManager } from '../utils/ThemeManager';

const MainLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Primeni temu kad se komponenta mount-uje
    ThemeManager.applyTheme();
    
    // Listener za promene localStorage (kada se user uloguje/izloguje)
    const handleStorageChange = () => {
      ThemeManager.applyTheme();
    };
    
    // Listener za promene u user session-u
    const handleUserChange = () => {
      ThemeManager.applyTheme();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userChanged', handleUserChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, []);

  // Re-apply theme when location changes (route change)
  useEffect(() => {
    ThemeManager.applyTheme();
  }, [location.pathname]);

  // Check if current route should hide navbar (login/register pages)
  const hideNavbar = ['/login', '/register'].includes(location.pathname);

  // Check if current route should hide breadcrumbs
  const hideBreadcrumbs = ['/login', '/register', '/'].includes(location.pathname) || location.pathname === '';

  return (
    <div className="main-layout">
      {/* Header section with Navbar and Breadcrumbs */}
      {!hideNavbar && (
        <header className="main-header">
          <Navbar />
          {!hideBreadcrumbs && <Breadcrumbs />}
        </header>
      )}
      
      {/* Main content area */}
      <main className={`main-content ${hideNavbar ? 'no-navbar' : 'with-navbar'} ${!hideBreadcrumbs && !hideNavbar ? 'with-breadcrumbs' : 'no-breadcrumbs'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;