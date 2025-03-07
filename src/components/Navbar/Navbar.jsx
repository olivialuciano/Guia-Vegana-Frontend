import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import veganLogo from "../../assets/img/vegan.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Si hay token, el usuario está logueado
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/">
          <img src={veganLogo} alt="Vegan Logo" className="logo" />
        </Link>
        <button className="menu-btn" onClick={toggleMenu}>
          <FontAwesomeIcon
            icon={faBars}
            style={{ fontSize: "2rem", color: "#000000" }}
          />
        </button>
      </div>

      {menuOpen && (
        <ul className="menu">
          <li>
            <Link to="/business" onClick={closeMenu}>
              Negocios
            </Link>
          </li>
          <li>
            <Link to="/activism" onClick={closeMenu}>
              Activismos
            </Link>
          </li>
          <li>
            <Link to="/healthprofessional" onClick={closeMenu}>
              Profesionales de la salud
            </Link>
          </li>
          <li>
            <Link to="/informativeresource" onClick={closeMenu}>
              Recursos informativos
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>
              Sobre nosotras
            </Link>
          </li>
          <li>
            <Link to="/comments" onClick={closeMenu}>
              ¡Comunicate con nosotras!
            </Link>
          </li>

          {isLoggedIn ? (
            <li>
              <Link to="/mi-usuario" onClick={closeMenu}>
                Mi Perfil
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/signin" onClick={closeMenu}>
                Iniciar Sesión
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
