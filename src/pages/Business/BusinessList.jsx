import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import BusinessCard from "../../components/BusinessCard/BusinessCard";
import NewBusinessForm from "../../components/NewBusinessForm/NewBusinessForm";
import Loading from "../../components/Loading/Loading";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import "./BusinessList.css";

const BusinessList = () => {
  const { user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch("https://localhost:7032/api/Business");
      if (!response.ok) {
        throw new Error("Error al cargar los negocios");
      }
      const data = await response.json();
      
      // Cargar horarios de apertura para cada negocio
      const businessesWithHours = await Promise.all(
        data.map(async (business) => {
          try {
            const hoursResponse = await fetch(`https://localhost:7032/api/OpeningHour/business/${business.id}`);
            if (hoursResponse.ok) {
              const hoursData = await hoursResponse.json();
              return {
                ...business,
                openingHours: hoursData || []
              };
            } else {
              return {
                ...business,
                openingHours: []
              };
            }
          } catch (error) {
            console.error(`Error loading hours for business ${business.id}:`, error);
            return {
              ...business,
              openingHours: []
            };
          }
        })
      );
      
      setBusinesses(businessesWithHours);
    } catch (err) {
      setError("Error al cargar los negocios");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    fetchBusinesses(); // recargar la lista luego de crear un nuevo negocio
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="business-list">
      <Header 
        title="Negocios"
        icon={faStore}
        showRating={false}
        rating={null}
      />

      <div className="list-content">
        {user?.role === "Sysadmin" || user?.role === "Investigador" && (
          <div className="admin-actions">
            <button className="add-button" onClick={handleOpenForm}>
              Agregar Negocio
            </button>
          </div>
        )}

        <div className="business-cards-grid">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>

      {showForm && <NewBusinessForm onClose={handleCloseForm} />}
    </div>
  );
};

export default BusinessList;
