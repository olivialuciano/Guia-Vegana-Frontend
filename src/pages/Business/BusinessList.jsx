import { useEffect, useState } from "react";
import Filter from "../../components/Filter/Filter";
import BusinessCard from "../../components/BusinessCard/BusinessCard";
import Loading from "../../components/Loading/Loading";
import "./BusinessList.css";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [filters, setFilters] = useState({
    plantBased: false,
    glutenFree: false,
    rating: "",
    delivery: "",
    businessType: "",
    zone: "",
    openNow: false,
  });
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false); // Estado para mostrar/ocultar los filtros
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  // Fetch de los negocios desde la API al montar el componente
  useEffect(() => {
    setLoading(true); // Activar el estado de carga antes de la petición

    fetch("https://guiavegana.somee.com/api/Business")
      .then((response) => response.json())
      .then((data) => {
        setBusinesses(data);
        setFilteredBusinesses(data);
      })
      .catch((error) => console.error("Error fetching businesses:", error))
      .finally(() => setLoading(false)); // Desactivar el estado de carga al finalizar
  }, []);

  // Aplicar filtros cuando los filtros cambien
  useEffect(() => {
    const filtered = businesses.filter((business) => {
      if (filters.plantBased && !business.allPlantBased) return false;
      if (filters.glutenFree && !business.glutenFree) return false;
      if (filters.rating && parseInt(filters.rating) !== business.rating)
        return false;
      if (filters.delivery && parseInt(filters.delivery) !== business.delivery)
        return false;
      if (
        filters.businessType &&
        parseInt(filters.businessType) !== business.businessType
      )
        return false;
      if (filters.zone && parseInt(filters.zone) !== business.zone)
        return false;

      // Abierto ahora
      if (filters.openNow) {
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const isOpen = business.openingHours.some((oh) => {
          if (oh.day !== currentDay) return false;
          const open1 = oh.openTime1.split(":").map(Number);
          const close1 = oh.closeTime1.split(":").map(Number);
          const open2 = oh.openTime2
            ? oh.openTime2.split(":").map(Number)
            : null;
          const close2 = oh.closeTime2
            ? oh.closeTime2.split(":").map(Number)
            : null;

          const openTime1 = open1[0] * 60 + open1[1];
          const closeTime1 = close1[0] * 60 + close1[1];
          const openTime2 = open2 ? open2[0] * 60 + open2[1] : null;
          const closeTime2 = close2 ? close2[0] * 60 + close2[1] : null;

          return (
            (currentTime >= openTime1 && currentTime <= closeTime1) ||
            (openTime2 &&
              closeTime2 &&
              currentTime >= openTime2 &&
              currentTime <= closeTime2)
          );
        });

        if (!isOpen) return false;
      }

      return true;
    });

    setFilteredBusinesses(filtered);
  }, [filters, businesses]);

  // Función para manejar cambios en los filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Función para manejar el cambio en el término de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="business-list-container">
      <div className="header">
        <h1 className="header-title">Negocios</h1>
        <div className="header-controls">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar negocios..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="search-button">Buscar</button>
          <button
            className="filters-button"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            {showFilter ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="filter-container">
          <Filter onFilterChange={handleFilterChange} />
        </div>
      )}

      <div className="business-cards-grid">
        {loading ? (
          <Loading />
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <div key={business.id} className="business-card-wrapper">
              <BusinessCard business={business} />
            </div>
          ))
        ) : (
          <p className="no-results">
            No se encontraron negocios que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
};

export default BusinessList;
