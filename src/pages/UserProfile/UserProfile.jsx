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
    if (authUser && authUser.id) {
      fetchUserData();
    } else {
      setLoading(false);
      setError("No hay usuario autenticado");
    }
  }, [authUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userId = authUser.id || authUser.userId || authUser.user_id;
      
      const response = await fetch(`${API}/User/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos del usuario');
      }

      const userData = await response.json();
      setUser(userData);
      setEditForm({
        name: userData.name || "",
        email: userData.email || ""
      });
    } catch (err) {
      setError("Error al cargar los datos del usuario");
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
      const userId = authUser.id || authUser.userId || authUser.user_id;
      
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

  if (!user) {
    return (
      <div className="error-container">
        <h2>Usuario no encontrado</h2>
        <p>No se pudieron cargar los datos del usuario.</p>
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
              <div className="header-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="header-title-section">
                <h1 className="page-title">Mi Perfil</h1>
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

            <div className="profile-info">
              {updateError && (
                <div className="error-message">
                  <p>{updateError}</p>
                </div>
              )}

              {updateSuccess && (
                <div className="success-message">
                  <p>{updateSuccess}</p>
                </div>
              )}

              <div className="info-section">
                <div className="info-item">
                  <div className="info-label">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Nombre</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Ingrese su nombre"
                    />
                  ) : (
                    <div className="info-value">{user.name}</div>
                  )}
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Email</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Ingrese su email"
                    />
                  ) : (
                    <div className="info-value">{user.email}</div>
                  )}
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    <span>Rol</span>
                  </div>
                  <div className="info-value">
                    {getRoleDisplayName(user.role)}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <span>Estado</span>
                  </div>
                  <div className="info-value">
                    {user.isActive ? (
                      <span className="status-badge active">Activo</span>
                    ) : (
                      <span className="status-badge inactive">Inactivo</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <div className="edit-actions">
                    <button
                      onClick={handleSave}
                      disabled={updateLoading}
                      className="save-btn"
                    >
                      {updateLoading ? (
                        <div className="button-loading">
                          <Loading />
                          <span>Guardando...</span>
                        </div>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      <FontAwesomeIcon icon={faTimes} />
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEdit} className="edit-btn">
                    <FontAwesomeIcon icon={faEdit} />
                    Editar Perfil
                  </button>
                )}

                <button onClick={handleLogout} className="logout-btn">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
