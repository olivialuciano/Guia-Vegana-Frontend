import { createContext, useState, useEffect } from "react";

// Crear el contexto de autenticación
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Decodificar el JWT (solo la parte de datos)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
        setRole(payload.role || ""); // Evita errores si `role` no está definido
      }
    } catch (error) {
      console.error("Error al procesar el token:", error);
      localStorage.removeItem("token"); // Elimina el token corrupto
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
