import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { 
  faTimes, 
  faUser, 
  faEnvelope, 
  faLock, 
  faShieldAlt,
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./NewUserForm.css";
import { API } from '../../services/api';

const NewUserForm = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Investigador",
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Verificar si el usuario tiene permisos
  if (user?.role !== "Sysadmin") {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!formData.email.trim()) {
      setError("El email es obligatorio");
      return false;
    }
    if (!formData.email.includes('@')) {
      setError("El email debe ser válido");
      return false;
    }
    if (!formData.password) {
      setError("La contraseña es obligatoria");
      return false;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/User`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive
        })
      });

      if (response.ok) {
        setSuccess("Usuario creado exitosamente");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "Investigador",
          isActive: true
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al crear el usuario");
      }
    } catch (err) {
      setError("Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>
            <FontAwesomeIcon icon={faUser} />
            Nuevo Usuario
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {error && (
            <div className="error-message">
              <FontAwesomeIcon icon={faTimesCircle} />
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <FontAwesomeIcon icon={faCheckCircle} />
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">
              <FontAwesomeIcon icon={faUser} />
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faEnvelope} />
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} />
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FontAwesomeIcon icon={faLock} />
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repita la contraseña"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <FontAwesomeIcon icon={faShieldAlt} />
              Rol *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="Investigador">Investigador</option>
              <option value="Sysadmin">Administrador del Sistema</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Usuario Activo
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewUserForm; 