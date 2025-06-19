import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decodificar el JWT para obtener claims (opcional)
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Token payload:", payload); // Debug log
        setUser(payload);
        setRole(payload.role || "");
        setId(payload.userId || payload.id || "");
      } catch (error) {
        console.error("Error decoding token:", error); // Debug log
        // Si token inválido, limpiar
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        setUser(null);
        setRole("");
        setId("");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    setUser(null);
    setRole("");
    setId("");
  };

  return (
    <AuthContext.Provider value={{ user, role, id, setUser, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
