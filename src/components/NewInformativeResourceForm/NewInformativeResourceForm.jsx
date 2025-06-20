import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading/Loading';
import './NewInformativeResourceForm.css';
import { API } from '../../services/api';

const NewInformativeResourceForm = ({ onResourceAdded, onCancel }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    topic: '',
    platform: '',
    description: '',
    type: 0, // Default to Book
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
      console.log('Token payload:', payload);

      // Intentar obtener el ID del usuario de diferentes campos posibles
      const userId = payload.nameid || payload.sub || payload.userId || payload.id;
      
      if (!userId) {
        console.error('Payload del token:', payload);
        throw new Error('No se pudo obtener el ID del usuario del token');
      }

      // Validar datos requeridos
      if (!formData.name || !formData.topic || !formData.description) {
        setError('Por favor complete todos los campos requeridos');
        setIsSubmitting(false);
        return;
      }

      // Preparar los datos para enviar
      const resourceData = {
        name: formData.name,
        image: formData.image || null,
        topic: formData.topic,
        platform: formData.platform || null,
        description: formData.description,
        type: parseInt(formData.type),
        userId: userId
      };

      console.log('Enviando datos:', resourceData);

      const response = await fetch(`${API}/InformativeResource`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || `Error al crear el recurso: ${response.status}`);
      }

      const newResource = await response.json();
      console.log('Respuesta exitosa:', newResource);
      onResourceAdded(newResource);
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al crear el recurso');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-resource-form-container">
      <div className="new-resource-form">
        <div className="form-header">
          <h2>Agregar Nuevo Recurso</h2>
          <button className="close-button" onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {isSubmitting && (
          <div className="form-loading">
            <Loading />
            <p>Creando recurso...</p>
          </div>
        )}

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
              placeholder="Ingrese el nombre del recurso"
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
            <label htmlFor="topic">Tema *</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
              placeholder="Ingrese el tema del recurso"
            />
          </div>

          <div className="form-group">
            <label htmlFor="platform">Plataforma</label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              placeholder="Ingrese la plataforma"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Ingrese la descripción del recurso"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipo de Recurso *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="0">Libro</option>
              <option value="1">Documental</option>
              <option value="2">Recurso Web</option>
            </select>
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
              {isSubmitting ? 'Creando...' : 'Crear Recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInformativeResourceForm; 