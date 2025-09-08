import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/Logo1.png';
import handprint from '../assets/handprint.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isNavActive, setIsNavActive] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'guest';

  // Funkcija koja otvara i zatvara mobilni meni
  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  // Efekat koji osigurava da se meni automatski zatvori kada korisnik klikne na link i promeni stranicu
  useEffect(() => {
    setIsNavActive(false);
  }, [location]);

  // Kompletna funkcija za logout
  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token');
    
    if (user && user.role === 'guest') {
      try {
        await fetch('http://localhost:8000/api/delete-guest-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Greška pri brisanju guest naloga:', error);
      }
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    document.body.classList.remove('admin-theme');
    navigate('/login');
  };

  // Kompletna funkcija koja renderuje različite linkove za različite korisnike
  const renderMenuItems = () => {
    if (userRole === 'admin') {
      return (
        <>
          <li><Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>Početna</Link></li>
          <li><Link to="/create-challenge" className={location.pathname === '/create-challenge' ? 'active' : ''}>Kreiraj izazove</Link></li>
          <li><Link to="/create-race" className={location.pathname === '/create-race' ? 'active' : ''}>Kreiraj biznis trke</Link></li>
        </>
      );
    } else {
      return (
        <>
          <li><Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>{userRole === 'guest' ? 'Pregled postova' : 'Početna'}</Link></li>
          {userRole !== 'guest' && (<li><Link to="/create-plan" className={location.pathname === '/create-plan' ? 'active' : ''}>Planovi trčanja</Link></li>)}
          {userRole !== 'guest' && (<li><Link to="/challenges" className={location.pathname === '/challenges' ? 'active' : ''}>Izazovi</Link></li>)}
          {userRole !== 'guest' && (<li><Link to="/races" className={location.pathname === '/races' || location.pathname === '/Races' ? 'active' : ''}>Biznis trke</Link></li>)}
          {userRole !== 'guest' && (<li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profil</Link></li>)}
        </>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-container">
          <img src={handprint} alt="Crvena Šaka" className="handprint" />
          <img src={logo} alt="SprintLink Logo" className="logo" />
        </div>
        
        {/* Lista linkova koja se na desktopu vidi, a na mobilnom postaje padajući meni */}
        <ul className={isNavActive ? 'nav-links active' : 'nav-links'}>
          {renderMenuItems()}
        </ul>

        {/* Sekcija sa desne strane koja sadrži logout dugme i burger meni */}
        <div className="controls-section">
            <div className="user-section">
                <button className="logout-button" onClick={handleLogout}>
                    Izloguj se
                </button>
            </div>
            <button className="burger-menu" onClick={toggleNav} aria-label="Toggle navigation">
              <FontAwesomeIcon icon={isNavActive ? faTimes : faBars} />
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;