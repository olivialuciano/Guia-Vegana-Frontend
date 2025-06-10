import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Comments.css";

const Comments = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_hyjyxx1", // Reemplázalo con tu Service ID
        "template_f5zbdcq", // Reemplázalo con tu Template ID
        formData,
        "6rglDIeVHr-_GN8cS" // Reemplázalo con tu Public Key
      )
      .then(
        () => setStatus("Mensaje enviado con éxito."),
        () => setStatus("Error al enviar el mensaje.")
      );
  };

  return (
    <div>
      <h2>Contactanos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tu Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Tu Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Tu Mensaje"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Comments;
