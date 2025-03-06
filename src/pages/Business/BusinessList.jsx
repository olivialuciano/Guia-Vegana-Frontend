import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Importamos el contexto
import Filter from "../../components/Filter/Filter";
import BusinessCard from "../../components/BusinessCard/BusinessCard";
import Loading from "../../components/Loading/Loading";
import NewBusinessForm from "../../components/NewBusinessForm/NewBusinessForm"; // Nuevo formulario
import "./BusinessList.css";

const BusinessList = () => {
  const { role } = useContext(AuthContext); // Obtenemos el rol del usuario
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // Estado del formulario
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
        setFilteredBusinesses(data);
      })
      .catch((error) => console.error("Error fetching businesses:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFilteredBusinesses = () => {
    return businesses.filter((business) => {
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

  useEffect(() => {
    setFilteredBusinesses(getFilteredBusinesses());
  }, [searchTerm, filters]);

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
          {/* Mostrar el botón "+" solo para sysadmin */}
          {role === "Sysadmin" ||
            (role === "Investigador" && (
              <button
                className="add-button"
                onClick={() => setIsFormOpen(true)}
              >
                +
              </button>
            ))}
        </div>
      </div>

      {/* Mostrar el filtro solo si el rol NO es investigador o sysadmin */}
      {role !== "Investigador" && role !== "Sysadmin" && (
        <div className={`filter-container ${isFilterOpen ? "open" : ""}`}>
          <Filter
            isOpen={isFilterOpen}
            setIsOpen={setIsFilterOpen}
            onFilterChange={handleFilterChange}
          />
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

      {/* Modal para agregar nuevo negocio */}
      {isFormOpen && <NewBusinessForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default BusinessList;
