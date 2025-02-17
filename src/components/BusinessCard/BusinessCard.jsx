import React from "react";
import "./BusinessCard.css";
import { useNavigate } from "react-router-dom";
import Image from "../../assets/img/image.png";

const BusinessCard = ({ business }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/business/${business.id}`);
  };

  return (
    <div className="business-card" onClick={handleClick}>
      {business.image ? (
        <img
          src={business.image}
          alt={business.name}
          className="business-card-image"
          onError={(e) => {
            e.target.onerror = null; // Evita loops infinitos en caso de error
            e.target.src = Image; // Asigna la imagen por defecto
          }}
        />
      ) : (
        <img src={Image} alt={business.name} className="business-card-image" />
      )}
      <div className="business-card-info">
        <h3 className="business-card-name">{business.name}</h3>
        <p className="business-card-address">{business.address}</p>
        <div className="business-card-rating">
          {Array.from({ length: business.rating }, (_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
