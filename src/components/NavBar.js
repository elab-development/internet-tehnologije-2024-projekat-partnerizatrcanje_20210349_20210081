import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/Logo1.png';
import handprint from '../assets/handprint.png';

const Navbar = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  
  // Dohvati korisnika iz localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'guest';

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token');
    
    console.log('User data:', user);
    console.log('Token:', token);
    
    if (user && user.role === 'guest') {
      try {
        console.log('Attempting to delete guest account...');
        
        const response = await fetch('http://localhost:8000/api/delete-guest-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const responseData = await response.json();
        console.log('Response:', responseData);
        
      } catch (error) {
        console.error('Greška pri brisanju guest naloga:', error);
      }
    }
    
    // Obriši podatke iz localStorage-a
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-container">
          <img src={handprint} alt="Crvena Šaka" className="handprint" />
          <img src={logo} alt="SprintLink Logo" className="logo" />
        </div>
        
        <ul className="nav-links">
          {/* Početna (Feed) - dostupna svima uključujući i guest */}
          <li>
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
              {userRole === 'guest' ? 'Pregled postova' : 'Početna'}
            </Link>
          </li>

          {/* Planovi trčanja - samo registrovani korisnici (ne guest) */}
          {userRole !== 'guest' && (
            <li>
              <Link to="/create-plan" className={location.pathname === '/create-plan' ? 'active' : ''}>
                Planovi trčanja
              </Link>
            </li>
          )}

          {/* Izazovi - admin može kreirati, user može pristupiti, guest ne može */}
          {userRole !== 'guest' && (
            <li>
              <Link to="/challenges" className={location.pathname === '/challenges' ? 'active' : ''}>
                {userRole === 'admin' ? 'Upravljaj izazovima' : 'Izazovi'}
              </Link>
            </li>
          )}

          {/* Biznis trke - admin može kreirati, user može pristupiti, guest ne može */}
          {userRole !== 'guest' && (
            <li>
              <Link to="/races" className={location.pathname === '/races' || location.pathname === '/Races' ? 'active' : ''}>
                {userRole === 'admin' ? 'Upravljaj trkama' : 'Biznis trke'}
              </Link>
            </li>
          )}

          {/* Profil - dostupan svima osim gostima */}
          {userRole !== 'guest' && (
            <li>
              <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                Profil
              </Link>
            </li>
          )}
          
          {/* Admin panel - samo za adminе */}
          {userRole === 'admin' && (
            <li>
              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        {/* User info i logout */}
        <div className="user-section">
          <span className="user-info">
            {user.name || 'Korisnik'} ({userRole === 'guest' ? 'Gost' : userRole === 'admin' ? 'Admin' : 'Korisnik'})
          </span>
          <button className="logout-button" onClick={handleLogout}>
            Izloguj se
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;