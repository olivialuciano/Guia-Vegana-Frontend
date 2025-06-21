import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading/Loading';
import './NewVeganOptionForm.css';
import { API } from '../../services/api';

const NewVeganOptionForm = ({ businessId, onOptionAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    businessId: businessId || 0
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No autorizado');
      }

      const veganOptionToCreate = {
        businessId: parseInt(businessId),
        name: formData.name,
        price: parseFloat(formData.price)
      };

      const response = await fetch(`${API}/VeganOption`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(veganOptionToCreate)
      });

      if (!response.ok) {
        throw new Error('Error al crear la opción vegana');
      }

      const newOption = await response.json();
      onOptionAdded(newOption);
      setFormData({
        name: '',
        price: ''
      });
    } catch (error) {
      setError('Error al crear la opción vegana: ' + error.message);
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
    <div className="new-vegan-option-form-container">
      <form onSubmit={handleSubmit} className="new-vegan-option-form">
        <div className="form-header">
          <h3>Agregar Opción Vegana</h3>
          <button className="close-button" onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {isSubmitting && (
          <div className="form-loading">
            <Loading />
            <p>Creando opción vegana...</p>
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
            placeholder="Ingrese el nombre de la opción vegana"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Ingrese el precio"
            step="0.01"
            min="0"
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

export default NewVeganOptionForm; 