import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import { faUser, faLink, faEdit, faTrash, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultImage from '../../assets/img/defaultprofileimage.jpg';
import './ActivismDetail.css';

const ActivismDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activism, setActivism] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivism = async () => {
      try {
        const response = await fetch(`https://localhost:7032/api/Activism/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el activismo');
        }
        const data = await response.json();
        setActivism(data);
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
    navigate(`/activism/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este activismo?')) {
      try {
        const response = await fetch(`https://localhost:7032/api/Activism/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el activismo');
        }

        navigate('/activism');
      } catch (err) {
        setError('Error al eliminar el activismo');
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

  if (!activism) {
    return <div className="error-container">Actividad no encontrada</div>;
  }

  return (
    <div className="activism-detail">
      <Header 
        title={activism.name}
        icon={faUser}
        showRating={false}
        rating={null}
      />
      
      <div className="detail-content">
        <div className="detail-section">
          <div className="image-section">
            <img 
              src={activism.image || defaultImage} 
              alt={activism.name}
              className="activism-image"
            />
          </div>
        </div>

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

        {user?.role === 'Admin' && (
          <div className="admin-actions">
            <button className="edit-button" onClick={handleEdit}>
              <FontAwesomeIcon icon={faEdit} />
              Editar Actividad
            </button>
            <button className="delete-button" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
              Eliminar Actividad
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivismDetail;
