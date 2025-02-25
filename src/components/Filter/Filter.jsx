import { useState } from "react";
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

const Filter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    plantBased: false,
    glutenFree: false,
    rating: [],
    delivery: [],
    businessType: [],
    zone: [],
    openNow: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false); // Cierra el filtro después de aplicar
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
              onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
            100% Plant-Based
          </label>

          <label>
            <input
              type="checkbox"
              name="glutenFree"
              checked={filters.glutenFree}
              onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
            Opciones Gluten-Free
          </label>
        </div>

        <div className="filter-group">
          <label>Estrellas:</label>
          <Select
            isMulti
            options={ratingMap}
            value={ratingMap.filter((opt) =>
              filters.rating.includes(opt.value)
            )}
            onChange={(selected) =>
              handleChange(
                "rating",
                selected.map((item) => item.value)
              )
            }
          />
        </div>

        <div className="filter-group">
          <label>Delivery:</label>
          <Select
            isMulti
            options={deliveryMap}
            value={deliveryMap.filter((opt) =>
              filters.delivery.includes(opt.value)
            )}
            onChange={(selected) =>
              handleChange(
                "delivery",
                selected.map((item) => item.value)
              )
            }
          />
        </div>

        <div className="filter-group">
          <label>Tipo de negocio:</label>
          <Select
            isMulti
            options={businessTypeMap}
            value={businessTypeMap.filter((opt) =>
              filters.businessType.includes(opt.value)
            )}
            onChange={(selected) =>
              handleChange(
                "businessType",
                selected.map((item) => item.value)
              )
            }
          />
        </div>

        <div className="filter-group">
          <label>Zona:</label>
          <Select
            isMulti
            options={zoneMap}
            value={zoneMap.filter((opt) => filters.zone.includes(opt.value))}
            onChange={(selected) =>
              handleChange(
                "zone",
                selected.map((item) => item.value)
              )
            }
          />
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              name="openNow"
              checked={filters.openNow}
              onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
            Abierto ahora
          </label>
        </div>

        <button className="apply-filters-btn" onClick={applyFilters}>
          Aplicar filtros
        </button>
      </div>
    </>
  );
};

export default Filter;
