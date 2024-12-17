import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Guía Vegana</Link>
      </div>
      <div className="navbar-menu-icon" onClick={toggleMobileMenu}>
        <i className={isMobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <li>
          <Link to="/business" onClick={toggleMobileMenu}>
            Bares y Restaurantes
          </Link>
        </li>
        <li>
          <Link to="/business" onClick={toggleMobileMenu}>
            Panaderías
          </Link>
        </li>
        <li>
          <Link to="/business" onClick={toggleMobileMenu}>
            Heladerías
          </Link>
        </li>
        <li>
          <Link to="/business" onClick={toggleMobileMenu}>
            Emprendimientos
          </Link>
        </li>
        <li>
          <Link to="/business" onClick={toggleMobileMenu}>
            Mercados y Dietéticas
          </Link>
        </li>
        <li>
          <Link to="/resources" onClick={toggleMobileMenu}>
            Recursos Informativos
          </Link>
        </li>
        <li>
          <Link to="/health" onClick={toggleMobileMenu}>
            Médicos y Nutricionistas
          </Link>
        </li>
        <li>
          <Link to="/activism" onClick={toggleMobileMenu}>
            Activismos
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
