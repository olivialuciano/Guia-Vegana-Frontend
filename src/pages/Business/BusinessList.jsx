import { useEffect, useState } from "react";
import Filter from "../../components/Filter/Filter";
import BusinessCard from "../../components/BusinessCard/BusinessCard";
import Loading from "../../components/Loading/Loading";
import "./BusinessList.css";

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    plantBased: false,
    glutenFree: false,
    rating: "",
    delivery: "",
    businessType: "",
    zone: "",
    openNow: false,
  });

  useEffect(() => {
    setLoading(true);
    fetch("https://guiavegana.somee.com/api/Business")
      .then((response) => response.json())
      .then((data) => {
        setBusinesses(data);
        setFilteredBusinesses(data); // Inicialmente mostramos todos los negocios
      })
      .catch((error) => console.error("Error fetching businesses:", error))
      .finally(() => setLoading(false));
  }, []);

  // Función para manejar el cambio de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar negocios por el término de búsqueda y filtros aplicados
  const getFilteredBusinesses = () => {
    return businesses.filter((business) => {
      // Asegúrate de que el nombre y la descripción existan antes de aplicar toLowerCase
      const businessName = business.name ? business.name.toLowerCase() : "";
      const businessDescription = business.description
        ? business.description.toLowerCase()
        : "";

      const matchesSearchTerm =
        businessName.includes(searchTerm.toLowerCase()) ||
        businessDescription.includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.plantBased || business.plantBased) &&
        (!filters.glutenFree || business.glutenFree) &&
        (!filters.rating.length ||
          filters.rating.includes(String(business.rating))) &&
        (!filters.delivery.length ||
          filters.delivery.includes(String(business.delivery))) &&
        (!filters.businessType.length ||
          filters.businessType.includes(String(business.businessType))) &&
        (!filters.zone.length ||
          filters.zone.includes(String(business.zone))) &&
        (!filters.openNow || business.openNow);

      return matchesSearchTerm && matchesFilters;
    });
  };

  // Actualizar los negocios filtrados cada vez que el término de búsqueda o los filtros cambien
  useEffect(() => {
    setFilteredBusinesses(getFilteredBusinesses());
  }, [searchTerm, filters]); // Depende de searchTerm y filtros

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
        </div>
      </div>
      <div className={`filter-container ${isFilterOpen ? "open" : ""}`}>
        <Filter
          isOpen={isFilterOpen}
          setIsOpen={setIsFilterOpen}
          onFilterChange={handleFilterChange}
        />
      </div>

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
