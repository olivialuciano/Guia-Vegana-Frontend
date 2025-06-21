import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedId = localStorage.getItem('userId');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.userId || storedId || "",
          role: payload.role || storedRole || ""
        });
      } catch (error) {
        setUser({
          id: storedId || "",
          role: storedRole || ""
        });
      }
    } else {
      setUser({
        id: storedId || "",
        role: storedRole || ""
      });
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
