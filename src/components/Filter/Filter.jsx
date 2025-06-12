import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes, faCheck, faMapMarkerAlt, faStar, faTruck, faStore, faClock } from "@fortawesome/free-solid-svg-icons";
import "./Filter.css";
import Filterimg from "../../assets/img/filter.png";
import Select from "react-select";

const zoneMap = [
  { value: 0, label: "Zona Norte" },
  { value: 1, label: "Zona Sur" },
  { value: 2, label: "Zona Oeste" },
  { value: 3, label: "Barrio Pichincha" },
  { value: 4, label: "Zona Centro" },
  { value: 5, label: "Barrio Martin" },
  { value: 6, label: "Avenida Pellegrini" },
  { value: 7, label: "Bulevar Oroño" },
  { value: 8, label: "Barrio Abasto" },
  { value: 9, label: "Barrio La Sexta" },
  { value: 10, label: "Barrio Echesortu" },
  { value: 11, label: "Barrio Lourdes" },
];

const deliveryMap = [
  { value: 0, label: "Pedidos Ya" },
  { value: 1, label: "Rappi" },
  { value: 2, label: "Envío propio" },
  { value: 3, label: "Otro servicio" },
  { value: 4, label: "No tiene delivery" },
];

const ratingMap = [
  { value: 1, label: "⭐" },
  { value: 2, label: "⭐⭐" },
  { value: 3, label: "⭐⭐⭐" },
  { value: 4, label: "⭐⭐⭐⭐" },
  { value: 5, label: "⭐⭐⭐⭐⭐" },
];

const businessTypeMap = [
  { value: 0, label: "Bar / Restaurante" },
  { value: 1, label: "Panadería" },
  { value: 2, label: "Heladería" },
  { value: 3, label: "Mercado / Dietética" },
  { value: 4, label: "Emprendimiento" },
];

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'white',
    borderColor: 'var(--background-dark)',
    '&:hover': {
      borderColor: 'var(--primary-color)'
    }
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? 'var(--primary-color)' : 'white',
    color: state.isSelected ? 'white' : 'var(--text-primary)',
    '&:hover': {
      backgroundColor: state.isSelected ? 'var(--primary-color)' : 'var(--background-dark)'
    }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'var(--primary-light)'
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'var(--primary-dark)'
  })
};

const Filter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    plantBased: false,
    glutenFree: false,
    rating: [],
    delivery: [],
    businessType: [],
    zone: [],
    openNow: false,
    ...initialFilters
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    // Contar filtros activos
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        return acc + value.length;
      }
      return acc + (value ? 1 : 0);
    }, 0);
    setActiveFilters(count);
  }, [filters]);

  const handleChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const resetState = {
      plantBased: false,
      glutenFree: false,
      rating: [],
      delivery: [],
      businessType: [],
      zone: [],
      openNow: false,
    };
    setFilters(resetState);
    onFilterChange(resetState);
  };

  return (
    <>
      <button className="filter-button" onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon icon={faFilter} />
        <span>Filtros</span>
        {activeFilters > 0 && (
          <span className="filter-badge">{activeFilters}</span>
        )}
      </button>

      <div className={`filter-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />

      <div className={`filter-wrapper ${isOpen ? 'open' : ''}`}>
        <div className="filter-header">
          <h2>Filtros</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="filter-content">
          <div className="filter-group">
            <h3>
              <FontAwesomeIcon icon={faStore} />
              <span>Opciones</span>
            </h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="plantBased"
                checked={filters.plantBased}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
              />
              <span>100% Plant-Based</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="glutenFree"
                checked={filters.glutenFree}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
              />
              <span>Opciones Gluten-Free</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="openNow"
                checked={filters.openNow}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
              />
              <span>Abierto ahora</span>
            </label>
          </div>

          <div className="filter-group">
            <h3>
              <FontAwesomeIcon icon={faStar} />
              <span>Calificación</span>
            </h3>
            <Select
              isMulti
              options={ratingMap}
              value={ratingMap.filter((opt) => filters.rating.includes(opt.value))}
              onChange={(selected) => handleChange('rating', selected.map((item) => item.value))}
              styles={customSelectStyles}
              placeholder="Seleccionar calificación..."
            />
          </div>

          <div className="filter-group">
            <h3>
              <FontAwesomeIcon icon={faTruck} />
              <span>Delivery</span>
            </h3>
            <Select
              isMulti
              options={deliveryMap}
              value={deliveryMap.filter((opt) => filters.delivery.includes(opt.value))}
              onChange={(selected) => handleChange('delivery', selected.map((item) => item.value))}
              styles={customSelectStyles}
              placeholder="Seleccionar servicios de delivery..."
            />
          </div>

          <div className="filter-group">
            <h3>
              <FontAwesomeIcon icon={faStore} />
              <span>Tipo de negocio</span>
            </h3>
            <Select
              isMulti
              options={businessTypeMap}
              value={businessTypeMap.filter((opt) => filters.businessType.includes(opt.value))}
              onChange={(selected) => handleChange('businessType', selected.map((item) => item.value))}
              styles={customSelectStyles}
              placeholder="Seleccionar tipo de negocio..."
            />
          </div>

          <div className="filter-group">
            <h3>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>Zona</span>
            </h3>
            <Select
              isMulti
              options={zoneMap}
              value={zoneMap.filter((opt) => filters.zone.includes(opt.value))}
              onChange={(selected) => handleChange('zone', selected.map((item) => item.value))}
              styles={customSelectStyles}
              placeholder="Seleccionar zona..."
            />
          </div>
        </div>

        <div className="filter-footer">
          <button className="reset-filters-btn" onClick={resetFilters}>
            Limpiar filtros
          </button>
          <button className="apply-filters-btn" onClick={() => setIsOpen(false)}>
            <FontAwesomeIcon icon={faCheck} />
            <span>Aplicar filtros</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
