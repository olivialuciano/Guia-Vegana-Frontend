import { jwtDecode } from "jwt-decode";

class AuthService {
  getToken() {
    return localStorage.getItem("token");
  }

  getUserId() {
    return localStorage.getItem("userId");
  }

  getUserRole() {
    return localStorage.getItem("role");
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Verificar si el token ha expirado
      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  }

  setAuthData(token) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    
    // Extraer el ID del usuario de diferentes campos posibles
    const userId = decoded.nameid || decoded.sub || decoded.userId || decoded.id || decoded.user_id;
    
    localStorage.setItem("role", decoded.role || "");
    localStorage.setItem("userId", userId || "");
  }
}

export const authService = new AuthService(); 