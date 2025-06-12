import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faUtensils } from "@fortawesome/free-solid-svg-icons";
import "./VeganOption.css";

const VeganOption = ({ options }) => {
  if (!options || options.length === 0) {
    return (
      <div className="vegan-option-container">
        <h3 className="vegan-option-title">
          <FontAwesomeIcon icon={faLeaf} />
          <span>Opciones Veganas</span>
        </h3>
        <p className="vegan-option-message">
          No hay opciones veganas disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="vegan-option-container">
      <h3 className="vegan-option-title">
        <FontAwesomeIcon icon={faLeaf} />
        <span>Opciones Veganas</span>
      </h3>
      <div className="vegan-option-count">
        <FontAwesomeIcon icon={faUtensils} />
        <span>{options.length} opciones disponibles</span>
      </div>
      <ul className="vegan-option-list">
        {options.map((option) => (
          <li key={option.id} className="vegan-option-item">
            <div className="vegan-option-info">
              <span className="vegan-option-name">{option.name}</span>
              {option.description && (
                <p className="vegan-option-description">{option.description}</p>
              )}
            </div>
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
