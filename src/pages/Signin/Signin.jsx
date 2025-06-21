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
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API}/User/authorization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      const token = data.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));

      localStorage.setItem('token', token);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('userId', decoded.userId);

      setUser(decoded);
      setRole(decoded.role || "");
      setId(decoded.userId);

      navigate('/');
    } catch (err) {
      setError('Error en el inicio de sesión');
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
