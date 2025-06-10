import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import "./InformativeResourceDetail.css";
import defaultImage from "../../assets/img/image.png"; // Asegúrate de que existe

const InformativeResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:7032/api/InformativeResource/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setResource(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resource detail:", error);
        setLoading(false);
      });
  }, [id]);

  const handleImageError = (e) => {
    if (e.target.src !== defaultImage) {
      e.target.onerror = null; // Evita loop infinito
      e.target.src = defaultImage;
    }
  };

  if (loading) {
    return <Loading />;
  }

  const resourceMap = {
    0: "Libro",
    1: "Película/Documental",
    2: "Recurso Web",
  };

  return (
    <div className="resource-detail-container">
      <div className="divtitle">
        <h1>{resource?.name}</h1>
      </div>
      <img
        className="resource-detail-image"
        src={
          resource?.image && resource.image.trim() !== ""
            ? resource.image
            : defaultImage
        }
        alt={resource?.name}
        onError={handleImageError}
      />
      <p className="resource-detail-text-description">
        {resource?.description}
      </p>
      <p className="resource-detail-text">Tópico: {resource?.topic}</p>
      <p className="resource-detail-text">Plataforma: {resource?.platform}</p>
      <p className="resource-detail-text">Tipo: {resourceMap[resource.type]}</p>
    </div>
  );
};

export default InformativeResourceDetail;
