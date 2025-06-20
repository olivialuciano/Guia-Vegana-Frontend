import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import './Loading.css';

const Loading = ({ 
  text = "Cargando...", 
  subtitle = "Por favor espera un momento", 
  size = "large",
  showProgress = false,
  showSkeleton = false 
}) => {
  if (showSkeleton) {
    return (
      <div className={`loading-container ${size}`}>
        <div className="loading-content">
          <div className="loading-skeleton">
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
            <div className="skeleton-item"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`loading-container ${size}`}>
      <div className="loading-content">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faLeaf} className="loading-icon" />
        </div>
        
        <h2 className="loading-text">{text}</h2>
        <p className="loading-subtitle">{subtitle}</p>
        
        {showProgress && (
          <div className="loading-progress">
            <div className="loading-progress-bar"></div>
          </div>
        )}
        
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
