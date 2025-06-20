import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../Loading/Loading";
import { 
  faStore, 
  faImage, 
  faUser, 
  faLink, 
  faMapMarkerAlt, 
  faTruck, 
  faBreadSlice, 
  faLeaf,
  faTimes,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import "./NewBusinessForm.css";
import { API } from '../../services/api';

const zoneMapping = {
  Norte: 0,
  Sur: 1,
  Oeste: 2,
  Pichincha: 3,
  Centro: 4,
  Martin: 5,
  Pellegrini: 6,
  Oroño: 7,
  Abasto: 8,
  Sexta: 9,
  Echesortu: 10,
  Lourdes: 11,
};

const deliveryMapping = {
  PedidosYa: 0,
  Rappi: 1,
  Propio: 2,
  Otro: 3,
  NoTiene: 4,
};

const ratingMapping = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
};

const businessTypeMapping = {
  BarRestaurante: 0,
  Panaderia: 1,
  Heladeria: 2,
  MercadoDietetica: 3,
  Emprendimiento: 4,
};

const NewBusinessForm = ({ onClose }) => {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!user || (role !== "Sysadmin" && role !== "Investigador")) {
      alert("No tienes permisos para crear negocios");
      onClose();
      navigate("/business");
    }
  }, [user, role, navigate, onClose]);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    socialMediaUsername: "",
    socialMediaLink: "",
    address: "",
    zone: "Norte",
    delivery: "PedidosYa",
    glutenFree: false,
    allPlantBased: false,
    rating: "One",
    businessType: "BarRestaurante",
    userId: token ? jwtDecode(token).userId : null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    
    if (!token) {
      setErrorMessage("No estás autorizado para realizar esta acción");
      setIsSubmitting(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const formattedData = {
        name: formData.name,
        image: formData.image || "",
        socialMediaUsername: formData.socialMediaUsername,
        socialMediaLink: formData.socialMediaLink,
        address: formData.address,
        zone: zoneMapping[formData.zone],
        delivery: deliveryMapping[formData.delivery],
        glutenFree: formData.glutenFree,
        allPlantBased: formData.allPlantBased,
        rating: ratingMapping[formData.rating],
        businessType: businessTypeMapping[formData.businessType],
        userId: parseInt(decodedToken.userId)
      };

      const response = await fetch(`${API}/Business`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Error al crear el negocio");
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Error al crear el negocio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="business-form">
        <div className="form-header">
          <h2>
            <FontAwesomeIcon icon={faStore} /> Nuevo Negocio
          </h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {isSubmitting && (
          <div className="form-loading">
            <Loading />
            <p>Creando negocio...</p>
          </div>
        )}

        {errorMessage && (
          <div className="error-message">
            <span>{errorMessage}</span>
            <button className="close-error" onClick={() => setErrorMessage("")}>×</button>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              <FontAwesomeIcon icon={faStore} /> Nombre del Negocio
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre del negocio"
            />
          </div>

          <div className="form-group">
            <label htmlFor="socialMediaUsername">
              <FontAwesomeIcon icon={faUser} /> Usuario en Redes Sociales
            </label>
            <input
              id="socialMediaUsername"
              type="text"
              name="socialMediaUsername"
              value={formData.socialMediaUsername}
              onChange={handleChange}
              required
              placeholder="Ingrese el usuario en redes sociales"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Dirección
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Ingrese la dirección"
            />
          </div>

          <div className="form-group">
            <label htmlFor="zone">Zona</label>
            <select
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              required
            >
              <option value="Norte">Zona Norte</option>
              <option value="Sur">Zona Sur</option>
              <option value="Oeste">Zona Oeste</option>
              <option value="Pichincha">Barrio Pichincha</option>
              <option value="Centro">Zona Centro</option>
              <option value="Martin">Barrio Martin</option>
              <option value="Pellegrini">Avenida Pellegrini</option>
              <option value="Oroño">Bulevar Oroño</option>
              <option value="Abasto">Barrio Abasto</option>
              <option value="Sexta">Barrio La Sexta</option>
              <option value="Echesortu">Barrio Echesortu</option>
              <option value="Lourdes">Barrio Lourdes</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="businessType">Tipo de Negocio</label>
            <select
              id="businessType"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
            >
              <option value="BarRestaurante">Bar / Restaurante</option>
              <option value="Panaderia">Panadería</option>
              <option value="Heladeria">Heladería</option>
              <option value="MercadoDietetica">Mercado / Dietética</option>
              <option value="Emprendimiento">Emprendimiento</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="delivery">Tipo de Entrega</label>
            <select
              id="delivery"
              name="delivery"
              value={formData.delivery}
              onChange={handleChange}
              required
            >
              <option value="PedidosYa">Pedidos Ya</option>
              <option value="Rappi">Rappi</option>
              <option value="Propio">Envío propio</option>
              <option value="Otro">Otro servicio</option>
              <option value="NoTiene">No tiene delivery</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="rating">Calificación</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value="One">⭐</option>
              <option value="Two">⭐⭐</option>
              <option value="Three">⭐⭐⭐</option>
              <option value="Four">⭐⭐⭐⭐</option>
              <option value="Five">⭐⭐⭐⭐⭐</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <FontAwesomeIcon icon={faImage} /> URL de la Imagen
            </label>
            <input
              id="image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="socialMediaLink">
            <FontAwesomeIcon icon={faLink} /> Enlace de Redes Sociales
          </label>
          <input
            id="socialMediaLink"
            type="url"
            name="socialMediaLink"
            value={formData.socialMediaLink}
            onChange={handleChange}
            required
            placeholder="https://instagram.com/usuario"
          />
        </div>

        <div className="checkbox-row">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="glutenFree"
              name="glutenFree"
              checked={formData.glutenFree}
              onChange={handleChange}
            />
            <label htmlFor="glutenFree">
              <FontAwesomeIcon icon={faBreadSlice} /> Sin Gluten
            </label>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="allPlantBased"
              name="allPlantBased"
              checked={formData.allPlantBased}
              onChange={handleChange}
            />
            <label htmlFor="allPlantBased">
              <FontAwesomeIcon icon={faLeaf} /> 100% Basado en Plantas
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <FontAwesomeIcon icon={faCheck} /> Crear Negocio
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBusinessForm;
