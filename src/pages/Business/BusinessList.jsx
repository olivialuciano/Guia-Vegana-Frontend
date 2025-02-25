import { useEffect, useState } from "react";
import Filter from "../../components/Filter/Filter";
import BusinessCard from "../../components/BusinessCard/BusinessCard";
import Loading from "../../components/Loading/Loading";
import "./BusinessList.css";
import Search from "../../assets/img/search.png";
import FilterImage from "../../assets/img/filter.png";

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
        setFilteredBusinesses(data);
      })
      .catch((error) => console.error("Error fetching businesses:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const filtered = businesses.filter((business) => {
      return (
        (!newFilters.plantBased || business.plantBased) &&
        (!newFilters.glutenFree || business.glutenFree) &&
        (!newFilters.rating.length ||
          newFilters.rating.includes(String(business.rating))) &&
        (!newFilters.delivery.length ||
          newFilters.delivery.includes(String(business.delivery))) &&
        (!newFilters.businessType.length ||
          newFilters.businessType.includes(String(business.businessType))) &&
        (!newFilters.zone.length ||
          newFilters.zone.includes(String(business.zone))) &&
        (!newFilters.openNow || business.openNow)
      );
    });

    setFilteredBusinesses(filtered);
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
