import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // Importamos el CSS externo

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="error-code">404</h1>
      <p className="error-text">Oops... Página no encontrada</p>
      <p className="error-message">
        Parece que la página que buscas no existe.
      </p>
      <Link to="/" className="home-button">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
