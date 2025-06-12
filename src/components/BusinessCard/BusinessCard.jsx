import React from "react";
import "./BusinessCard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faStar, faClock } from "@fortawesome/free-solid-svg-icons";
import Image from "../../assets/img/image.png";

const BusinessCard = ({ business }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/business/${business.id}`);
  };

  const formatAddress = (address) => {
    if (!address) return "Dirección no disponible";
    return address.length > 50 ? `${address.substring(0, 50)}...` : address;
  };

  const isOpen = () => {
    if (!business.openingHours) return null;
    const now = new Date();
    const day = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const todayHours = business.openingHours.find(hours => hours.day === day);
    if (!todayHours) return null;

    const openTime = todayHours.open.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
    const closeTime = todayHours.close.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);

    return currentTime >= openTime && currentTime <= closeTime;
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
        {business.openingHours && (
          <div className={`business-status ${isOpen() ? 'open' : 'closed'}`}>
            {isOpen() ? 'Abierto' : 'Cerrado'}
          </div>
        )}
      </div>
      <div className="business-card-info">
        <h3 className="business-card-name">{business.name}</h3>
        <div className="business-card-details">
          <div className="business-card-address">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>{formatAddress(business.address)}</span>
          </div>
          {business.openingHours && (
            <div className="business-card-hours">
              <FontAwesomeIcon icon={faClock} />
              <span>{business.openingHours[0].open} - {business.openingHours[0].close}</span>
            </div>
          )}
        </div>
        <div className="business-card-rating">
          <FontAwesomeIcon icon={faStar} />
          <span>{business.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
