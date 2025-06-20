import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import NewVeganOptionForm from '../NewVeganOptionForm/NewVeganOptionForm';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import Loading from '../Loading/Loading';
import { API } from '../../services/api';
import './VeganOption.css';

const VeganOption = ({ veganOptions = [], businessId, onOptionAdded, onOptionUpdated, onOptionDeleted }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  const handleEdit = (option) => {
    if (!option) return;
    setEditingOption(option);
  };

  const handleDelete = async (optionId) => {
    if (!optionId) return;
    setOptionToDelete(optionId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`${API}/VeganOption/${optionToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar la opción vegana');

      onOptionDeleted(optionToDelete);
      setShowConfirmDialog(false);
      setOptionToDelete(null);
    } catch (error) {
      setError(error.message);
      setShowConfirmDialog(false);
      setOptionToDelete(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingOption) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      const response = await fetch(`${API}/VeganOption/${editingOption.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingOption.name,
          price: editingOption.price,
          businessId: businessId
        })
      });

      if (!response.ok) throw new Error('Error al actualizar la opción vegana');

      onOptionUpdated(editingOption);
      setEditingOption(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Validación más robusta de veganOptions
  const validVeganOptions = Array.isArray(veganOptions) 
    ? veganOptions.filter(option => 
        option && 
        typeof option === 'object' && 
        typeof option.name === 'string' &&
        option.name.trim() !== '' &&
        typeof option.price === 'number'
      )
    : [];

  return (
    <div className="vegan-options-container">
      <div className="vegan-options-header">
        <h3>Opciones Veganas</h3>
        {canEdit && (
          <button 
            className="add-vegan-option-btn"
            onClick={() => setShowForm(!showForm)}
            title="Agregar opción vegana"
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
        <NewVeganOptionForm
          businessId={businessId}
          onOptionAdded={(newOption) => {
            if (!newOption || typeof newOption.name !== 'string') {
              console.warn("Se intentó agregar una opción inválida:", newOption);
              return;
            }
            onOptionAdded(newOption);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="vegan-options-list">
        {validVeganOptions.length === 0 ? (
          <p className="no-options-message">No hay opciones veganas registradas</p>
        ) : (
          validVeganOptions.map((option) => (
            <div key={option.id} className="vegan-option-item">
              {editingOption?.id === option.id && editingOption ? (
                <form onSubmit={handleSave} className="editing-form">
                  <div className="form-group">
                    <label htmlFor="name">Nombre:</label>
                    <input
                      type="text"
                      id="name"
                      value={editingOption.name}
                      onChange={(e) => setEditingOption({ ...editingOption, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Precio:</label>
                    <input
                      type="number"
                      id="price"
                      value={editingOption.price}
                      onChange={(e) => setEditingOption({ ...editingOption, price: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="edit-actions">
                    <button type="submit" className="save-btn">Guardar</button>
                    <button type="button" className="cancel-btn" onClick={() => setEditingOption(null)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="vegan-option-content">
                  <div className="vegan-option-info">
                    <h4>{option.name}</h4>
                    <span className="vegan-option-price">${option.price.toFixed(2)}</span>
                  </div>
                  {canEdit && (
                    <div className="vegan-option-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(option)}
                        title="Editar opción"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(option.id)}
                        title="Eliminar opción"
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
          setOptionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Opción Vegana"
        message="¿Estás seguro de que deseas eliminar esta opción vegana?"
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

export default VeganOption;
