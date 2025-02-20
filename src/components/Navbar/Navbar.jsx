import { useState } from "react";
import { Link } from "react-router-dom"; // Importa Link para la navegación
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import veganLogo from "../../assets/img/vegan.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false); // Cierra el menú al hacer clic en una opción

  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Logo */}
        <img src={veganLogo} alt="Vegan Logo" className="logo" />

        {/* Menú hamburguesa alineado a la derecha */}
        <button className="menu-btn" onClick={toggleMenu}>
          <FontAwesomeIcon
            icon={faBars}
            style={{ fontSize: "2rem", color: "#000000" }}
          />
        </button>
      </div>

      {/* Menú desplegable */}
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
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
