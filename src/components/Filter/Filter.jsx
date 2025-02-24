import { useState } from "react";
import "./Filter.css";
import Filterimg from "../../assets/img/filter.png";

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    plantBased: false,
    glutenFree: false,
    rating: "",
    delivery: "",
    businessType: "",
    zone: "",
    openNow: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: newValue,
    }));
  };

  return (
    <>
      <button className="filter-button" onClick={() => setIsOpen(true)}>
        <img src={Filterimg} alt="filtros" />
      </button>

      <div className={`filter-wrapper ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>

        <h2>Filtros</h2>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              name="plantBased"
              checked={filters.plantBased}
              onChange={handleChange}
            />
            100% Plant-Based
          </label>

          <label>
            <input
              type="checkbox"
              name="glutenFree"
              checked={filters.glutenFree}
              onChange={handleChange}
            />
            Opciones Gluten-Free
          </label>
        </div>

        <div className="filter-group">
          <label>
            Estrellas:
            <select
              name="rating"
              value={filters.rating}
              onChange={handleChange}
            >
              <option value="">Todas</option>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} ⭐
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            Delivery:
            <select
              name="delivery"
              value={filters.delivery}
              onChange={handleChange}
            >
              <option value="">Todos</option>
              <option value="0">Pedidos Ya</option>
              <option value="1">Rappi</option>
              <option value="2">Propio</option>
              <option value="3">Otro</option>
              <option value="4">No tiene</option>
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            Tipo de negocio:
            <select
              name="businessType"
              value={filters.businessType}
              onChange={handleChange}
            >
              <option value="">Todos</option>
              <option value="0">Bares y Restaurantes</option>
              <option value="1">Panaderías</option>
              <option value="2">Heladerías</option>
              <option value="3">Mercados y Dietéticas</option>
              <option value="4">Emprendimientos</option>
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            Zona:
            <select name="zone" value={filters.zone} onChange={handleChange}>
              <option value="">Todas</option>
              <option value="0">Norte</option>
              <option value="1">Sur</option>
              <option value="2">Oeste</option>
              <option value="3">Pichincha</option>
              <option value="4">Centro</option>
              <option value="5">Martin</option>
              <option value="6">Pellegrini</option>
              <option value="7">Oroño</option>
              <option value="8">Abasto</option>
              <option value="9">Sexta</option>
              <option value="10">Echesortu</option>
              <option value="11">Lourdes</option>
            </select>
          </label>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              name="openNow"
              checked={filters.openNow}
              onChange={handleChange}
            />
            Abierto ahora
          </label>
        </div>

        {/* Botón de Aplicar Filtros */}
        <button
          className="apply-filters-btn"
          onClick={() => onFilterChange(filters)}
        >
          Aplicar filtros
        </button>
      </div>
    </>
  );
};

export default Filter;
