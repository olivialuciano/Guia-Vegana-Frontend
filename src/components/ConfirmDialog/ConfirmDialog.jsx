import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h2 className="confirm-dialog-title">{title}</h2>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button 
            className="confirm-dialog-button cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className="confirm-dialog-button confirm"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 