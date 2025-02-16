import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BusinessDetail.css";
import Loading from "../../components/Loading/Loading";
import OpeningHour from "../../components/OpeningHour/OpeningHour";
import VeganOption from "../../components/VeganOption/VeganOption";

const BusinessDetail = () => {
  const [business, setBusiness] = useState(null);
  const [openingHours, setOpeningHours] = useState([]);
  const [veganOptions, setVeganOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch para obtener los detalles del negocio
        const businessResponse = await fetch(
          `https://guiavegana.somee.com/api/Business/${id}`
        );
        const businessData = await businessResponse.json();
        setBusiness(businessData);

        // Fetch para obtener los horarios de apertura
        const openingHoursResponse = await fetch(
          `https://guiavegana.somee.com/api/openinghour/business/${id}`
        );
        const openingHoursData = await openingHoursResponse.json();
        setOpeningHours(openingHoursData);

        // Fetch para obtener las opciones veganas
        const veganOptionsResponse = await fetch(
          `https://guiavegana.somee.com/api/VeganOption/business/${id}`
        );
        const veganOptionsData = await veganOptionsResponse.json();
        setVeganOptions(veganOptionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!business) {
    return <div>No se encontraron detalles del negocio.</div>;
  }

  return (
    <div className="business-detail">
      <div className="header">
        {business.image && (
          <img
            src={business.image}
            alt={business.name}
            className="business-image"
          />
        )}
        <h1>{business.name}</h1>
        <p>{business.address}</p>
      </div>

      <div className="section-container">
        <div>
          <OpeningHour hours={openingHours} />
        </div>
        <div>
          <VeganOption options={veganOptions} />
        </div>
      </div>

      <div className="footer">
        <a
          href={business.socialMediaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          Visitar en Redes Sociales
        </a>
      </div>
    </div>
  );
};

export default BusinessDetail;
