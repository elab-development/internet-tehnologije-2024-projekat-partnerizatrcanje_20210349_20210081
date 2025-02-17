import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Uvezi CSS fajl za stilizaciju
import logo from '../assets/Logo1.png'; // Importujte sliku

const Navbar = () => {
  const location = useLocation(); // Koristimo useLocation za praćenje trenutne stranice

  return (
    <nav className="navbar">
      <div className="nav-container">
        <img src={logo} alt="SprintLink Logo" className="logo" /> {/* Dodajte logo sliku */}
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
              Virtuelne trke
            </Link>
          </li>
          <li>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Profil
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;



