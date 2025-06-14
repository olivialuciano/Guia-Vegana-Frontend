import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import "./Signin.css";

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7032/api/User/authorization",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const token = await response.text();
      
      // Decodificar el token
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded);

      // Guardar token y claims en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", decoded.role);
      localStorage.setItem("userId", decoded.userId);

      // Redirigir según el rol
      if (decoded.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-content">
        <div className="signin-header">
          <FontAwesomeIcon icon={faLeaf} className="logo-icon" />
          <h1>Guía Vegana</h1>
          <p className="welcome-text">Bienvenido de nuevo</p>
        </div>

        <div className="signin-box">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="input-group">
              <label>
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="input-group">
              <label>
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className={`signin-button ${loading ? 'loading' : ''}`} 
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
