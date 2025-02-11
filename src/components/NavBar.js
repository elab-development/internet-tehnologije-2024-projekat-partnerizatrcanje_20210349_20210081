import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Uvezi CSS fajl za stilizaciju

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">SprintLink</h1>
        <ul className="nav-links">
          <li><Link to="/home">Početna</Link></li>
          <li><Link to="/running-plans">Planovi trčanja</Link></li>
          <li><Link to="/feed">Feed</Link></li>
          <li><Link to="/profile">Profil</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

