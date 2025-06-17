import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './NewHealthProfessionalForm.css';

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
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      // Obtener el usuario del token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Token inválido');
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('Token payload:', payload); // Para depuración

      // Intentar obtener el ID del usuario de diferentes campos posibles
      const userId = payload.nameid || payload.sub || payload.userId || payload.id;
      
      if (!userId) {
        console.error('Payload del token:', payload); // Para depuración
        throw new Error('No se pudo obtener el ID del usuario del token');
      }

      // Validar datos requeridos
      if (!formData.name || !formData.specialty || !formData.license || !formData.whatsappNumber) {
        setError('Por favor complete todos los campos requeridos');
        setIsSubmitting(false);
        return;
      }

      // Preparar los datos para enviar
      const professionalData = {
        name: formData.name,
        image: formData.image || null,
        specialty: formData.specialty,
        license: formData.license,
        socialMediaUsername: formData.socialMediaUsername || null,
        socialMediaLink: formData.socialMediaLink || null,
        whatsappNumber: formData.whatsappNumber,
        email: formData.email || null,
        userId: userId
      };

      console.log('Enviando datos:', professionalData);

      const response = await fetch('https://localhost:7032/api/HealthProfessional', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(professionalData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || `Error al crear el profesional: ${response.status}`);
      }

      const newProfessional = await response.json();
      console.log('Respuesta exitosa:', newProfessional);
      onProfessionalAdded(newProfessional);
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al crear el profesional');
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

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="whatsappNumber">Número de WhatsApp *</label>
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

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ingrese el correo electrónico"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Profesional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewHealthProfessionalForm; 