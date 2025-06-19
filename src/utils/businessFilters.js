// Función para verificar si un negocio está abierto
const isBusinessOpen = (business) => {
  if (!business.openingHours || business.openingHours.length === 0) {
    return false;
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Tiempo actual en minutos

  // Buscar el horario del día actual
  const todayHours = business.openingHours.find(hour => hour.day === currentDay);
  
  if (!todayHours) {
    return false; // No hay horarios para hoy
  }

  // Convertir horarios a minutos para comparación
  const parseTime = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const openTime1 = parseTime(todayHours.openTime1);
  const closeTime1 = parseTime(todayHours.closeTime1);
  const openTime2 = parseTime(todayHours.openTime2);
  const closeTime2 = parseTime(todayHours.closeTime2);

  // Verificar si está abierto en el primer horario
  if (openTime1 !== null && closeTime1 !== null) {
    if (currentTime >= openTime1 && currentTime <= closeTime1) {
      return true;
    }
  }

  // Verificar si está abierto en el segundo horario (si existe)
  if (openTime2 !== null && closeTime2 !== null) {
    if (currentTime >= openTime2 && currentTime <= closeTime2) {
      return true;
    }
  }

  return false;
};

// Función principal para aplicar filtros
export const applyBusinessFilters = (businesses, filters) => {
  return businesses.filter(business => {
    // Filtro de búsqueda por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableFields = [
        business.name,
        business.address,
        business.socialMediaUsername
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchableFields.includes(searchTerm)) {
        return false;
      }
    }

    // Filtro por zona
    if (filters.zone.length > 0) {
      if (!filters.zone.includes(business.zone)) {
        return false;
      }
    }

    // Filtro por tipo de entrega
    if (filters.deliveryType.length > 0) {
      if (!filters.deliveryType.includes(business.delivery)) {
        return false;
      }
    }

    // Filtro por tipo de negocio
    if (filters.businessType.length > 0) {
      if (!filters.businessType.includes(business.businessType)) {
        return false;
      }
    }

    // Filtro por calificación
    if (filters.rating.length > 0) {
      if (!filters.rating.includes(business.rating)) {
        return false;
      }
    }

    // Filtro por opciones sin TACC
    if (filters.glutenFree) {
      if (!business.glutenFree) {
        return false;
      }
    }

    // Filtro por 100% basado en plantas
    if (filters.allPlantBased) {
      if (!business.allPlantBased) {
        return false;
      }
    }

    // Filtro por "Abierto ahora"
    if (filters.openNow) {
      if (!isBusinessOpen(business)) {
        return false;
      }
    }

    return true;
  });
};

// Función para obtener estadísticas de filtros
export const getFilterStats = (businesses, filters) => {
  const totalBusinesses = businesses.length;
  const filteredBusinesses = applyBusinessFilters(businesses, filters);
  const activeFiltersCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + (value.length > 0 ? 1 : 0);
    }
    return count + (value ? 1 : 0);
  }, 0);

  return {
    total: totalBusinesses,
    filtered: filteredBusinesses.length,
    activeFilters: activeFiltersCount
  };
}; 