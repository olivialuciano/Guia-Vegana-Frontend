import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./HealthProfessionalDetail.css";
import defaultImage from "../../assets/img/defaultprofileimage.jpg";
import Loading from "../../components/Loading/Loading";

const HealthProfessionalDetail = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true); // Eliminé la duplicación

  useEffect(() => {
    setLoading(true);
    fetch(`https://localhost:7032/api/HealthProfessional/${id}`)
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

  if (loading) return <Loading />; // Se usa el componente en lugar de texto plano
  if (!professional) return <p>No se encontró el profesional.</p>;

  const handleImageError = (e) => {
    e.target.src = defaultImage; // Reemplaza la imagen con la predeterminada
  };

  return (
    <div className="health-detail-container">
      <div className="divtitle">
        <h1 className="health-title">{professional.name}</h1>
      </div>
      <img
        src={professional.image || defaultImage} // Si la imagen no existe, usa la predeterminada
        alt={professional.name}
        className="health-detail-image"
        onError={handleImageError} // Si la URL es inválida, se reemplaza
      />
      <p className="health-specialty">Especialidad: {professional.specialty}</p>
      <p className="health-license">Matrícula: {professional.license}</p>
      <p className="health-contact">WhatsApp: {professional.whatsappNumber}</p>
      <p className="health-email">Email: {professional.email}</p>
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
