import React from "react";
import "./BusinessCard.css";
import { useNavigate } from "react-router-dom";

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
        />
      ) : (
        <img src="../../assets/img/image.png" className="business-card-image" />
      )}
      <div className="business-card-info">
        <h3 className="business-card-name">{business.name}</h3>
        <p className="business-card-address">{business.address}</p>
        <p className="business-card-rating">{business.rating} ⭐</p>
      </div>
    </div>
  );
};

export default BusinessCard;
