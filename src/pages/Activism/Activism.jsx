import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Activism.css";
import Image from "../../assets/img/image.png";
import Loading from "../../components/Loading/Loading"; // Importar el componente Loading

const Activism = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("https://localhost:7032/api/Activism")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />; // Mostrar el componente Loading mientras carga

  return (
    <div className="activism-container">
      <div className="header">
        <h1 className="header-title">Activismos</h1>
      </div>
      <div className="activism">
        {events.map((event) => (
          <div
            key={event.id}
            className="activism-card"
            onClick={() => navigate(`/activism/${event.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={event.image || Image}
              alt={event.name}
              className="activism-image"
              onError={(e) => {
                if (e.target.src !== Image) {
                  e.target.src = Image;
                }
              }}
            />
            <h2 className="activism-title">{event.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activism;
