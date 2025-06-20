import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../Loading/Loading';
import { API } from '../../services/api';
import './NewOpeningHourForm.css';

const NewOpeningHourForm = ({ businessId, onHourAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    day: 0,
    openTime1: '',
    closeTime1: '',
    openTime2: '',
    closeTime2: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`${API}/OpeningHour`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          businessId: parseInt(businessId)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el horario');
      }

      const newHour = await response.json();
      onHourAdded(newHour);
      setFormData({
        day: 0,
        openTime1: '',
        closeTime1: '',
        openTime2: '',
        closeTime2: ''
      });
    } catch (error) {
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
    <form onSubmit={handleSubmit} className="new-opening-hour-form">
      <div className="form-header">
        <h3>Agregar Horario</h3>
        <button className="close-button" onClick={onCancel}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {isSubmitting && (
        <div className="form-loading">
          <Loading />
          <p>Creando horario...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button className="close-error" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="day">Día:</label>
        <select
          id="day"
          name="day"
          value={formData.day}
          onChange={handleChange}
          required
        >
          <option value="0">Domingo</option>
          <option value="1">Lunes</option>
          <option value="2">Martes</option>
          <option value="3">Miércoles</option>
          <option value="4">Jueves</option>
          <option value="5">Viernes</option>
          <option value="6">Sábado</option>
        </select>
      </div>

      <div className="time-inputs">
        <div className="time-group">
          <label>Primer horario:</label>
          <div className="time-input-group">
            <input
              type="time"
              name="openTime1"
              value={formData.openTime1}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="closeTime1"
              value={formData.closeTime1}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="time-group">
          <label>Segundo horario (opcional):</label>
          <div className="time-input-group">
            <input
              type="time"
              name="openTime2"
              value={formData.openTime2}
              onChange={handleChange}
            />
            <input
              type="time"
              name="closeTime2"
              value={formData.closeTime2}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">Agregar Horario</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default NewOpeningHourForm;