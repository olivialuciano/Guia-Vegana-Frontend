import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading/Loading';
import { jwtDecode } from "jwt-decode";
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
    type: 0
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

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.nameid || decodedToken.sub || decodedToken.userId;

      const resourceData = {
        name: formData.name,
        image: formData.image || null,
        topic: formData.topic,
        platform: formData.platform || null,
        description: formData.description,
        type: parseInt(formData.type),
        userId: userId
      };

      const response = await fetch(`${API}/InformativeResource`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        throw new Error('Error al crear el recurso informativo');
      }

      const newResource = await response.json();
      onResourceAdded(newResource);
      setFormData({
        name: '',
        image: '',
        topic: '',
        platform: '',
        description: '',
        type: 0
      });
    } catch (error) {
      setError('Error al crear el recurso informativo: ' + error.message);
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