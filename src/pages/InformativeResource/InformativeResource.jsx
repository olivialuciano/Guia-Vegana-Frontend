import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Usamos useNavigate para la navegación
import "./InformativeResource.css";
import Loading from "../../components/Loading/Loading";
import defaultImage from "../../assets/img/image.png";

const InformativeResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    setLoading(true);
    fetch("https://guiavegana.somee.com/api/InformativeResource")
      .then((response) => response.json())
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching informative resources:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleImageError = (e) => {
    e.target.src = defaultImage; // Imagen por defecto si falla
  };

  // Función para manejar el clic y redirigir a la página de detalles
  const handleCardClick = (id) => {
    navigate(`/informativeresource/${id}`); // Redirige al detalle de la tarjeta
  };

  return (
    <div className="info-container">
      <div className="header">
        <h1 className="header-title">Recursos informativos</h1>
      </div>
      <div className="info-list">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="info-card"
            onClick={() => handleCardClick(resource.id)} // Redirige al hacer clic
          >
            <img
              src={resource.image ? resource.image : defaultImage}
              alt={resource.name}
              className="info-image"
              onError={handleImageError}
            />
            <h2 className="info-name">{resource.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InformativeResources;
