import { useState, useEffect } from 'react';

export const useBusinessStatus = (openingHours) => {
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    const checkBusinessStatus = () => {
      if (!openingHours || openingHours.length === 0) {
        setIsOpen(null); // No hay horarios disponibles
        return;
      }

      const now = new Date();
      const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Tiempo actual en minutos

      // Buscar el horario del día actual
      const todayHours = openingHours.find(hour => hour.day === currentDay);
      
      if (!todayHours) {
        setIsOpen(false); // No hay horarios para hoy
        return;
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
          setIsOpen(true);
          return;
        }
      }

      // Verificar si está abierto en el segundo horario (si existe)
      if (openTime2 !== null && closeTime2 !== null) {
        if (currentTime >= openTime2 && currentTime <= closeTime2) {
          setIsOpen(true);
          return;
        }
      }

      setIsOpen(false);
    };

    // Verificar estado inicial
    checkBusinessStatus();

    // Actualizar cada minuto
    const interval = setInterval(checkBusinessStatus, 60000);

    return () => clearInterval(interval);
  }, [openingHours]);

  const getStatusText = () => {
    if (isOpen === null) return "Horarios no disponibles";
    return isOpen ? "Abierto" : "Cerrado";
  };

  const getStatusClass = () => {
    if (isOpen === null) return "unknown";
    return isOpen ? "open" : "closed";
  };

  return {
    isOpen,
    getStatusText,
    getStatusClass
  };
}; 