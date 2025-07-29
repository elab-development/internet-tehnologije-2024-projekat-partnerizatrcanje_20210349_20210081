import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css'; // Uvezi CSS fajl za stilizaciju
import logo from '../assets/Logo1.png'; // Importuj logo
import handprint from '../assets/handprint.png'; // Importuj sliku crvene šake

const Navbar = () => {
  const location = useLocation(); 
  const navigate = useNavigate();

const handleLogout = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('auth_token'); // Promeni 'token' u 'auth_token'
  
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
  localStorage.removeItem('auth_token'); // I ovde promeni
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
          <li>
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
              Početna
            </Link>
          </li>
          <li>
            <Link to="/create-plan" className={location.pathname === '/create-plan' ? 'active' : ''}>
              Planovi trčanja
            </Link>
          </li>
          <li>
            <Link to="/challenges" className={location.pathname === '/challenges' ? 'active' : ''}>
              Izazovi
            </Link>
          </li>
          <li>
            <Link to="/Races" className={location.pathname === '/Races' ? 'active' : ''}>
              Biznis trke
            </Link>
          </li>
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Profil
            </Link>
          </li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Izloguj se
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
