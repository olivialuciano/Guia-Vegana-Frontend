import React, { useEffect, useState } from "react";
import "./InformativeResource.css";

const InformativeResources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch("https://guiavegana.somee.com/api/InformativeResource")
      .then((response) => response.json())
      .then((data) => setResources(data))
      .catch((error) =>
        console.error("Error fetching informative resources:", error)
      );
  }, []);

  return (
    <div className="info-container">
      <div className="header">
        <h1 className="header-title">Recursos informativos</h1>
      </div>
      <div className="info-list">
        {resources.map((resource) => (
          <div key={resource.id} className="info-card">
            <img
              src={resource.image}
              alt={resource.name}
              className="info-image"
            />
            <h2 className="info-name">{resource.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InformativeResources;
