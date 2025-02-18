import { useEffect, useState } from "react";
import "./Activism.css";

const Activism = () => {
  const [events, setEvents] = useState([]);

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
          <div key={event.id} className="activism-card">
            <img
              src={event.image}
              alt={event.name}
              className="activism-image"
            />
            <h2 className="activism-title">{event.name}</h2>
            <p className="activism-description">{event.description}</p>
            <p className="activism-contact">Contacto: {event.contact}</p>
            <a
              href={event.socialMediaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="activism-link"
            >
              @{event.socialMediaUsername}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activism;
