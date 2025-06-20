import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ title, icon, showRating = false, rating = null, children }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className="star filled" 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className="star filled" 
            style={{ opacity: 0.5 }}
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className="star" 
          />
        );
      }
    }
    return stars;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-title-section">
            <div className="header-icon">
              <FontAwesomeIcon icon={icon} />
            </div>
            <div>
              <h1 className="header-title">{title}</h1>
              <p className="header-subtitle">Guía Vegana Argentina</p>
            </div>
          </div>
        </div>

        {showRating && rating !== null && (
          <div className="header-center">
            <div className="rating-display">
              <div className="rating-stars">
                {renderStars(rating)}
              </div>
              <span className="rating-value">{rating.toFixed(1)}</span>
            </div>
          </div>
        )}

        {children && (
          <div className="header-right">
            <div className="header-actions">
              {children}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
