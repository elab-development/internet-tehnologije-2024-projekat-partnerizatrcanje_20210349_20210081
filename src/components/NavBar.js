import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Početna</Link></li>
        <li><Link to="/create-plan">Kreiraj Plan</Link></li>
        <li><Link to="/my-plans">Moji Planovi</Link></li>
        <li><Link to="/races">Virtuelne Trke</Link></li> {/* NOVO */}
        <li><Link to="/profile">Profil</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
