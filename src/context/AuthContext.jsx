import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("userId");
    
    console.log('AuthContext - Token:', token ? 'exists' : 'not found');
    console.log('AuthContext - Stored role:', storedRole);
    console.log('AuthContext - Stored ID:', storedId);
    
    if (token) {
      try {
        // Decodificar el JWT para obtener claims (opcional)
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("AuthContext - Token payload:", payload); // Debug log
        
        // Extraer el ID del usuario de diferentes campos posibles
        const userId = payload.nameid || payload.sub || payload.userId || payload.id || payload.user_id;
        
        setUser(payload);
        setRole(payload.role || storedRole || "");
        setId(userId || storedId || "");
        
        console.log('AuthContext - Setting role to:', payload.role || storedRole || "");
        
        // Guardar role en localStorage como 'role'
        localStorage.setItem("role", payload.role || storedRole || "");
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
    } else if (storedRole) {
      // Si no hay token pero hay role guardado, usar el role guardado
      console.log('AuthContext - Using stored role:', storedRole);
      setRole(storedRole);
      setId(storedId || "");
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
    <AuthContext.Provider value={{ user, role, id, setUser, setRole, setId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
