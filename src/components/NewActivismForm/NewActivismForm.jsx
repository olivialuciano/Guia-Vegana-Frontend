import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import Loading from '../Loading/Loading';
import './NewActivismForm.css';
import { API } from '../../services/api';

const NewActivismForm = ({ onActivismAdded, onCancel }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    contact: '',
    socialMediaUsername: '',
    socialMediaLink: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      setIsSubmitting(false);
      return;
    }

    if (!formData.contact.trim()) {
      setError('El contacto es requerido');
      setIsSubmitting(false);
      return;
    }

    if (!formData.socialMediaUsername.trim()) {
      setError('El nombre de usuario en redes sociales es requerido');
      setIsSubmitting(false);
      return;
    }

    if (!formData.socialMediaLink.trim()) {
      setError('El enlace de redes sociales es requerido');
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setError('No estás autorizado para realizar esta acción');
      setIsSubmitting(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log('Token decodificado:', decodedToken); // Debug log

      const activismToCreate = {
        name: formData.name.trim(),
        image: formData.image.trim() || null,
        contact: formData.contact.trim(),
        socialMediaUsername: formData.socialMediaUsername.trim(),
        socialMediaLink: formData.socialMediaLink.trim(),
        description: formData.description.trim(),
        userId: parseInt(decodedToken.userId)
      };

      console.log('Enviando datos:', activismToCreate); // Debug log

      const response = await fetch(`${API}/Activism`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activismToCreate)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData); // Debug log
        throw new Error(`Error al crear el activismo: ${errorData}`);
      }

      const newActivism = await response.json();
      onActivismAdded(newActivism);
      setFormData({
        name: '',
        image: '',
        contact: '',
        socialMediaUsername: '',
        socialMediaLink: '',
        description: ''
      });
      setError(null);
    } catch (error) {
      console.error('Error completo:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="new-activism-form-container">
      <form onSubmit={handleSubmit} className="new-activism-form">
        <h4>Agregar Nuevo Activismo</h4>
        
        {isSubmitting && (
          <div className="form-loading">
            <Loading />
            <p>Creando activismo...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button className="close-error" onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ingrese el nombre del activismo"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de la imagen:</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Ingrese la URL de la imagen (opcional)"
            maxLength={700}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contacto:</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            placeholder="Ingrese el contacto"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="socialMediaUsername">Usuario en redes sociales:</label>
          <input
            type="text"
            id="socialMediaUsername"
            name="socialMediaUsername"
            value={formData.socialMediaUsername}
            onChange={handleChange}
            required
            placeholder="Ingrese el nombre de usuario en redes sociales"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="socialMediaLink">Enlace de redes sociales:</label>
          <input
            type="url"
            id="socialMediaLink"
            name="socialMediaLink"
            value={formData.socialMediaLink}
            onChange={handleChange}
            required
            placeholder="Ingrese el enlace de redes sociales"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Ingrese la descripción del activismo"
            maxLength={500}
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">Agregar</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewActivismForm; 