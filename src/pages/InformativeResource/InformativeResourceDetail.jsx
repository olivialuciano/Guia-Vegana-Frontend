import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import { faBook, faCalendarAlt, faUser, faLink, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultImage from '../../assets/img/defaultprofileimage.jpg';
import './InformativeResourceDetail.css';

const InformativeResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`https://localhost:7032/api/InformativeResource/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el recurso');
        }
        const data = await response.json();
        setResource(data);
      } catch (err) {
        setError('Error al cargar el recurso informativo');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleEdit = () => {
    navigate(`/informative-resources/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este recurso informativo?')) {
      try {
        const response = await fetch(`https://localhost:7032/api/InformativeResource/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el recurso');
        }

        navigate('/informative-resources');
      } catch (err) {
        setError('Error al eliminar el recurso informativo');
        console.error('Error:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!resource) {
    return <div className="error-container">Recurso no encontrado</div>;
  }

  return (
    <div className="informative-resource-detail">
      <Header 
        title={resource.name}
        icon={faBook}
        backUrl="/informative-resources"
      />
      
      <div className="detail-content">
        <div className="detail-section">
          <div className="image-section">
            <img 
              src={resource.image || defaultImage} 
              alt={resource.name}
              className="resource-image"
            />
          </div>
        </div>

        <div className="detail-section">
          <h2>Información del Recurso</h2>
          <div className="contact-info">
            <div className="info-item">
              <FontAwesomeIcon icon={faBook} />
              <strong>Tipo:</strong> {resource.type}
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faBook} />
              <strong>Tema:</strong> {resource.topic}
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faLink} />
              <strong>Plataforma:</strong> {resource.platform}
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faUser} />
              <strong>Autor:</strong> {resource.user?.name || 'No especificado'}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Descripción</h2>
          <p className="description">{resource.description}</p>
        </div>

        {user?.role === 'Admin' && (
          <div className="admin-actions">
            <button className="edit-button" onClick={handleEdit}>
              <FontAwesomeIcon icon={faEdit} />
              Editar Recurso
            </button>
            <button className="delete-button" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
              Eliminar Recurso
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformativeResourceDetail;
