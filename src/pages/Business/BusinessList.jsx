// BusinessList.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CardGrid from "../../components/CardGrid/CardGrid";
import Loading from "../../components/Loading/Loading";
import NewBusinessForm from "../../components/NewBusinessForm/NewBusinessForm";
import Filter from "../../components/Filter/Filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./BusinessList.css";

const BusinessList = () => {
  const { role } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch("https://localhost:7032/api/Business")
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data);
        setFilteredBusinesses(data);
      })
      .catch((e) => console.error("Error fetching businesses:", e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = businesses.filter((business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBusinesses(filtered);
  }, [searchQuery, businesses]);

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="business-list-container">
      <div className="business-header">
        <h1 className="business-title">Negocios</h1>
        <p className="business-description">
          Bares, restaurantes, heladerías, dietéticas, panaderías y mercados.
        </p>
      </div>

      <div className="search-filter-container">
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar negocios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <Filter onFilterChange={handleFilterChange} initialFilters={activeFilters} />
      </div>

      {role === "admin" && (
        <button className="add-button" onClick={() => setIsFormOpen(true)}>
          +
        </button>
      )}
      <CardGrid businesses={filteredBusinesses} />
      {isFormOpen && <NewBusinessForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default BusinessList;
