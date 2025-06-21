import { useState } from 'react';
import { API } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      
      if (response.status === 401) {
        // Token expirado o inválido: limpiar y redirigir
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        window.location = '/signin';
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