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
        setUser(payload);
        setRole(payload.role || "");
        setId(payload.id || "");
      } catch {
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

  return (
    <AuthContext.Provider value={{ user, role, id, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
