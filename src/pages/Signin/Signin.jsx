import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Signin.css"; // Importamos el CSS externo

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://localhost:7032/api/User/authorization",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email, // Asegúrate de usar "email" en minúsculas
            password: formData.password, // Asegúrate de usar "password" en minúsculas
          }),
        }
      );

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const token = await response.text();
      localStorage.setItem("token", token); // Guardar el JWT en localStorage

      // Decodificar el token para obtener el claim 'role'
      const decodedToken = jwtDecode(token); // Decodificar el token
      console.log(decodedToken);
      const userRole = decodedToken.role; // Aquí obtenemos el 'role' del claim

      // Hacer algo con el 'role' (por ejemplo, redirigir dependiendo del role)
      if (userRole === "Admin") {
        navigate("/admin"); // Si es Admin, redirigimos a admin
      } else {
        navigate("/"); // Si no es Admin, redirigimos a la home
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>Iniciar Sesión</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email" // Asegúrate de usar "email" en minúsculas
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password" // Asegúrate de usar "password" en minúsculas
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
