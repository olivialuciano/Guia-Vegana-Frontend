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
  faUser,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import defaultImage from '../../assets/img/defaultprofileimage.jpg';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './HealthProfessionalDetail.css';

const HealthProfessionalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfessional, setEditedProfessional] = useState(null);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await fetch(`https://localhost:7032/api/HealthProfessional/${id}`);
        if (!response.ok) {
          throw new Error('Error al cargar el profesional');
        }
        const data = await response.json();
        setProfessional(data);
        setEditedProfessional(data);
      } catch (err) {
        setError('Error al cargar el profesional');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfessional(professional);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`https://localhost:7032/api/HealthProfessional/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProfessional)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al actualizar el profesional');
      }

      let updatedProfessional;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          updatedProfessional = await response.json();
        } catch (e) {
          console.warn('No se pudo parsear la respuesta JSON:', e);
          updatedProfessional = editedProfessional;
        }
      } else {
        updatedProfessional = editedProfessional;
      }

      setProfessional(updatedProfessional);
      setEditedProfessional(updatedProfessional);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar el profesional');
      console.error('Error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfessional(prev => ({
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

      const response = await fetch(`https://localhost:7032/api/HealthProfessional/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el profesional');
      }

      navigate('/healthprofessional');
    } catch (err) {
      setError('Error al eliminar el profesional');
      console.error('Error:', err);
    } finally {
      setShowConfirmDialog(false);
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
        {canEdit && (
          <div className="header-actions">
            <button className="icon-button edit" onClick={handleEdit} title="Editar profesional">
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button className="icon-button delete" onClick={handleDelete} title="Eliminar profesional">
              <FontAwesomeIcon icon={faTrash} />
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

        {isEditing ? (
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedProfessional.name}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre del profesional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">URL de la imagen</label>
              <input
                type="url"
                id="image"
                name="image"
                value={editedProfessional.image || ''}
                onChange={handleInputChange}
                placeholder="Ingrese la URL de la imagen"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Especialidad</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={editedProfessional.specialty}
                onChange={handleInputChange}
                required
                placeholder="Ingrese la especialidad"
              />
            </div>

            <div className="form-group">
              <label htmlFor="license">Licencia</label>
              <input
                type="text"
                id="license"
                name="license"
                value={editedProfessional.license}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el número de licencia"
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialMediaUsername">Usuario en redes sociales</label>
              <input
                type="text"
                id="socialMediaUsername"
                name="socialMediaUsername"
                value={editedProfessional.socialMediaUsername}
                onChange={handleInputChange}
                placeholder="Ingrese el usuario de redes sociales"
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialMediaLink">Enlace de redes sociales</label>
              <input
                type="url"
                id="socialMediaLink"
                name="socialMediaLink"
                value={editedProfessional.socialMediaLink}
                onChange={handleInputChange}
                placeholder="Ingrese el enlace de redes sociales"
              />
            </div>

            <div className="form-group">
              <label htmlFor="whatsappNumber">Número de WhatsApp</label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={editedProfessional.whatsappNumber}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el número de WhatsApp"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedProfessional.email}
                onChange={handleInputChange}
                placeholder="Ingrese el correo electrónico"
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
          </>
        )}
      </div>

      {showConfirmDialog && (
        <ConfirmDialog
          title="Eliminar Profesional"
          message="¿Estás seguro de que deseas eliminar este profesional? Esta acción no se puede deshacer."
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default HealthProfessionalDetail;