import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../../components/Loading/Loading';
import { 
  faBook, 
  faEdit, 
  faTrash, 
  faGlobe, 
  faLink 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './InformativeResourceDetail.css';
import { API } from '../../services/api';

const InformativeResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    topic: '',
    platform: '',
    description: '',
    type: 0,
    userId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`${API}/InformativeResource/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el recurso');
        }
        const data = await response.json();
        setResource(data);
        setFormData({
          name: data.name,
          image: data.image || '',
          topic: data.topic,
          platform: data.platform || '',
          description: data.description,
          type: data.type,
          userId: data.userId
        });
      } catch (err) {
        setError("Error al cargar el recurso");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      if (!formData.name || !formData.topic || !formData.description) {
        setError('Por favor complete todos los campos requeridos');
        setIsSubmitting(false);
        return;
      }

      const resourceData = {
        ...formData,
        userId: resource.userId
      };

      const response = await fetch(`${API}/InformativeResource/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el recurso: ${response.status}`);
      }

      // Intentar obtener la respuesta JSON solo si hay contenido
      let updatedResource;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        updatedResource = await response.json();
      } else {
        // Si no hay JSON, usar los datos del formulario
        updatedResource = {
          ...resource,
          ...formData
        };
      }

      setResource(updatedResource);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar el recurso');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`${API}/InformativeResource/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el recurso');
      }

      navigate('/informative-resource');
    } catch (err) {
      setError(err.message || 'Error al eliminar el recurso');
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 0: return 'Libro';
      case 1: return 'Documental';
      case 2: return 'Recurso Web';
      default: return 'Desconocido';
    }
  };

  const getImageUrl = () => {
    if (!resource.image) return image;
    return resource.image;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!resource) {
    return <div className="error-container">Recurso no encontrado</div>;
  }

  return (
    <div className="informative-resource-detail-container">
      <div className="informative-resource-detail">
        {/* Header de la página */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <div className="header-title-section">
                <h1 className="page-title">{resource.name}</h1>
              </div>
            </div>
            {user && (
              <div className="header-actions">
                <button className="icon-button edit" onClick={() => setIsEditing(!isEditing)} title="Editar recurso">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button delete" onClick={() => setShowDeleteDialog(true)} title="Eliminar recurso">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-section">
            <div className="image-section">
              <img 
                src={getImageUrl()} 
                alt={resource.name}
                className="resource-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = image;
                }}
              />
            </div>
          </div>

          <div className="detail-section">
            <h2>Información del Recurso</h2>
            <div className="contact-info">
              <div className="info-item">
                <FontAwesomeIcon icon={faBook} />
                <strong>Tipo:</strong>
                {isEditing ? (
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="edit-input"
                  >
                    <option value="0">Libro</option>
                    <option value="1">Documental</option>
                    <option value="2">Recurso Web</option>
                  </select>
                ) : (
                  getTypeLabel(resource.type)
                )}
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faBook} />
                <strong>Tema:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  resource.topic
                )}
              </div>
              <div className="info-item">
                <FontAwesomeIcon icon={faLink} />
                <strong>Plataforma:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="edit-input"
                  />
                ) : (
                  resource.platform || 'No especificada'
                )}
              </div>
              
            </div>
          </div>

          <div className="detail-section">
            <h2>Descripción</h2>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="edit-textarea"
                rows="4"
              />
            ) : (
              <p className="description">{resource.description}</p>
            )}
          </div>

          {isEditing && (
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={handleDeleteCancel}
          onConfirm={handleDelete}
          title="Eliminar Recurso"
          message="¿Está seguro de que desea eliminar este recurso? Esta acción no se puede deshacer."
        />
      </div>
    </div>
  );
};

export default InformativeResourceDetail;
