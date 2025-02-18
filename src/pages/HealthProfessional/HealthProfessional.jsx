import React, { useEffect, useState } from "react";
import "./HealthProfessional.css";

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

  return (
    <div className="health-container">
      <div className="header">
        <h1 className="header-title">Profesionales de la Salud</h1>
      </div>
      <div className="health-list">
        {healthProfessionals.map((professional) => (
          <div key={professional.id} className="health-card">
            <img
              src={professional.image}
              alt={professional.name}
              className="health-image"
            />
            <h2 className="health-name">{professional.name}</h2>
            <p className="health-specialty">
              Especialidad: {professional.specialty}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthProfessional;
