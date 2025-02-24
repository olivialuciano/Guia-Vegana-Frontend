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
          <button className="search-button">
            <img src={Search} alt="buscar" />
          </button>
          <button
            className="filters-button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <img src={FilterImage} alt="filtros" />
          </button>
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
