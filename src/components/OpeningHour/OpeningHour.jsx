import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDoorOpen, faDoorClosed, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import NewOpeningHourForm from '../NewOpeningHourForm/NewOpeningHourForm';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import Loading from '../Loading/Loading';
import './OpeningHour.css';

const OpeningHour = ({ openingHours = [], businessId, onHourAdded, onHourUpdated, onHourDeleted }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingHour, setEditingHour] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hourToDelete, setHourToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  // Debug log para ver los datos que llegan
  console.log('OpeningHours received:', openingHours);

  const getDayName = (day) => {
    if (typeof day !== 'number') return '';
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[day] || '';
  };

  const formatTime = (time) => {
    if (!time || time === '') return '';
    return time.substring(0, 5);
  };

  const handleEdit = (hour) => {
    if (!hour || !hour.id) {
      console.error('Hour object is invalid or missing id:', hour);
      return;
    }
    setEditingHour({ ...hour });
  };

  const handleDelete = async (hourId) => {
    if (!hourId) return;
    setHourToDelete(hourId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`https://localhost:7032/api/OpeningHour/${hourToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar el horario');

      onHourDeleted(hourToDelete);
      setShowConfirmDialog(false);
      setHourToDelete(null);
    } catch (error) {
      setError(error.message);
      setShowConfirmDialog(false);
      setHourToDelete(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingHour || !editingHour.id) {
      setError('Error: No se puede editar un horario sin ID');
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      console.log('Editing hour with ID:', editingHour.id); // Debug log

      const response = await fetch(`https://localhost:7032/api/OpeningHour/${editingHour.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingHour)
      });

      if (!response.ok) throw new Error('Error al actualizar el horario');

      onHourUpdated(editingHour);
      setEditingHour(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validación más robusta de openingHours
  const validOpeningHours = Array.isArray(openingHours) 
    ? openingHours.filter(hour => 
        hour && 
        typeof hour === 'object' && 
        hour.id && // Asegurar que tenga ID
        typeof hour.day === 'number' &&
        hour.day >= 0 && 
        hour.day <= 6
      )
    : [];

  return (
    <div className="opening-hours-container">
      <div className="opening-hours-header">
        <h3>Horarios de Apertura</h3>
        {canEdit && (
          <button
            className="add-opening-hour-btn"
            onClick={() => setShowForm(!showForm)}
            title="Agregar horario"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button className="close-error" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {showForm && (
        <NewOpeningHourForm
          businessId={businessId}
          onHourAdded={(newHour) => {
            if (!newHour || typeof newHour.day !== 'number') {
              console.warn("Se intentó agregar un horario inválido:", newHour);
              return;
            }
            onHourAdded(newHour);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="opening-hours-list">
        {validOpeningHours.length === 0 ? (
          <p className="no-hours-message">No hay horarios registrados</p>
        ) : (
          validOpeningHours.map((hour) => (
            <div key={hour.id} className="opening-hour-item">
              {editingHour?.id === hour.id && editingHour ? (
                <form onSubmit={handleSave} className="editing-form">
                  <select
                    value={editingHour.day}
                    onChange={(e) => setEditingHour({ ...editingHour, day: parseInt(e.target.value) })}
                  >
                    {[...Array(7)].map((_, i) => (
                      <option key={i} value={i}>{getDayName(i)}</option>
                    ))}
                  </select>
                  <div className="time-inputs">
                    <div className="time-group">
                      <label>Primer horario:</label>
                      <div className="time-input-group">
                        <input
                          type="time"
                          value={formatTime(editingHour.openTime1)}
                          onChange={(e) => setEditingHour({ ...editingHour, openTime1: e.target.value })}
                        />
                        <input
                          type="time"
                          value={formatTime(editingHour.closeTime1)}
                          onChange={(e) => setEditingHour({ ...editingHour, closeTime1: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="time-group">
                      <label>Segundo horario (opcional):</label>
                      <div className="time-input-group">
                        <input
                          type="time"
                          value={formatTime(editingHour.openTime2)}
                          onChange={(e) => setEditingHour({ ...editingHour, openTime2: e.target.value })}
                        />
                        <input
                          type="time"
                          value={formatTime(editingHour.closeTime2)}
                          onChange={(e) => setEditingHour({ ...editingHour, closeTime2: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="edit-actions">
                    <button type="submit" className="save-btn">Guardar</button>
                    <button type="button" className="cancel-btn" onClick={() => setEditingHour(null)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="opening-hour-content">
                  <h4>{getDayName(hour.day)}</h4>
                  <div className="opening-hour-times">
                    <p>{formatTime(hour.openTime1)} / {formatTime(hour.closeTime1)}</p>
                    {hour.openTime2 && hour.closeTime2 && hour.openTime2 !== '' && hour.closeTime2 !== '' && (
                      <p>{formatTime(hour.openTime2)} / {formatTime(hour.closeTime2)}</p>
                    )}
                  </div>
                  {canEdit && (
                    <div className="opening-hour-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(hour)}
                        title="Editar horario"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(hour.id)}
                        title="Eliminar horario"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setHourToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Horario"
        message="¿Estás seguro de que deseas eliminar este horario?"
      />

      {isLoading && (
        <div className="loading-overlay">
          <Loading />
          <p>Procesando...</p>
        </div>
      )}
    </div>
  );
};

export default OpeningHour;
