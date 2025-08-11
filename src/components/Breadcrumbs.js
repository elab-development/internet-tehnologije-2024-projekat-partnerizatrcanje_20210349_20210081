// components/Breadcrumbs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Route name mappings
  const routeNames = {
    'home': 'Početna',
    'profile': 'Profil',
    'create-plan': 'Kreiraj plan',
    'challenges': 'Izazovi',
    'races': 'Biznis trke',
    'create-challenge': 'Kreiraj izazov',
    'create-race': 'Kreiraj trku'
  };

  // Icons for routes
  const routeIcons = {
    'home': '🏠',
    'profile': '👤',
    'create-plan': '📝',
    'challenges': '🎯',
    'races': '🏃‍♂️',
    'create-challenge': '⚡',
    'create-race': '🏁'
  };

  // Don't show breadcrumbs on login/register pages
  if (pathnames.length === 0 || ['login', 'register'].includes(pathnames[0])) {
    return null;
  }

  return (
    <nav className="breadcrumbs">
      <div className="breadcrumb-container">
        <ol className="breadcrumb-list">
          <li className="breadcrumb-item">
            <Link to="/home" className="breadcrumb-link home-link">
              🏠 Početna
            </Link>
          </li>
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
            const icon = routeIcons[pathname] || '📄';

            return (
              <li key={pathname} className="breadcrumb-item">
                <span className="breadcrumb-separator">›</span>
                {isLast ? (
                  <span className="breadcrumb-current">
                    {icon} {displayName}
                  </span>
                ) : (
                  <Link to={routeTo} className="breadcrumb-link">
                    {icon} {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;