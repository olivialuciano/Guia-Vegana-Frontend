import { useState } from 'react';
import { API, clearAuthData } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      
      // Solo interceptar 401 si la petición incluye autorización
      if (response.status === 401 && options.headers?.Authorization) {
        clearAuthData();
        return; // Detener ejecución
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, loading, error, setError };
}; 