import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

      const response = await fetch("https://localhost:7032/api/Business", {
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
        <h2>
          <FontAwesomeIcon icon={faStore} /> Nuevo Negocio
        </h2>

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
            placeholder="@usuario"
          />
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
            placeholder="Ingrese la dirección completa"
          />
        </div>

        <div className="form-group">
          <label htmlFor="zone">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Zona
          </label>
          <select
            id="zone"
            name="zone"
            value={formData.zone}
            onChange={handleChange}
            required
          >
            {Object.keys(zoneMapping).map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="delivery">
            <FontAwesomeIcon icon={faTruck} /> Tipo de Entrega
          </label>
          <select
            id="delivery"
            name="delivery"
            value={formData.delivery}
            onChange={handleChange}
            required
          >
            {Object.keys(deliveryMapping).map((delivery) => (
              <option key={delivery} value={delivery}>
                {delivery}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="glutenFree"
              name="glutenFree"
              checked={formData.glutenFree}
              onChange={handleChange}
            />
            <label htmlFor="glutenFree">
              <FontAwesomeIcon icon={faBreadSlice} /> Sin gluten
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
              <FontAwesomeIcon icon={faLeaf} /> 100% basado en plantas
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Creando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                Crear Negocio
              </>
            )}
          </button>
          <button 
            type="button" 
            className="close-btn"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancelar
          </button>
        </div>

        {errorMessage && (
          <div className="error-message">
            <FontAwesomeIcon icon={faTimes} />
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default NewBusinessForm;
