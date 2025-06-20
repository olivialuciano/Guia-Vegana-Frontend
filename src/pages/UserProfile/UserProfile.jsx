import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading/Loading";
import { 
  faUser, 
  faEnvelope, 
  faShieldAlt, 
  faCheckCircle, 
  faTimesCircle,
  faSignOutAlt,
  faEdit,
  faSave,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./UserProfile.css";
import { API } from '../../services/api';

const UserProfile = () => {
  const { user: authUser, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) {
      navigate("/signin");
      return;
    }

    console.log("AuthUser data:", authUser); // Debug log
    fetchUserData();
  }, [authUser, navigate]);

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data for:", authUser); // Debug log
      
      // Verificar que tenemos los datos básicos del usuario
      if (!authUser) {
        throw new Error("No se encontraron datos del usuario en el contexto");
      }

      // Extraer el ID del usuario (puede estar en diferentes propiedades)
      const userId = authUser.userId || authUser.id || authUser.user_id;
      const userRole = authUser.role;

      if (!userId) {
        throw new Error("No se encontró el ID del usuario");
      }

      console.log("User ID:", userId, "Role:", userRole); // Debug log

      // Si el usuario es Sysadmin, usar el endpoint de la API
      if (userRole === 'Sysadmin') {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API}/User/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error("Error al cargar los datos del usuario desde la API");
        }
        
        const userData = await response.json();
        console.log("API user data:", userData); // Debug log
        setUser(userData);
        setEditForm({
          name: userData.name,
          email: userData.email
        });
      } else {
        // Si es Investigador, usar datos del contexto con valores por defecto
        const userData = {
          id: userId,
          name: "", // Valor por defecto
          email: "", // Valor por defecto
          isActive: true,
          role: userRole
        };
        
        console.log("Default user data:", userData); // Debug log
        setUser(userData);
        setEditForm({
          name: userData.name,
          email: userData.email
        });
      }
    } catch (err) {
      console.error("Error in fetchUserData:", err); // Debug log
      setError("Error al cargar los datos del usuario: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateError("");
    setUpdateSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user.name,
      email: user.email
    });
    setUpdateError("");
    setUpdateSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setUpdateError("Todos los campos son obligatorios");
      return;
    }

    if (!editForm.email.includes('@')) {
      setUpdateError("El email debe ser válido");
      return;
    }

    setUpdateLoading(true);
    setUpdateError("");
    setUpdateSuccess("");

    try {
      const token = localStorage.getItem('token');
      const userId = authUser.userId || authUser.id || authUser.user_id;
      
      const response = await fetch(`${API}/User`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: parseInt(userId),
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          isActive: true,
          role: authUser.role === 'Sysadmin' ? 0 : 1
        })
      });

      if (response.ok) {
        setUpdateSuccess("Perfil actualizado exitosamente");
        // Actualizar el estado local
        setUser(prev => ({
          ...prev,
          name: editForm.name.trim(),
          email: editForm.email.trim()
        }));
        setIsEditing(false);
        setTimeout(() => {
          setUpdateSuccess("");
        }, 3000);
      } else {
        const errorData = await response.json();
        setUpdateError(errorData.message || "Error al actualizar el perfil");
      }
    } catch (err) {
      setUpdateError("Error de conexión. Verifique su conexión a internet.");
      console.error("Error:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 0:
        return 'Sysadmin';
      case 1:
        return 'Investigador';
      default:
        return role;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="back-btn">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile">
        {/* Header de la página */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              
              <div className="header-title-section">
                <h1 className="page-title">Perfil de usuario de {user.name}</h1>        
              </div>
            </div>
           
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="profile-status">
                {user.isActive ? (
                  <FontAwesomeIcon icon={faCheckCircle} className="status-active" />
                ) : (
                  <FontAwesomeIcon icon={faTimesCircle} className="status-inactive" />
                )}
              </div>
            </div>

            {updateError && (
              <div className="error-message">
                <FontAwesomeIcon icon={faTimesCircle} />
                {updateError}
              </div>
            )}

            {updateSuccess && (
              <div className="success-message">
                <FontAwesomeIcon icon={faCheckCircle} />
                {updateSuccess}
              </div>
            )}

            <div className="profile-info">
              <div className="info-group">
                <label>
                  <FontAwesomeIcon icon={faUser} />
                  Nombre
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    placeholder="Ingrese su nombre"
                  />
                ) : (
                  <span className="info-value">{user.name}</span>
                )}
              </div>

              <div className="info-group">
                <label>
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    placeholder="usuario@ejemplo.com"
                  />
                ) : (
                  <span className="info-value">{user.email}</span>
                )}
              </div>

              <div className="info-group">
                <label>
                  <FontAwesomeIcon icon={faShieldAlt} />
                  Rol
                </label>
                <span className="info-value">{getRoleDisplayName(user.role)}</span>
              </div>

              <div className="info-group">
                <label>Estado</label>
                <span className={`info-value status ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button 
                    className="action-btn cancel-btn"
                    onClick={handleCancel}
                    disabled={updateLoading}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    Cancelar
                  </button>
                  <button 
                    className="action-btn save-btn"
                    onClick={handleSave}
                    disabled={updateLoading}
                  >
                    <FontAwesomeIcon icon={faSave} />
                    {updateLoading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              ) : (
                <div className="view-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={handleEdit}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Editar Perfil
                  </button>
                  <button 
                    className="action-btn logout-btn"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
