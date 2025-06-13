import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './LogoutConfirmation.css';

const LogoutConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout-confirmation-overlay">
      <div className="logout-confirmation-modal">
        <div className="logout-confirmation-icon">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </div>
        <h3>¿Cerrar sesión?</h3>
        <p>¿Estás seguro de que deseas cerrar tu sesión?</p>
        <div className="logout-confirmation-buttons">
          <button 
            className="logout-confirmation-cancel" 
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className="logout-confirmation-confirm" 
            onClick={onConfirm}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation; 