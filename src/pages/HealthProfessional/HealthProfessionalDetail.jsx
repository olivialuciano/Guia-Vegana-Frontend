import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./HealthProfessionalDetail.css";

const HealthProfessionalDetail = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://guiavegana.somee.com/api/HealthProfessional/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfessional(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching professional details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (!professional) return <p>No se encontró el profesional.</p>;

  return (
    <div className="health-detail-container">
      <h1 className="health-title">{professional.name}</h1>
      <img
        src={professional.image}
        alt={professional.name}
        className="health-detail-image"
      />
      <p className="health-specialty">
        <strong>Especialidad:</strong> {professional.specialty}
      </p>
      <p className="health-license">
        <strong>Matrícula:</strong> {professional.license}
      </p>
      <p className="health-contact">
        <strong>WhatsApp:</strong> {professional.whatsappNumber}
      </p>
      <p className="health-email">
        <strong>Email:</strong> {professional.email}
      </p>
      {professional.socialMediaLink && (
        <a
          href={professional.socialMediaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="health-social"
        >
          @{professional.socialMediaUsername}
        </a>
      )}
    </div>
  );
};

export default HealthProfessionalDetail;
