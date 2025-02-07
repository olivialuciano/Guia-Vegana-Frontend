import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Dsp armamos un logo mejor jasja */}
        <img src="./images/vegan.png" alt="Vegan Logo" className="logo" />
        {/* Rol de usuario si está logueado */}
        <span className="user-role">ADMIN</span>
        {/* Ahora esta hardcodeado xq no me puse con la logica, pero la idea es q traiga la variable user y si esta logueado que el span deje de ser hidden */}
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon
            icon={faBars}
            style={{ fontSize: "2rem", color: "#000000" }}
          />
        </button>
      </div>

      {/* A este le deje esos li porque todavia no se cuales va a tener */}
      {menuOpen && (
        <ul className="menu">
          <li>
            <a href="#">Inicio</a>
          </li>
          <li>
            <a href="#">Iniciar sesión</a>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
