// BusinessList.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CardGrid from "../../components/CardGrid/CardGrid";
import Loading from "../../components/Loading/Loading";
import NewBusinessForm from "../../components/NewBusinessForm/NewBusinessForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faFilter, faTimes, faMapMarkerAlt, faStore, faTruck, faBreadSlice, faLeaf, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./BusinessList.css";
import { Link } from "react-router-dom";
import defaultImage from "../../assets/img/image.png";

const zoneMap = {
  0: "Zona Norte",
  1: "Zona Sur",
  2: "Zona Oeste",
  3: "Barrio Pichincha",
  4: "Zona Centro",
  5: "Barrio Martin",
  6: "Avenida Pellegrini",
  7: "Bulevar Oroño",
  8: "Barrio Abasto",
  9: "Barrio La Sexta",
  10: "Barrio Echesortu",
  11: "Barrio Lourdes",
};

const businessTypeMap = {
  0: "Bar / Restaurante",
  1: "Panadería",
  2: "Heladería",
  3: "Mercado / Dietética",
  4: "Emprendimiento",
};

const deliveryMap = {
  0: "Pedidos Ya",
  1: "Rappi",
  2: "Envío propio",
  3: "Otro servicio",
  4: "No tiene delivery",
};

const BusinessList = () => {
  const { role, user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    zone: [],
    businessType: [],
    glutenFree: false,
    allPlantBased: false,
    delivery: [],
  });
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [openSelect, setOpenSelect] = useState(null);

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
    applyFilters();
  }, [filters, businesses]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFilters(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFilters(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const applyFilters = () => {
    let filtered = [...businesses];

    if (filters.name) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.zone.length > 0) {
      filtered = filtered.filter(business =>
        filters.zone.includes(business.zone.toString())
      );
    }

    if (filters.businessType.length > 0) {
      filtered = filtered.filter(business =>
        filters.businessType.includes(business.businessType.toString())
      );
    }

    if (filters.glutenFree) {
      filtered = filtered.filter(business => business.glutenFree);
    }

    if (filters.allPlantBased) {
      filtered = filtered.filter(business => business.allPlantBased);
    }

    if (filters.delivery.length > 0) {
      filtered = filtered.filter(business =>
        filters.delivery.includes(business.delivery.toString())
      );
    }

    setFilteredBusinesses(filtered);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      zone: [],
      businessType: [],
      glutenFree: false,
      allPlantBased: false,
      delivery: [],
    });
  };

  const handleCloseFilters = () => {
    setShowFilters(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseFilters();
    }
  };

  const handleSelectToggle = (selectName) => {
    setOpenSelect(openSelect === selectName ? null : selectName);
  };

  const handleOptionSelect = (selectName, value) => {
    setFilters(prev => {
      const currentValues = prev[selectName];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [selectName]: newValues };
    });
  };

  const handleChipRemove = (selectName, value) => {
    setFilters(prev => ({
      ...prev,
      [selectName]: prev[selectName].filter(v => v !== value)
    }));
  };

  const renderMultiSelect = (name, title, icon, options) => (
    <div className="filter-group">
      <h4>
        <FontAwesomeIcon icon={icon} /> {title}
      </h4>
      <div className="multi-select">
        <div 
          className={`multi-select-header ${openSelect === name ? 'active' : ''}`}
          onClick={() => handleSelectToggle(name)}
        >
          <span>
            {filters[name].length > 0 
              ? `${filters[name].length} seleccionados`
              : 'Seleccionar opciones'}
          </span>
          <FontAwesomeIcon 
            icon={faChevronDown} 
            style={{ 
              transform: openSelect === name ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease'
            }} 
          />
        </div>
        <div className={`multi-select-options ${openSelect === name ? 'show' : ''}`}>
          {Object.entries(options).map(([key, value]) => (
            <div
              key={key}
              className={`multi-select-option ${filters[name].includes(key) ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(name, key)}
            >
              {value}
            </div>
          ))}
        </div>
        {filters[name].length > 0 && (
          <div className="selected-chips">
            {filters[name].map(value => (
              <div key={value} className="chip">
                {options[value]}
                <button onClick={() => handleChipRemove(name, value)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="business-list-container">
      <div className="business-list-header">
        <h1>Negocios</h1>
        
        <div className="search-filter-container">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar negocios..."
              value={filters.name}
              onChange={handleFilterChange}
              name="name"
            />
          </div>
        </div>
      </div>

      <div className="actions-bar">
        <button 
          className="filters-button"
          onClick={() => setShowFilters(true)}
        >
          <FontAwesomeIcon icon={faFilter} />
        </button>

        {user && (role === "Sysadmin" || role === "Investigador") && (
          <button className="add-business-button" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>

      <div 
        className={`filters-overlay ${showFilters ? 'visible' : ''}`}
        onClick={handleOverlayClick}
      >
        <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>
              <FontAwesomeIcon icon={faFilter} /> Filtros
            </h3>
            <button className="close-filters" onClick={handleCloseFilters}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="filter-group">
            <h4>
              <FontAwesomeIcon icon={faSearch} /> Buscar
            </h4>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre..."
            />
          </div>

          {renderMultiSelect('zone', 'Zona', faMapMarkerAlt, zoneMap)}
          {renderMultiSelect('businessType', 'Tipo de Negocio', faStore, businessTypeMap)}
          {renderMultiSelect('delivery', 'Delivery', faTruck, deliveryMap)}

          <div className="filter-group">
            <h4>Características</h4>
            <label>
              <input
                type="checkbox"
                name="glutenFree"
                checked={filters.glutenFree}
                onChange={handleFilterChange}
              />
              <FontAwesomeIcon icon={faBreadSlice} /> Sin gluten
            </label>
            <label>
              <input
                type="checkbox"
                name="allPlantBased"
                checked={filters.allPlantBased}
                onChange={handleFilterChange}
              />
              <FontAwesomeIcon icon={faLeaf} /> 100% basado en plantas
            </label>
          </div>

          <div className="filter-actions">
            <button className="clear-filters" onClick={clearFilters}>
              <FontAwesomeIcon icon={faTimes} /> Limpiar
            </button>
            <button className="apply-filters" onClick={handleCloseFilters}>
              <FontAwesomeIcon icon={faFilter} /> Aplicar
            </button>
          </div>
        </div>
      </div>

      {showForm && <NewBusinessForm onClose={() => setShowForm(false)} />}

      <div className="business-grid">
        {filteredBusinesses.map((business) => (
          <Link
            to={`/business/${business.id}`}
            key={business.id}
            className="business-card"
          >
            <div className="business-image-container">
              <img
                src={business.image || defaultImage}
                alt={business.name}
                className="business-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <div className="business-info">
              <h3>{business.name}</h3>
              <p className="business-zone">
                {zoneMap[business.zone] || business.zone}
              </p>
              <p className="business-type">
                {businessTypeMap[business.businessType] || business.businessType}
              </p>
              <div className="business-features">
                {business.glutenFree && <span className="feature-tag">Sin TACC</span>}
                {business.allPlantBased && <span className="feature-tag">100% Plantas</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BusinessList;
