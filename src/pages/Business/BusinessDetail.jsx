import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BusinessDetail.css";
import Loading from "../../components/Loading/Loading";
import OpeningHour from "../../components/OpeningHour/OpeningHour";
import VeganOption from "../../components/VeganOption/VeganOption";
import defaultImage from "../../assets/img/image.png";
import Header from "../../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMapMarkerAlt, faTruck, faLeaf, faBreadSlice, faStore } from "@fortawesome/free-solid-svg-icons";

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
          `https://localhost:7032/api/Business/${id}`
        );
        const businessData = await businessResponse.json();

        setBusiness(businessData);

        // Fetch para obtener los horarios de apertura
        const openingHoursResponse = await fetch(
          `https://localhost:7032/api/openinghour/business/${id}`
        );
        const openingHoursData = await openingHoursResponse.json();
        setOpeningHours(openingHoursData);

        // Fetch para obtener las opciones veganas
        const veganOptionsResponse = await fetch(
          `https://localhost:7032/api/VeganOption/business/${id}`
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

  const zoneMap = {
    0: "Zona Norte",
    1: "Zona Sur",
    2: "Zona Oeste",
    3: "Barrio Pichincha",
    4: "Zona Centro",
    5: "Barrio Martin",
    6: "Avenida Pellegrini",
    7: "Bulevar Oroño",
    8: "Barrio Abasto",
    9: "Barrio La Sexta",
    10: "Barrio Echesortu",
    11: "Barrio Lourdes",
  };

  const deliveryMap = {
    0: "Pedidos Ya",
    1: "Rappi",
    2: "Envío propio",
    3: "Otro servicio",
    4: "No tiene delivery",
  };

  const ratingMap = {
    1: "⭐",
    2: "⭐⭐",
    3: "⭐⭐⭐",
    4: "⭐⭐⭐⭐",
    5: "⭐⭐⭐⭐⭐",
  };

  const businessTypeMap = {
    0: "Bar / Restaurante",
    1: "Panadería",
    2: "Heladería",
    3: "Mercado / Dietética",
    4: "Emprendimiento",
  };

  return (
    <div className="business-detail-container">
      <Header 
        title={business.name} 
        icon={faStore}
        showRating={true}
        rating={business.rating}
      ></Header>


      <div className="business-image-container">
        <img
          src={business.image || defaultImage}
          alt={business.name}
          className="business-detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
      </div>

      <div className="business-info-container">
        <div className="business-type">
          {businessTypeMap[business.businessType] || business.businessType}
        </div>

        <div className="business-location">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <div className="location-details">
            <p className="business-address">{business.address}</p>
            <p className="business-zone">{zoneMap[business.zone] || business.zone}</p>
          </div>
        </div>

        <div className="business-features">
          {business.glutenFree && (
            <div className="feature-tag">
              <FontAwesomeIcon icon={faBreadSlice} />
              <span>Opciones sin TACC</span>
            </div>
          )}
          {business.allPlantBased && (
            <div className="feature-tag">
              <FontAwesomeIcon icon={faLeaf} />
              <span>100% basado en plantas</span>
            </div>
          )}
        </div>

        <div className="business-delivery">
          <FontAwesomeIcon icon={faTruck} />
          <span>{deliveryMap[business.delivery] || business.delivery}</span>
        </div>
      </div>

      <div className="business-details-grid">
        <OpeningHour hours={openingHours} />
        <VeganOption options={veganOptions} />
      </div>
    </div>
  );
};

export default BusinessDetail;
