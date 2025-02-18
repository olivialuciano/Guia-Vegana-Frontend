import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar navegación
import "./Activism.css";
import Image from "../../assets/img/image.png";

const Activism = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Hook para redireccionar

  useEffect(() => {
    fetch("https://guiavegana.somee.com/api/Activism")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

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
            onClick={() => navigate(`/activism/${event.id}`)} // Redirige al hacer clic
            style={{ cursor: "pointer" }} // Indica que se puede hacer clic
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
