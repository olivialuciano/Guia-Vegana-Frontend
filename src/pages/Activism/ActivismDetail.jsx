import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import { faUser, faLink, faEdit, faTrash, faPhone, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import image from '../../assets/img/image.png';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { API } from '../../services/api';
import './ActivismDetail.css';

const ActivismDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activism, setActivism] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivism, setEditedActivism] = useState(null);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  useEffect(() => {
    const fetchActivism = async () => {
      try {
        const response = await fetch(`${API}/Activism/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el activismo');
        }
        const data = await response.json();
        setActivism(data);
        setEditedActivism(data);
      } catch (err) {
        setError('Error al cargar el activismo');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivism();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedActivism(activism);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`${API}/Activism/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedActivism)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al actualizar el activismo');
      }

      let updatedActivism;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          updatedActivism = await response.json();
        } catch (e) {
          console.warn('No se pudo parsear la respuesta JSON:', e);
          updatedActivism = editedActivism;
        }
      } else {
        updatedActivism = editedActivism;
      }

      setActivism(updatedActivism);
      setEditedActivism(updatedActivism);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar el activismo');
      console.error('Error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedActivism(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`${API}/Activism/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el activismo');
      }

      navigate('/activism');
    } catch (err) {
      setError('Error al eliminar el activismo');
      console.error('Error:', err);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const getImageUrl = () => {
    if (!activism.image) return image;
    return activism.image;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!activism) {
    return <div className="error-container">Actividad no encontrada</div>;
  }

  return (
    <div className="activism-detail">
      <Header 
        title={activism.name}
        icon={faHandHoldingHeart}
        showRating={false}
        rating={null}
      >
        {canEdit && (
          <div className="header-actions">
            <button className="icon-button edit" onClick={handleEdit} title="Editar activismo">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="icon-button delete" onClick={handleDelete} title="Eliminar activismo">
              <FontAwesomeIcon icon={faTrash} />
            </button>
      </div>
        )}
      </Header>

      <div className="detail-content">
        <div className="detail-section">
          <div className="image-section">
            <img 
              src={getImageUrl()} 
              alt={activism.name}
              className="activism-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = image;
              }}
            />
          </div>
        </div>

        {isEditing ? (
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedActivism.name}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre del activismo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">URL de la imagen</label>
              <input
                type="url"
                id="image"
                name="image"
                value={editedActivism.image || ''}
                onChange={handleInputChange}
                placeholder="Ingrese la URL de la imagen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contacto</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={editedActivism.contact}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el contacto"
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialMediaUsername">Usuario en redes sociales</label>
              <input
                type="text"
                id="socialMediaUsername"
                name="socialMediaUsername"
                value={editedActivism.socialMediaUsername}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el usuario de redes sociales"
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialMediaLink">Enlace de redes sociales</label>
              <input
                type="url"
                id="socialMediaLink"
                name="socialMediaLink"
                value={editedActivism.socialMediaLink}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el enlace de redes sociales"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={editedActivism.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Ingrese la descripción"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="submit" className="save-button">
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="detail-section">
              <h2>Información de Contacto</h2>
              <div className="contact-info">
                <div className="info-item">
                  <FontAwesomeIcon icon={faPhone} />
                  {activism.contact}
                </div>
                <div className="info-item">
                  <FontAwesomeIcon icon={faUser} />
                  {activism.socialMediaUsername}
                </div>
                <div className="info-item">
                  <FontAwesomeIcon icon={faLink} />
                  {' '}
                  <a 
                    href={activism.socialMediaLink} 
          target="_blank"
          rel="noopener noreferrer"
                  >
                    {activism.socialMediaLink}
                  </a>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2>Descripción</h2>
              <p className="description">{activism.description}</p>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title="Eliminar Activismo"
        message="¿Estás seguro de que deseas eliminar este activismo?"
      />
    </div>
  );
};

export default ActivismDetail;
