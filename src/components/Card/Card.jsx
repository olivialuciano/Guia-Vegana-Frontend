import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faUserMd, 
  faBook, 
  faHandHoldingHeart,
  faCalendarAlt,
  faLink,
  faUser,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';
import defaultProfileImage from '../../assets/img/defaultprofileimage.jpg';
import defaultImage from '../../assets/img/image.png';
import './Card.css';

const Card = ({ item, entityType }) => {
  const handleImageError = (e) => {
    e.target.src = entityType === 'healthProfessional' ? defaultProfileImage : defaultImage;
  };

  const getDefaultImage = () => {
    return entityType === 'healthProfessional' ? defaultProfileImage : defaultImage;
  };

  const getEntityIcon = () => {
    switch (entityType) {
      case 'business':
        return faBuilding;
      case 'healthProfessional':
        return faUserMd;
      case 'informativeResource':
        return faBook;
      case 'activism':
        return faHandHoldingHeart;
      default:
        return faBuilding;
    }
  };

  const getEntityPath = () => {
    switch (entityType) {
      case 'business':
        return `/business/${item.id}`;
      case 'healthProfessional':
        return `/healthprofessional/${item.id}`;
      case 'informativeResource':
        return `/informativeresource/${item.id}`;
      case 'activism':
        return `/activism/${item.id}`;
      default:
        return '/';
    }
  };

  const renderBusinessInfo = () => (
    <>
      <h2 className="card-title">{item.name}</h2>
      <p className="card-subtitle">{item.category}</p>
      {item.rating && (
        <div className="card-rating">
          <FontAwesomeIcon icon={faStar} className="star-icon" />
          <span>{item.rating.toFixed(1)}</span>
        </div>
      )}
      {item.address && (
        <div className="card-info">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <span>{item.address}</span>
        </div>
      )}
      {item.phone && (
        <div className="card-info">
          <FontAwesomeIcon icon={faPhone} />
          <span>{item.phone}</span>
        </div>
      )}
      {item.email && (
        <div className="card-info">
          <FontAwesomeIcon icon={faEnvelope} />
          <span>{item.email}</span>
        </div>
      )}
    </>
  );

  const renderHealthProfessionalInfo = () => (
    <>
      <h2 className="card-title">{item.name}</h2>
      <p className="card-subtitle">{item.specialty}</p>
      
    </>
  );

  const renderInformativeResourceInfo = () => (
    <>
      <h2 className="card-title">{item.title}</h2>
      {item.name && (
        <div className="card-info">
          <FontAwesomeIcon icon={faUser} />
          <span>{item.name}</span>
        </div>
      )}
      {item.topic && (
        <div className="card-info">
          <FontAwesomeIcon icon={faBook} />
          <span>{item.topic}</span>
        </div>
      )}
      {item.category && (
        <div className="card-info">
          <FontAwesomeIcon icon={faBook} />
          <span>{item.category}</span>
        </div>
      )}
    </>
  );

  const renderActivismInfo = () => (
    <>
      <h2 className="card-title">{item.name}</h2>
      {item.organization && (
        <div className="card-info">
          <FontAwesomeIcon icon={faBuilding} />
          <span>{item.organization}</span>
        </div>
      )}
      
    </>
  );

  const renderEntityInfo = () => {
    switch (entityType) {
      case 'business':
        return renderBusinessInfo();
      case 'healthProfessional':
        return renderHealthProfessionalInfo();
      case 'informativeResource':
        return renderInformativeResourceInfo();
      case 'activism':
        return renderActivismInfo();
      default:
        return null;
    }
  };

  return (
    <Link to={getEntityPath()} className="card">
      <div className="card-image-container">
        <img
          src={item.image || getDefaultImage()}
          alt={item.name || item.title}
          className="card-image"
          onError={handleImageError}
        />
        <div className="card-icon">
          <FontAwesomeIcon icon={getEntityIcon()} />
        </div>
      </div>
      <div className="card-content">
        {renderEntityInfo()}
      </div>
    </Link>
  );
};

export default Card; 