import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading/Loading';
import './NewHealthProfessionalForm.css';
import { API } from '../../services/api';

const NewHealthProfessionalForm = ({ onProfessionalAdded, onCancel }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    specialty: '',
    license: '',
    socialMediaUsername: '',
    socialMediaLink: '',
    whatsappNumber: '',
    email: '',
    userId: user?.id
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.nameid || decodedToken.sub || decodedToken.userId;

      const professionalData = {
        name: formData.name,
        specialty: formData.specialty,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        userId: userId
      };

      const newProfessional = await API.post('/HealthProfessional', professionalData);
      onProfessionalAdded(newProfessional);
      setFormData({
        name: '',
        specialty: '',
        address: '',
        phone: '',
        email: ''
      });
    } catch (error) {
      setError('Error al crear el profesional de la salud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-professional-form-container">
      <div className="new-professional-form">
        <div className="form-header">
          <h2>Agregar Nuevo Profesional</h2>
          <button className="close-button" onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {isSubmitting && (
          <div className="form-loading">
            <Loading />
            <p>Creando profesional...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre del profesional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Especialidad *</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                required
                placeholder="Ingrese la especialidad"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="license">Licencia *</label>
              <input
                type="text"
                id="license"
                name="license"
                value={formData.license}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el número de licencia"
              />
            </div>

            <div className="form-group">
              <label htmlFor="whatsappNumber">WhatsApp *</label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el número de WhatsApp"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="socialMediaUsername">Usuario en redes sociales</label>
              <input
                type="text"
                id="socialMediaUsername"
                name="socialMediaUsername"
                value={formData.socialMediaUsername}
                onChange={handleInputChange}
                placeholder="Ingrese el usuario de redes sociales"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ingrese el email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaLink">Enlace de redes sociales</label>
            <input
              type="url"
              id="socialMediaLink"
              name="socialMediaLink"
              value={formData.socialMediaLink}
              onChange={handleInputChange}
              placeholder="Ingrese el enlace de redes sociales"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL de la imagen</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Ingrese la URL de la imagen"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Agregar Profesional</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewHealthProfessionalForm; 