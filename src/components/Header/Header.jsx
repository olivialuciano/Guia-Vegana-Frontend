import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ 
  title, 
  icon, 
  children,
  showRating = false,
  rating,
}) => {
  const roundedRating = Math.round(rating || 0);

  return (
    <header className="header">
      <div className="header-content">
        {icon && <FontAwesomeIcon icon={icon} className="header-icon" />}
        <h1>{title}</h1>

        {showRating && rating && (
          <div className="header-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={`rating-icon ${i < roundedRating ? 'filled' : 'empty'}`}
              />
            ))}
            <span className="rating-value">{rating.toFixed(1)}</span>
          </div>
        )}
        
        {children}
      </div>
    </header>
  );
};

export default Header;
