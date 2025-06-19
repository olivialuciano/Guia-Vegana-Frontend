import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import BusinessCard from "../../components/BusinessCard/BusinessCard";
import NewBusinessForm from "../../components/NewBusinessForm/NewBusinessForm";
import Loading from "../../components/Loading/Loading";
import { 
  faStore, 
  faFilter, 
  faTimes, 
  faSearch, 
  faArrowLeft, 
  faMapMarkerAlt, 
  faTruck, 
  faUtensils, 
  faStar, 
  faWheatAwn, 
  faLeaf, 
  faClock
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { applyBusinessFilters, getFilterStats } from "../../utils/businessFilters";
import "./BusinessList.css";

const BusinessList = () => {
  const { user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    zone: [],
    deliveryType: [],
    businessType: [],
    rating: [],
    glutenFree: false,
    allPlantBased: false,
    openNow: false
  });

  // Mapeos de enums basados en las propiedades de Business
  const zoneMap = {
    0: 'Norte',
    1: 'Sur',
    2: 'Oeste',
    3: 'Pichincha',
    4: 'Centro',
    5: 'Martin',
    6: 'Pellegrini',
    7: 'Oroño',
    8: 'Abasto',
    9: 'Sexta',
    10: 'Echesortu',
    11: 'Lourdes'
  };

  const deliveryTypeMap = {
    0: 'PedidosYa',
    1: 'Rappi',
    2: 'Propio',
    3: 'Otro',
    4: 'NoTiene'
  };

  const businessTypeMap = {
    0: 'Bar/Restaurante',
    1: 'Panaderia',
    2: 'Heladeria',
    3: 'Mercado/Dietetica',
    4: 'Emprendimiento'
  };

  const ratingMap = {
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five'
  };

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
      setFilteredBusinesses(businessesWithHours);
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

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const filtered = applyBusinessFilters(businesses, filters);
    setFilteredBusinesses(filtered);
  }, [businesses, filters]);

  const handleFilterChange = (filterType, value) => {
    let newFilters = { ...filters };

    if (filterType === 'search') {
      newFilters.search = value;
    } else if (filterType === 'glutenFree' || filterType === 'allPlantBased' || filterType === 'openNow') {
      newFilters[filterType] = value;
    } else {
      // Para arrays (zone, deliveryType, businessType, rating)
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
    }

    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      zone: [],
      deliveryType: [],
      businessType: [],
      rating: [],
      glutenFree: false,
      allPlantBased: false,
      openNow: false
    };
    setFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.zone.length > 0) count++;
    if (filters.deliveryType.length > 0) count++;
    if (filters.businessType.length > 0) count++;
    if (filters.rating.length > 0) count++;
    if (filters.glutenFree) count++;
    if (filters.allPlantBased) count++;
    if (filters.openNow) count++;
    return count;
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => {
    setShowForm(false);
    fetchBusinesses(); // recargar la lista luego de crear un nuevo negocio
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i} 
          icon={faStar} 
          className="star" 
          style={{ color: i <= rating ? '#ffd700' : '#e0e0e0' }}
        />
      );
    }
    return stars;
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
        {(user?.role === "Sysadmin" || user?.role === "Investigador") && (
          <div className="admin-actions">
            <button className="add-button" onClick={handleOpenForm}>
              Agregar Negocio
            </button>
          </div>
        )}

        {/* Barra de búsqueda y botón de filtros */}
        <div className="search-filters-bar">
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar negocios..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>

          <button
            className={`filters-toggle-btn ${getActiveFiltersCount() > 0 ? 'has-filters' : ''}`}
            onClick={handleToggleFilters}
            title="Filtros"
          >
            <FontAwesomeIcon icon={faFilter} />
            {getActiveFiltersCount() > 0 && (
              <span className="filter-count">{getActiveFiltersCount()}</span>
            )}
          </button>
        </div>

        {/* Panel lateral de filtros */}
        {showFilters && (
          <div className="filters-overlay" onClick={handleToggleFilters}>
            <div className="filters-panel" onClick={(e) => e.stopPropagation()}>
              <div className="filters-header">
                <button className="back-btn" onClick={handleToggleFilters}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h3>
                  <FontAwesomeIcon icon={faFilter} />
                  Filtros
                </h3>
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  <FontAwesomeIcon icon={faTimes} />
                  Limpiar
                </button>
              </div>

              <div className="filters-content">
                {/* Filtro por zona */}
                <div className="filter-group">
                  <label>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                     {} Zona
                  </label>
                  <div className="chip-filter-container">
                    {Object.entries(zoneMap).map(([key, value]) => (
                      <div
                        key={key}
                        className={`filter-chip ${filters.zone.includes(parseInt(key)) ? 'selected' : ''}`}
                        onClick={() => handleFilterChange('zone', parseInt(key))}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtro por tipo de entrega */}
                <div className="filter-group">
                  <label>
                    <FontAwesomeIcon icon={faTruck} />
                   {} Tipo de Entrega
                  </label>
                  <div className="chip-filter-container">
                    {Object.entries(deliveryTypeMap).map(([key, value]) => (
                      <div
                        key={key}
                        className={`filter-chip ${filters.deliveryType.includes(parseInt(key)) ? 'selected' : ''}`}
                        onClick={() => handleFilterChange('deliveryType', parseInt(key))}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtro por tipo de negocio */}
                <div className="filter-group">
                  <label>
                    <FontAwesomeIcon icon={faUtensils} />
                    {} Tipo de Negocio
                  </label>
                  <div className="chip-filter-container">
                    {Object.entries(businessTypeMap).map(([key, value]) => (
                      <div
                        key={key}
                        className={`filter-chip ${filters.businessType.includes(parseInt(key)) ? 'selected' : ''}`}
                        onClick={() => handleFilterChange('businessType', parseInt(key))}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtro por rating con estrellas */}
                <div className="filter-group">
                  <label>
                    <FontAwesomeIcon icon={faStar} />
                    {} Calificación
                  </label>
                  <div className="star-rating-container">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div 
                        key={rating}
                        className={`star-rating-option ${filters.rating.includes(rating) ? 'selected' : ''}`}
                        onClick={() => handleFilterChange('rating', rating)}
                      >
                        <input 
                          type="checkbox" 
                          checked={filters.rating.includes(rating)}
                          readOnly
                        />
                        <div className="stars">
                          {renderStars(rating)}
                        </div>
                        <span className="star-rating-text">
                        
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtros booleanos */}
                <div className="boolean-filters">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="glutenFree"
                      checked={filters.glutenFree}
                      onChange={(e) => handleFilterChange('glutenFree', e.target.checked)}
                    />
                    <label htmlFor="glutenFree">
                      <FontAwesomeIcon icon={faWheatAwn} />
                      Sin Gluten
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="allPlantBased"
                      checked={filters.allPlantBased}
                      onChange={(e) => handleFilterChange('allPlantBased', e.target.checked)}
                    />
                    <label htmlFor="allPlantBased">
                      <FontAwesomeIcon icon={faLeaf} />
                      100% Plant Based
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="openNow"
                      checked={filters.openNow}
                      onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                    />
                    <label htmlFor="openNow">
                      <FontAwesomeIcon icon={faClock} />
                      Abierto Ahora
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas de filtros */}
        <div className="filter-stats">
          <p>
            Mostrando {filteredBusinesses.length} de {businesses.length} negocios
            {getActiveFiltersCount() > 0 && (
              <span className="active-filters-info">
                {" "}({getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''} activo{getActiveFiltersCount() > 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>

        {filteredBusinesses.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron negocios que coincidan con los filtros aplicados.</p>
            <button 
              className="clear-filters-btn"
              onClick={clearAllFilters}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="business-cards-grid">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>

      {showForm && <NewBusinessForm onClose={handleCloseForm} />}
    </div>
  );
};

export default BusinessList;
