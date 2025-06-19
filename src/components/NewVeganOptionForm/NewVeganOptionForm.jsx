import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading/Loading';
import './NewVeganOptionForm.css';

const NewVeganOptionForm = ({ businessId, onOptionAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    businessId: businessId || 0 // Aseguramos que no sea null
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      setError('El precio debe ser un número válido mayor o igual a 0');
      return;
    }

    if (!businessId) {
      setError('El ID del negocio es requerido');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      // Crear el objeto exactamente como lo espera el backend
      const veganOptionToCreate = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        businessId: parseInt(businessId) // Usamos businessId directamente del prop
      };

      console.log('Enviando datos:', veganOptionToCreate); // Para debugging

      setIsSubmitting(true);
      const response = await fetch('https://localhost:7032/api/VeganOption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(veganOptionToCreate)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al crear la opción vegana: ${errorData}`);
      }

      const newOption = await response.json();
      onOptionAdded(newOption);
      setFormData({ name: '', price: '', businessId: businessId });
      setError(null);
    } catch (error) {
      console.error('Error completo:', error); // Para debugging
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