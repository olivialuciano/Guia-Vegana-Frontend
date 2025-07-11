import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading/Loading";
import NewUserForm from "../../components/NewUserForm/NewUserForm";
import { 
  faUsers, 
  faPlus, 
  faUser, 
  faEnvelope, 
  faShieldAlt, 
  faCheckCircle, 
  faTimesCircle,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./User.css";
import { API, apiFetch } from '../../services/api';

const User = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`${API}/User`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    fetchUsers(); // recargar la lista luego de crear un nuevo usuario
  };

  const handleActivateUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`${API}/User/activate/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchUsers(); // recargar la lista
      } else {
        throw new Error(`Error al activar usuario: ${response.status}`);
      }
    } catch (error) {
      setError("Error al activar usuario: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiFetch(`${API}/User/inactivate/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        fetchUsers(); // recargar la lista
      } else {
        throw new Error(`Error al inactivar usuario: ${response.status}`);
      }
    } catch (error) {
      setError("Error al inactivar usuario: " + error.message);
    } finally {
      setLoading(false);
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
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="user-container">
      <div className="user-list">
        <div className="list-content">
          {/* Header de la página */}
          <div className="page-header">
            <h1 className="page-title">Gestión de Usuarios</h1>
            {/* Barra de acciones */}
            <div className="actions-bar">
              <div className="admin-actions">
                {canEdit && (
                  <button className="add-button" onClick={handleOpenForm}>
                    <FontAwesomeIcon icon={faPlus} />
                    Agregar Usuario
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="users-stats">
            <p>Total de usuarios: {users.length}</p>
            <p>Usuarios activos: {users.filter(u => u.isActive).length}</p>
            <p>Usuarios inactivos: {users.filter(u => !u.isActive).length}</p>
          </div>

          {users.length === 0 ? (
            <div className="no-results">
              <p>No hay usuarios registrados.</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((userItem) => (
                <div key={userItem.id} className={`user-card ${!userItem.isActive ? 'inactive' : ''}`}>
                  <div className="user-header">
                    <div className="user-avatar">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="user-status">
                      {userItem.isActive ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="status-active" />
                      ) : (
                        <FontAwesomeIcon icon={faTimesCircle} className="status-inactive" />
                      )}
                    </div>
                  </div>
                  
                  <div className="user-info">
                    <h3 className="user-name">{userItem.name}</h3>
                    <div className="user-email">
                      <FontAwesomeIcon icon={faEnvelope} />
                      <span>{userItem.email}</span>
                    </div>
                    <div className="user-role">
                      <FontAwesomeIcon icon={faShieldAlt} />
                      <span>{getRoleDisplayName(userItem.role)}</span>
                    </div>
                  </div>

                  <div className="user-actions">
                    {userItem.isActive ? (
                      <button 
                        className="action-btn deactivate-btn"
                        onClick={() => handleInactivateUser(userItem.id)}
                        title="Desactivar usuario"
                      >
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </button>
                    ) : (
                      <button 
                        className="action-btn activate-btn"
                        onClick={() => handleActivateUser(userItem.id)}
                        title="Activar usuario"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && <NewUserForm onClose={handleCloseForm} />}
      </div>
    </div>
  );
};

export default User; 