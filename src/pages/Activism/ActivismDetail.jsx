import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Activism.css";
import Image from "../../assets/img/image.png";
import "./ActivismDetail.css";

const ActivismDetail = () => {
  const { id } = useParams(); // Obtener ID desde la URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://guiavegana.somee.com/api/Activism/${id}`)
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

  if (loading) return <p>Cargando...</p>;
  if (!event) return <p>No se encontró el activismo.</p>;

  return (
    <div className="activism-detail-container">
      <div className="divtitle">
        <h1 className="activism-title">{event.name}</h1>
      </div>
      <img
        src={event.image || Image}
        alt={event.name}
        className="activism-detail-image"
        onError={(e) => {
          if (e.target.src !== Image) {
            e.target.src = Image;
          }
        }}
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
