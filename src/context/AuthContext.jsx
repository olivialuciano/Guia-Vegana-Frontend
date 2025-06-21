import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  // Función para limpiar datos de autenticación
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setUser(null);
    setRole("");
    setId("");
  };

  // Función para verificar si el token está expirado
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000; // Convertir a segundos
      return payload.exp < currentTime;
    } catch (error) {
      return true; // Si no se puede decodificar, considerar como expirado
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedId = localStorage.getItem('userId');

    if (token) {
      // Verificar si el token está expirado
      if (isTokenExpired(token)) {
        console.log('Token expirado, limpiando datos de autenticación');
        clearAuthData();
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId || storedId || "",
          role: payload.role || storedRole || ""
        });
        setRole(payload.role || storedRole || "");
        setId(payload.userId || storedId || "");
      } catch (error) {
        console.log('Error decodificando token, limpiando datos de autenticación');
        clearAuthData();
      }
    } else {
      setUser({
        id: storedId || "",
        role: storedRole || ""
      });
      setRole(storedRole || "");
      setId(storedId || "");
    }
  }, []);

  const logout = () => {
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ user, role, id, setUser, setRole, setId, logout, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
