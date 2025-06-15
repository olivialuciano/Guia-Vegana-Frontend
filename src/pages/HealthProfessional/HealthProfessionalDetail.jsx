import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faGlobe, 
  faEdit, 
  faTrash,
  faGraduationCap,
  faIdCard,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import defaultImage from '../../assets/img/defaultprofileimage.jpg';
import './HealthProfessionalDetail.css';

const HealthProfessionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await fetch(`https://localhost:7032/api/HealthProfessional/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el profesional');
        }
        const data = await response.json();
        setProfessional(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este profesional?')) {
      try {
        const response = await fetch(`https://localhost:7032/api/HealthProfessional/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el profesional');
        }

        navigate('/health-professionals');
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el profesional');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="error-container">
        <p>No se encontró el profesional</p>
      </div>
    );
  }

  return (
    <div className="health-professional-detail">
      <Header 
        title={professional.name}
        icon={faUserMd}
        backUrl="/health-professionals"
        showRating={false}
        rating={null}
      >
        {(user?.role === 'Sysadmin' || user?.role === 'Investigador') && (
          <div className="admin-actions">
            <button 
              className="edit-button"
              onClick={() => navigate(`/health-professionals/edit/${id}`)}
            >
              <FontAwesomeIcon icon={faEdit} />
              Editar
            </button>
            <button 
              className="delete-button"
              onClick={handleDelete}
            >
              <FontAwesomeIcon icon={faTrash} />
              Eliminar
            </button>
          </div>
        )}
      </Header>

      <div className="detail-content">
        <div className="detail-section image-section">
          <img 
            src={professional.image || defaultImage} 
            alt={professional.name}
            className="professional-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>

        <div className="detail-section">
          <h2>Información Profesional</h2>
          <div className="contact-info">
            <div className="info-item">
              <FontAwesomeIcon icon={faGraduationCap} />
              <span><strong>Especialidad:</strong> {professional.specialty}</span>
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faIdCard} />
              <span><strong>Matrícula:</strong> {professional.license}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Información de Contacto</h2>
          <div className="contact-info">
            <div className="info-item">
              <FontAwesomeIcon icon={faPhone} />
              <span><strong>WhatsApp:</strong> {professional.whatsappNumber}</span>
            </div>
            {professional.email && (
              <div className="info-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <span><strong>Email:</strong> {professional.email}</span>
              </div>
            )}
          </div>
        </div>

        {professional.socialMediaUsername && professional.socialMediaLink && (
          <div className="detail-section">
            <h2>Redes Sociales</h2>
            <div className="contact-info">
              <div className="info-item">
                <FontAwesomeIcon icon={faUser} />
                <a 
                  href={professional.socialMediaLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  @{professional.socialMediaUsername}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfessionalDetail;