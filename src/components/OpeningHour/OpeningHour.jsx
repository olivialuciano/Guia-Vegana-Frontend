import React from "react";
import "./OpeningHour.css";

const OpeningHour = ({ hours }) => {
  if (!hours || hours.length === 0) {
    return <p className="opening-hour-message">Horarios no disponibles</p>;
  }

  const dayNames = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`; // Extrae solo la hora y los minutos
  };

  // Ordenar los horarios por día
  const sortedHours = [...hours].sort((a, b) => a.day - b.day);

  return (
    <div className="opening-hour-container">
      <h3 className="opening-hour-title">Horarios</h3>
      <ul className="opening-hour-list">
        {sortedHours.map((hour) => (
          <li key={hour.id} className="opening-hour-item">
            <div className="opening-hour-day">{dayNames[hour.day]}</div>
            <div className="opening-hour-time">
              {formatTime(hour.openTime1)} - {formatTime(hour.closeTime1)}
              {hour.openTime2 && hour.closeTime2 && (
                <>
                  {" "}
                  / {formatTime(hour.openTime2)} - {formatTime(hour.closeTime2)}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpeningHour;
