import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HealthProfessional.css";
import defaultImage from "../../assets/img/defaultprofileimage.jpg"; // Imagen por defecto

const HealthProfessional = () => {
  const [healthProfessionals, setHealthProfessionals] = useState([]);

  useEffect(() => {
    fetch("https://guiavegana.somee.com/api/HealthProfessional")
      .then((response) => response.json())
      .then((data) => setHealthProfessionals(data))
      .catch((error) =>
        console.error("Error fetching health professionals:", error)
      );
  }, []);

  const handleImageError = (e) => {
    e.target.src = defaultImage; // Reemplaza la imagen con la predeterminada
  };

  return (
    <div className="health-container">
      <div className="header">
        <h1 className="header-title">Profesionales de la Salud</h1>
      </div>
      <div className="health-list">
        {healthProfessionals.map((professional) => (
          <Link
            key={professional.id}
            to={`/healthprofessional/${professional.id}`}
            className="health-card"
          >
            <img
              src={professional.image || defaultImage} // Si la imagen no existe, usa la predeterminada
              alt={professional.name}
              className="health-image"
              onError={handleImageError} // Si la URL es inválida, se reemplaza
            />
            <h2 className="health-name">{professional.name}</h2>
            <p className="health-specialty">{professional.specialty}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HealthProfessional;
