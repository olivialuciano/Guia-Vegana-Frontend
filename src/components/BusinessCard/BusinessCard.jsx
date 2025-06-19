import React from "react";
import "./BusinessCard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faStar, faClock, faDoorOpen, faDoorClosed } from "@fortawesome/free-solid-svg-icons";
import { useBusinessStatus } from "../../hooks/useBusinessStatus";
import Image from "../../assets/img/image.png";

const BusinessCard = ({ business }) => {
  const navigate = useNavigate();
  const { isOpen, getStatusText, getStatusClass } = useBusinessStatus(business.openingHours);

  const handleClick = () => {
    navigate(`/business/${business.id}`);
  };

  const formatAddress = (address) => {
    if (!address) return "Dirección no disponible";
    return address.length > 50 ? `${address.substring(0, 50)}...` : address;
  };

  const getStatusIcon = () => {
    if (isOpen === null) return faClock;
    return isOpen ? faDoorOpen : faDoorClosed;
  };

  return (
    <div className="business-card" onClick={handleClick}>
      <div className="business-card-image-container">
        {business.image ? (
          <img
            src={business.image}
            alt={business.name}
            className="business-card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = Image;
            }}
          />
        ) : (
          <img src={Image} alt={business.name} className="business-card-image" />
        )}
        <div className={`business-status ${getStatusClass()}`}>
          <FontAwesomeIcon icon={getStatusIcon()} />
          <span>{getStatusText()}</span>
        </div>
      </div>
      <div className="business-card-info">
        <h3 className="business-card-name">{business.name}</h3>
        <div className="business-card-details">
          <div className="business-card-address">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>{formatAddress(business.address)}</span>
          </div>
          {business.openingHours && business.openingHours.length > 0 && (
            <div className="business-card-hours">
              <FontAwesomeIcon icon={faClock} />
              <span>Horarios disponibles</span>
            </div>
          )}
        </div>
        <div className="business-card-rating">
          <FontAwesomeIcon icon={faStar} />
          <span>{business.rating ? business.rating.toFixed(1) : "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
