import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../components/Card/Card";
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
  faClock,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { applyBusinessFilters, getFilterStats } from "../../utils/businessFilters";
import { API } from '../../services/api';
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
      const response = await fetch(`${API}/Business`);
      if (!response.ok) {
        throw new Error("Error al cargar los negocios");
      }
      const data = await response.json();
      
      // Cargar horarios de apertura para cada negocio
      const businessesWithHours = await Promise.all(
        data.map(async (business) => {
          try {
            const hoursResponse = await fetch(`${API}/OpeningHour/business/${business.id}`);
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
            // Continue without opening hours if there's an error
          }
        })
      );
      
      setBusinesses(businessesWithHours);
      setFilteredBusinesses(businessesWithHours);
    } catch (err) {
      setError("Error al cargar los negocios");
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
          className={i <= rating ? "star filled" : "star"} 
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <Loading text="Cargando negocios..." subtitle="Buscando los mejores lugares veganos" />;
  }

  if (error) {
    return (
      <div className="business-list">
        <div className="list-content">
          <div className="error-container">
            <p>{error}</p>
            <button className="add-button" onClick={fetchBusinesses}>
              <FontAwesomeIcon icon={faRefresh} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filterStats = getFilterStats(businesses, filters);

  return (
    <div className="business-list-container">
      <div className="business-list">
        <div className="list-content">
          {/* Header de la página */}
          <div className="page-header">
            <h1 className="page-title">Negocios</h1>
            {/* Barra de acciones */}
          <div className="actions-bar">
            <div className="admin-actions">
              {user && (
                <button className="add-button" onClick={handleOpenForm}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Agregar Negocio</span>
                </button>
              )}
            </div>
          </div>
          </div>

          

          {/* Barra de búsqueda y filtros */}
          <div className="search-filters-bar">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar negocios..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
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

          {/* Estadísticas de filtros */}
          <div className="filter-stats">
            <p>
              Mostrando <span className="active-filters-info">{filteredBusinesses.length}</span> de {businesses.length} negocios
              {getActiveFiltersCount() > 0 && (
                <span> con filtros activos</span>
              )}
            </p>
          </div>

          {/* Grid de tarjetas */}
          {filteredBusinesses.length > 0 ? (
            <div className="business-cards-grid">
              {filteredBusinesses.map((business) => (
                <Card
                  key={business.id}
                  title={business.name}
                  subtitle={businessTypeMap[business.businessType]}
                  description={business.description}
                  image={business.image}
                  icon={faStore}
                  rating={business.rating}
                  info={{
                    icon: faMapMarkerAlt,
                    text: zoneMap[business.zone] || 'Zona no especificada'
                  }}
                  to={`/business/${business.id}`}
                  businessData={business}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No se encontraron negocios con los filtros aplicados</p>
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Limpiar Filtros
              </button>
            </div>
          )}

          {/* Panel de filtros */}
          {showFilters && (
            <div className="filters-overlay" onClick={handleToggleFilters}>
              <div className="filters-panel" onClick={(e) => e.stopPropagation()}>
                <div className="filters-header">
                  <h3>Filtros</h3>
                  <button className="back-btn" onClick={handleToggleFilters}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                <div className="filters-content">
                  {/* Zona */}
                  <div className="filter-group">
                    <label>Zona</label>
                    <div className="chip-filter-container">
                      {Object.entries(zoneMap).map(([key, value]) => (
                        <button
                          key={key}
                          className={`filter-chip ${filters.zone.includes(parseInt(key)) ? 'selected' : ''}`}
                          onClick={() => handleFilterChange('zone', parseInt(key))}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tipo de negocio */}
                  <div className="filter-group">
                    <label>Tipo de Negocio</label>
                    <div className="chip-filter-container">
                      {Object.entries(businessTypeMap).map(([key, value]) => (
                        <button
                          key={key}
                          className={`filter-chip ${filters.businessType.includes(parseInt(key)) ? 'selected' : ''}`}
                          onClick={() => handleFilterChange('businessType', parseInt(key))}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="filter-group">
                    <label>Delivery</label>
                    <div className="chip-filter-container">
                      {Object.entries(deliveryTypeMap).map(([key, value]) => (
                        <button
                          key={key}
                          className={`filter-chip ${filters.deliveryType.includes(parseInt(key)) ? 'selected' : ''}`}
                          onClick={() => handleFilterChange('deliveryType', parseInt(key))}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="filter-group">
                    <label>Calificación</label>
                    <div className="star-rating-container">
                      {Object.entries(ratingMap).map(([key]) => (
                        <div
                          key={key}
                          className={`star-rating-option ${filters.rating.includes(parseInt(key)) ? 'selected' : ''}`}
                          onClick={() => handleFilterChange('rating', parseInt(key))}
                        >
                          <input
                            type="checkbox"
                            checked={filters.rating.includes(parseInt(key))}
                            onChange={() => {}}
                          />
                          <div className="stars">
                            {renderStars(parseInt(key))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filtros booleanos */}
                  <div className="filter-group">
                    <label>Opciones Especiales</label>
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
                         {} Sin Gluten
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
                          {} 100% Basado en Plantas
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
                          {} Abierto Ahora 
                        </label>
                      </div>
                    </div>
                  </div>

                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Limpiar Todos los Filtros
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de nuevo negocio */}
          {showForm && (
            <NewBusinessForm onClose={handleCloseForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
