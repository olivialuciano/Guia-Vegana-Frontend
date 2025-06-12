import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faDoorOpen, faDoorClosed } from "@fortawesome/free-solid-svg-icons";
import "./OpeningHour.css";

const OpeningHour = ({ hours }) => {
  if (!hours || hours.length === 0) {
    return (
      <div className="opening-hour-container">
        <h3 className="opening-hour-title">
          <FontAwesomeIcon icon={faClock} />
          <span>Horarios</span>
        </h3>
        <p className="opening-hour-message">Horarios no disponibles</p>
      </div>
    );
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
    return `${hour}:${minute}`;
  };

  const isOpenNow = () => {
    const now = new Date();
    const currentDay = now.getDay() || 7; // Convertir 0 (Domingo) a 7
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = hours.find(hour => hour.day === currentDay - 1);
    if (!todayHours) return false;

    const openTime1 = todayHours.openTime1.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
    const closeTime1 = todayHours.closeTime1.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);

    if (currentTime >= openTime1 && currentTime <= closeTime1) return true;

    if (todayHours.openTime2 && todayHours.closeTime2) {
      const openTime2 = todayHours.openTime2.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      const closeTime2 = todayHours.closeTime2.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
      return currentTime >= openTime2 && currentTime <= closeTime2;
    }

    return false;
  };

  // Ordenar los horarios por día
  const sortedHours = [...hours].sort((a, b) => a.day - b.day);

  return (
    <div className="opening-hour-container">
      <h3 className="opening-hour-title">
        <FontAwesomeIcon icon={faClock} />
        <span>Horarios</span>
      </h3>
      <div className="opening-status">
        <FontAwesomeIcon icon={isOpenNow() ? faDoorOpen : faDoorClosed} />
        <span>{isOpenNow() ? "Abierto ahora" : "Cerrado"}</span>
      </div>
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
