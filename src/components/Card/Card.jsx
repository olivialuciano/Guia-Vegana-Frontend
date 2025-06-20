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
  faBuilding,
  faClock,
  faDoorOpen,
  faDoorClosed,
  faLocationDot,
  faMapLocationDot
} from '@fortawesome/free-solid-svg-icons';
import defaultProfileImage from '../../assets/img/defaultprofileimage.jpg';
import image from '../../assets/img/image.png';
import './Card.css';
import { useBusinessStatus } from '../../hooks/useBusinessStatus';

const Card = ({ 
  // Formato nuevo (props individuales)
  title,
  subtitle,
  description,
  image: imageUrl,
  icon,
  rating,
  info,
  to,
  businessData,
  activismData,
  healthProfessionalData,
  informativeResourceData,
  
  // Formato antiguo (item + entityType)
  item,
  entityType
}) => {
  // Determinar si estamos usando el formato nuevo o antiguo
  const isNewFormat = title !== undefined;
  
  // Si es formato nuevo, crear un objeto item compatible
  const cardItem = isNewFormat ? {
    id: businessData?.id || activismData?.id || healthProfessionalData?.id || informativeResourceData?.id,
    name: title,
    title: title,
    image: imageUrl,
    rating: rating,
    address: businessData?.address || info?.text,
    specialty: subtitle,
    topic: subtitle,
    description: description,
    openingHours: businessData?.openingHours || []
  } : item;

  // Determinar el tipo de entidad
  const cardEntityType = isNewFormat ? 
    (businessData ? 'business' : 
     activismData ? 'activism' : 
     healthProfessionalData ? 'healthProfessional' : 
     informativeResourceData ? 'informativeResource' : 'business') 
    : entityType;

  // Lógica de negocio (estado abierto/cerrado, etc)
  const isBusiness = cardEntityType === 'business';
  const { isOpen, getStatusText, getStatusClass } = isBusiness ? useBusinessStatus(cardItem?.openingHours) : { isOpen: null, getStatusText: () => '', getStatusClass: () => 'unknown' };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = cardEntityType === 'healthProfessional' ? defaultProfileImage : image;
  };

  const getDefaultImage = () => {
    if (cardEntityType === 'healthProfessional') return defaultProfileImage;
    if (cardEntityType === 'activism') return image;
    return image;
  };

  const getImageUrl = () => {
    if (!cardItem?.image) return getDefaultImage();
    return cardItem.image;
  };

  const getEntityIcon = () => {
    // Si se proporciona un icono específico, usarlo
    if (icon) return icon;
    
    // Si no, usar el icono por defecto según el tipo de entidad
    switch (cardEntityType) {
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
    // Si se proporciona una ruta específica, usarla
    if (to) return to;
    
    // Si no, generar la ruta según el tipo de entidad
    if (!cardItem?.id) return '/';
    
    switch (cardEntityType) {
      case 'business':
        return `/business/${cardItem.id}`;
      case 'healthProfessional':
        return `/healthprofessional/${cardItem.id}`;
      case 'informativeResource':
        return `/informativeresource/${cardItem.id}`;
      case 'activism':
        return `/activism/${cardItem.id}`;
      default:
        return '/';
    }
  };

  // Lógica específica de negocio
  const formatAddress = (address) => {
    if (!address) return 'Dirección no disponible';
    
    // Si la dirección es muy larga, la truncamos
    if (address.length > 60) {
      return `${address.substring(0, 60)}...`;
    }
    
    return address;
  };

  const getStatusIcon = () => {
    if (isOpen === null) return faClock;
    return isOpen ? faDoorOpen : faDoorClosed;
  };

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    if (!rating || rating === 0) {
      return (
        <div className="stars-container">
          <span className="no-rating">Sin calificación</span>
        </div>
      );
    }
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Estrellas llenas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={`full-${i}`} 
          icon={faStar} 
          className="star filled"
        />
      );
    }
    
    // Media estrella si es necesario
    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon 
          key="half" 
          icon={faStar} 
          className="star half"
        />
      );
    }
    
    // Estrellas vacías para completar 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={`empty-${i}`} 
          icon={faStar} 
          className="star empty"
        />
      );
    }
    
    return (
      <div className="stars-container">
        {stars}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Renderizado para negocio
  const renderBusinessCard = () => (
    <div className="card-image-container">
      <img
        src={getImageUrl()}
        alt={cardItem?.name || cardItem?.title}
        className="card-image"
        onError={handleImageError}
      />
      <div className={`business-status ${getStatusClass()}`}>
        <FontAwesomeIcon icon={getStatusIcon()} />
        <span>{getStatusText()}</span>
      </div>
    </div>
  );

  const renderBusinessInfo = () => (
    <>
      <h2 className="card-title">{cardItem?.name || cardItem?.title}</h2>
      
      
      {/* Dirección */}
      {cardItem?.address && (
        <div className="card-info address">
          <FontAwesomeIcon icon={faMapLocationDot} />
          <span>{formatAddress(cardItem.address)}</span>
        </div>
      )}
      
      <div className="card-rating">
        {renderStars(cardItem?.rating)}
      </div>
    </>
  );

  // Renderizado para otras entidades
  const renderHealthProfessionalInfo = () => (
    <>
      <h2 className="card-title">{cardItem?.name || cardItem?.title}</h2>
      <p className="card-subtitle">{cardItem?.specialty || subtitle}</p>
    </>
  );

  const renderInformativeResourceInfo = () => (
    <>
      <h2 className="card-title">{cardItem?.title || cardItem?.name}</h2>
      <p className="card-subtitle">{cardItem?.topic || subtitle}</p>
      {description && (
        <p className="card-description">{description}</p>
      )}
    </>
  );

  const renderActivismInfo = () => (
    <>
      <h2 className="card-title">{cardItem?.name || cardItem?.title}</h2>
      <p className="card-subtitle">{cardItem?.type || subtitle}</p>
      {description && (
        <p className="card-description">{description}</p>
      )}
    </>
  );

  const renderEntityInfo = () => {
    switch (cardEntityType) {
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
      {isBusiness ? (
        renderBusinessCard()
      ) : (
        <div className="card-image-container">
          <img
            src={getImageUrl()}
            alt={cardItem?.name || cardItem?.title}
            className="card-image"
            onError={handleImageError}
          />
          <div className="card-icon">
            <FontAwesomeIcon icon={getEntityIcon()} />
          </div>
        </div>
      )}
      <div className="card-content">
        {renderEntityInfo()}
      </div>
    </Link>
  );
};

export default Card; 