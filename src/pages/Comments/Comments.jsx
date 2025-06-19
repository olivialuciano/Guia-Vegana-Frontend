import { useState } from "react";
import "./Comments.css";

const Comments = () => {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mldnwdrj", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        setStatus("Mensaje enviado con éxito.");
      } else {
        setStatus("Error al enviar el mensaje.");
      }
    } catch (error) {
      setStatus("Error al enviar el mensaje.");
    }
  };

  return (
    <div>
      <h2>Contactanos</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Tu Nombre" required />
        <input type="email" name="email" placeholder="Tu Correo Electrónico" required />
        <textarea name="message" placeholder="Tu Mensaje" required />
        <button type="submit">Enviar</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Comments;
