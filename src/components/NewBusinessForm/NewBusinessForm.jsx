import { useState } from "react";
import "./NewBusinessForm.css";

const NewBusinessForm = ({ onClose }) => {
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
    userId: 1, // Cambia esto según el ID del usuario autenticado
  });

  const [errorMessage, setErrorMessage] = useState(""); // Para mostrar errores

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar mensajes de error antes de enviar

    try {
      const response = await fetch(
        "https://guiavegana.somee.com/api/Business",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response Status:", response.status); // Verificar el código de estado de la respuesta

      if (response.ok) {
        alert("Negocio creado exitosamente!");
        onClose(); // Cerrar el formulario
      } else {
        const responseText = await response.text(); // Obtener el texto de la respuesta
        console.log("Response Text:", responseText); // Verificar el contenido de la respuesta

        if (responseText) {
          try {
            const errorData = JSON.parse(responseText); // Intentamos parsear el texto como JSON
            setErrorMessage(
              `Error: ${
                errorData.message || "Ocurrió un problema al crear el negocio."
              }`
            );
          } catch (jsonError) {
            // Si no se puede parsear el texto, mostrarlo directamente
            setErrorMessage(`Error desconocido: ${responseText}`);
          }
        } else {
          setErrorMessage(
            "Error desconocido: No se recibió respuesta del servidor."
          );
        }
      }
    } catch (error) {
      console.error("Error de conexión:", error); // Ver más detalles del error
      setErrorMessage(`Error de conexión: ${error.message}`);
    }
  };

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
            {[
              "Norte",
              "Sur",
              "Oeste",
              "Pichincha",
              "Centro",
              "Martin",
              "Pellegrini",
              "Oroño",
              "Abasto",
              "Sexta",
              "Echesortu",
              "Lourdes",
            ].map((zone) => (
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
            {["PedidosYa", "Rappi", "Propio", "Otro", "NoTiene"].map(
              (delivery) => (
                <option key={delivery} value={delivery}>
                  {delivery}
                </option>
              )
            )}
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

        <label>
          Calificación:
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            {["One", "Two", "Three", "Four", "Five"].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tipo de negocio:
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            required
          >
            {[
              "BarRestaurante",
              "Panaderia",
              "Heladeria",
              "MercadoDietetica",
              "Emprendimiento",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Crear Negocio
          </button>
          <button type="button" className="close-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>

        {/* Mostrar el mensaje de error, si existe */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default NewBusinessForm;
