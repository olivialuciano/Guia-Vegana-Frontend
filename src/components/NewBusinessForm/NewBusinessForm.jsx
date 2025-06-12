import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Asegúrate de ajustar la ruta correcta
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
  
  // Verificar si el usuario está autenticado y tiene permisos
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
    userId: user ? user.id : null, // Usa el ID del usuario autenticado
  });

  const [errorMessage, setErrorMessage] = useState("");

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
    
    // Verificar nuevamente si hay token antes de enviar
    if (!token) {
      setErrorMessage("No estás autorizado para realizar esta acción");
      return;
    }

    const formattedData = {
      name: formData.name,
      image: formData.image,
      socialMediaUsername: formData.socialMediaUsername,
      socialMediaLink: formData.socialMediaLink,
      address: formData.address,
      zone: zoneMapping[formData.zone],
      delivery: deliveryMapping[formData.delivery],
      glutenFree: Boolean(formData.glutenFree),
      allPlantBased: Boolean(formData.allPlantBased),
      rating: ratingMapping[formData.rating],
      businessType: businessTypeMapping[formData.businessType],
      userId: Number(formData.userId),
    };

    try {
      const response = await fetch("https://localhost:7032/api/Business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      console.log("Response Status:", response.status);

      if (response.ok) {
        alert("Negocio creado exitosamente!");
        onClose();
        // Recargar la página para mostrar el nuevo negocio
        window.location.reload();
      } else {
        // Manejar errores de autorización
        if (response.status === 401) {
          setErrorMessage("No estás autorizado para realizar esta acción");
        } else if (response.status === 403) {
          setErrorMessage("No tienes permisos suficientes para realizar esta acción");
        } else {
          const responseText = await response.text();
          console.log("Response Text:", responseText);
          setErrorMessage(
            `Error: ${responseText || "No se pudo crear el negocio"}`
          );
        }
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMessage(`Error de conexión: ${error.message}`);
    }
  };
  
  // Si el usuario no está autenticado o no tiene permisos, no renderizar el formulario
  if (!user || (role !== "Sysadmin" && role !== "Investigador")) {
    return null;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="business-form">
        <h2>Agregar Nuevo Negocio</h2>

        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Imagen:
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </label>

        <label>
          Usuario en redes sociales:
          <input
            type="text"
            name="socialMediaUsername"
            value={formData.socialMediaUsername}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Enlace de redes sociales:
          <input
            type="url"
            name="socialMediaLink"
            value={formData.socialMediaLink}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Dirección:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Zona:
          <select
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
        </label>

        <label>
          Tipo de entrega:
          <select
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
        </label>

        <label>
          Sin gluten:
          <input
            type="checkbox"
            name="glutenFree"
            checked={formData.glutenFree}
            onChange={handleChange}
          />
        </label>

        <label>
          100% a base de plantas:
          <input
            type="checkbox"
            name="allPlantBased"
            checked={formData.allPlantBased}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Crear Negocio
          </button>
          <button type="button" className="close-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default NewBusinessForm;
