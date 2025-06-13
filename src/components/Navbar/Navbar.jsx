import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faHome, faStore, faHandsHelping, faUserMd, faBook, faInfoCircle, faComments, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { authService } from '../../services/authService';
import LogoutConfirmation from '../LogoutConfirmation/LogoutConfirmation';
import './Navbar.css';
import veganLogo from '../../assets/img/vegan.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { role, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  useEffect(() => {
    // Verificar autenticación al montar el componente
    setIsAuthenticated(authService.isAuthenticated());

    // Configurar un intervalo para verificar la expiración del token
    const checkAuthInterval = setInterval(() => {
      const isStillAuthenticated = authService.isAuthenticated();
      if (!isStillAuthenticated && isAuthenticated) {
        setIsAuthenticated(false);
        navigate('/signin');
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(checkAuthInterval);
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
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
                <li>
                  <Link to="/mi-usuario" onClick={closeMenu} className="profile-link">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Mi Perfil</span>
                  </Link>
                </li>
                <li>
                  <button 
                    className="logout-button"
                    onClick={() => setShowLogoutConfirmation(true)}
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
