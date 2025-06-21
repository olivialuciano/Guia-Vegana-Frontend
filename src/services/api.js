export const API = 'https://www.guia-vegana-rosario.somee.com/api';

// Función para limpiar el localStorage cuando expira el token
export const clearAuthData = () => {
  console.log('Limpiando datos de autenticación...');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  console.log('Redirigiendo a /signin...');
  window.location = '/signin';
};

// Función wrapper para fetch que maneja automáticamente la expiración del token
export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  
  // Si es 401 y la petición incluye autorización, limpiar y redirigir
  if (response.status === 401 && options.headers?.Authorization) {
    console.log('Token expirado detectado en petición API');
    clearAuthData();
    return; // Detener ejecución
  }
  
  return response;
};
