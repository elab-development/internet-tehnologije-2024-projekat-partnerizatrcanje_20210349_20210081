import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Uvezi CSS fajl za stilizaciju
import logo from '../assets/Logo1.png'; // Importujte sliku

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <img src={logo} alt="SprintLink Logo" className="logo" /> {/* Dodajte logo sliku */}
        <ul className="nav-links">
          <li><Link to="/home">Početna</Link></li>
          <li><Link to="/create-plan">Planovi trčanja</Link></li>
          <li><Link to="/my-plans">Moji Planovi</Link></li>
          <li><Link to="/Races">Virtuelne trke</Link></li>
          <li><Link to="/profile">Profil</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


