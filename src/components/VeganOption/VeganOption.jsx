import React from "react";
import "./VeganOption.css";

const VeganOption = ({ options }) => {
  if (!options || options.length === 0) {
    return (
      <p className="vegan-option-message">
        No hay opciones veganas disponibles
      </p>
    );
  }

  return (
    <div className="vegan-option-container">
      <h3 className="vegan-option-title">Opciones Veganas</h3>
      <ul className="vegan-option-list">
        {options.map((option) => (
          <li key={option.id} className="vegan-option-item">
            <span className="vegan-option-name">{option.name}</span>
            <span className="vegan-option-price">
              ${option.price.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VeganOption;
