import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faHome, faStore, faHandsHelping, faUserMd, faBook, faInfoCircle, faComments, faSignOutAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import LogoutConfirmation from '../LogoutConfirmation/LogoutConfirmation';
import './Navbar.css';
import veganLogo from '../../assets/img/vegan.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirmation(false);
    navigate('/signin');
  };

  const navLinks = [
    { to: "/", label: "Inicio", icon: faHome },
    { to: "/business", label: "Negocios", icon: faStore },
    { to: "/activism", label: "Activismos", icon: faHandsHelping },
    { to: "/healthprofessional", label: "Profesionales", icon: faUserMd },
    { to: "/informativeresource", label: "Recursos", icon: faBook },
    { to: "/about", label: "Nosotras", icon: faInfoCircle },
    { to: "/comments", label: "Contacto", icon: faComments },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src={veganLogo} alt="Logo" className="logo" />
        </Link>

        <button
          className={`menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="menu-list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={closeMenu}
                  className={location.pathname === link.to ? 'active' : ''}
                >
                  <FontAwesomeIcon icon={link.icon} />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
            {user && role ? (
              <>
                {role === 'Sysadmin' && (
                  <li>
                    <Link to="/users" onClick={closeMenu} className={location.pathname === '/users' ? 'active' : ''}>
                      <FontAwesomeIcon icon={faUser} />
                      <span>Usuarios</span>
                    </Link>
                  </li>
                )}
                {role === 'Sysadmin' && (
                  <li>
                    <Link to="/reports" onClick={closeMenu} className={location.pathname === '/reports' ? 'active' : ''}>
                      <FontAwesomeIcon icon={faChartBar} />
                      <span>Reportes</span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/User" onClick={closeMenu} className="profile-link">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Mi Perfil</span>
                  </Link>
                </li>
                <li>
                  <button 
                    className="logout-button" 
                    onClick={() => {
                      setShowLogoutConfirmation(true);
                      closeMenu();
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/signin" onClick={closeMenu} className="signin-link">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Iniciar Sesión</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {showLogoutConfirmation && (
        <LogoutConfirmation
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirmation(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
