import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import Loading from '../Loading/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './NewActivismForm.css';
import { API } from '../../services/api';

const NewActivismForm = ({ onActivismAdded, onCancel }) => {
  const { user } = useContext(AuthContext);
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

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.nameid || decodedToken.sub || decodedToken.userId;

      const activismToCreate = {
        name: formData.name,
        image: formData.image || null,
        contact: formData.contact,
        socialMediaUsername: formData.socialMediaUsername,
        socialMediaLink: formData.socialMediaLink,
        description: formData.description,
        userId: userId
      };

      const response = await fetch(`${API}/Activism`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activismToCreate)
      });

      if (!response.ok) {
        throw new Error('Error al crear el activismo');
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
    } catch (error) {
      setError('Error al crear el activismo: ' + error.message);
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
        <div className="form-header">
          <h4>Agregar Nuevo Activismo</h4>
          <button type="button" className="close-btn" onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
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
          <label htmlFor="image">Imagen (opcional):</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Ingrese la URL de la imagen del activismo"
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
            placeholder="Ingrese el contacto del activismo"
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
            rows={3}
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