import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ActivismDetail.css";
import Image from "../../assets/img/image.png";
import Loading from "../../components/Loading/Loading"; // Importar el componente Loading

const ActivismDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); // Eliminar duplicación y usar el estado correctamente

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:7032/api/Activism/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loading />; // Mostrar el componente Loading mientras carga
  if (!event) return <p>No se encontró el activismo.</p>;

  const handleImageError = (e) => {
    if (e.target.src !== Image) {
      e.target.src = Image; // Reemplazar la imagen con la predeterminada si hay error
    }
  };

  return (
    <div className="activism-detail-container">
      <div className="divtitle">
        <h1 className="activism-title">{event.name}</h1>
      </div>
      <img
        src={event.image || Image} // Si no hay imagen, usa la predeterminada
        alt={event.name}
        className="activism-detail-image"
        onError={handleImageError} // Reemplaza la imagen si la URL es inválida
      />
      <p className="activism-description">{event.description}</p>
      <p className="activism-contact">Contacto: {event.contact}</p>
      {event.socialMediaLink && (
        <a
          href={event.socialMediaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="activism-link"
        >
          @{event.socialMediaUsername}
        </a>
      )}
    </div>
  );
};

export default ActivismDetail;
