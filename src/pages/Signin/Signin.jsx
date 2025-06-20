import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading/Loading";
import "./Signin.css";
import { API } from '../../services/api';

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setRole, setId } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/User/authorization`,
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

      // Extraer el ID del usuario de diferentes campos posibles
      const userId = decoded.nameid || decoded.sub || decoded.userId || decoded.id || decoded.user_id;
      
      if (!userId) {
        console.error('Payload del token:', decoded);
        throw new Error('No se pudo obtener el ID del usuario del token');
      }

      // Guardar token y claims en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", decoded.role);
      localStorage.setItem("userId", userId);

      // Actualizar el contexto de autenticación
      setUser(decoded);
      setRole(decoded.role || "");
      setId(userId);

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
                <div className="button-loading">
                  <Loading />
                  <span>Iniciando sesión...</span>
                </div>
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
