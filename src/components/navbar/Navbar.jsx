import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Logo */}
        <img src="./images/vegan.png" alt="Vegan Logo" className="logo" />
        {/* Menú hamburguesa alineado a la derecha */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
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
            <a href="#">Iniciar sesión</a>
          </li>
          <li>
            <a href="#">Explorar</a>
          </li>
          <li>
            <a href="#">Mi usuario</a>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
