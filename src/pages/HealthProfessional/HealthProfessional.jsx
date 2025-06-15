import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HealthProfessional.css";
import defaultImage from "../../assets/img/defaultprofileimage.jpg"; // Imagen por defecto
import Loading from "../../components/Loading/Loading";
import Header from "../../components/Header/Header";
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";

const HealthProfessional = () => {
  const [healthProfessionals, setHealthProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://localhost:7032/api/HealthProfessional")
      .then((response) => response.json())
      .then((data) => {
        setHealthProfessionals(data);
        setLoading(false); // Se desactiva el loading solo después de recibir los datos
      })
      .catch((error) => {
        console.error("Error fetching health professionals:", error);
        setLoading(false); // También se desactiva el loading si hay un error
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleImageError = (e) => {
    e.target.src = defaultImage; // Reemplaza la imagen con la predeterminada
  };

  return (
    <div className="health-container">
      <Header 
        title="Profesionales de la Salud" 
        icon={faUserDoctor}
        showRating={false}
        rating={null}
      ></Header>
      <div className="health-list">
        {healthProfessionals.map((professional) => (
          <Link
            key={professional.id}
            to={`/healthprofessional/${professional.id}`}
            className="health-card"
          >
            <img
              src={professional.image || defaultImage} // Si la imagen no existe, usa la predeterminada
              alt={professional.name}
              className="health-image"
              onError={handleImageError} // Si la URL es inválida, se reemplaza
            />
            <h2 className="health-name">{professional.name}</h2>
            <p className="health-specialty">{professional.specialty}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HealthProfessional;
