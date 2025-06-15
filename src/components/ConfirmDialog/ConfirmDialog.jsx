import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
          <h3>{title}</h3>
        </div>
        <div className="confirm-dialog-content">
          <p>{message}</p>
        </div>
        <div className="confirm-dialog-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 