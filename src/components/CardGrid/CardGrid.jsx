import { useState, useEffect } from "react";
import BusinessCard from "../BusinessCard/BusinessCard";
import "./CardGrid.css";

const CardGrid = ({ businesses }) => {
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    setFilteredBusinesses(businesses);
  }, [businesses]);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    
    const filtered = businesses.filter((business) => {
      // Filtro de Plant-Based
      if (filters.plantBased && !business.plantBased) {
        return false;
      }

      // Filtro de Gluten-Free
      if (filters.glutenFree && !business.glutenFree) {
        return false;
      }

      // Filtro de Calificación
      if (filters.rating.length > 0 && !filters.rating.includes(business.rating)) {
        return false;
      }

      // Filtro de Delivery
      if (filters.delivery.length > 0) {
        const hasDelivery = business.delivery.some((delivery) =>
          filters.delivery.includes(delivery)
        );
        if (!hasDelivery) {
          return false;
        }
      }

      // Filtro de Tipo de Negocio
      if (filters.businessType.length > 0 && !filters.businessType.includes(business.businessType)) {
        return false;
      }

      // Filtro de Zona
      if (filters.zone.length > 0 && !filters.zone.includes(business.zone)) {
        return false;
      }

      // Filtro de Abierto Ahora
      if (filters.openNow) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinutes;

        const isOpen = business.openingHours.some((schedule) => {
          const openTime = schedule.open.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
          const closeTime = schedule.close.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0);
          return currentTime >= openTime && currentTime <= closeTime;
        });

        if (!isOpen) {
          return false;
        }
      }

      return true;
    });

    setFilteredBusinesses(filtered);
  };

  return (
    <div className="card-grid-container">
      <div className="card-grid">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron resultados con los filtros seleccionados</p>
          </div>
        )}
      </div>
      <Filter onFilterChange={handleFilterChange} initialFilters={activeFilters} />
    </div>
  );
};

export default CardGrid;
