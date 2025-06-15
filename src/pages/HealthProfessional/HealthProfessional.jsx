import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import CardGrid from '../../components/CardGrid/CardGrid';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import './HealthProfessional.css';

const HealthProfessional = () => {
  const { user } = useContext(AuthContext);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch('https://localhost:7032/api/HealthProfessional');
        if (!response.ok) {
          throw new Error('Error al cargar los profesionales');
        }
        const data = await response.json();
        setProfessionals(data);
      } catch (err) {
        setError('Error al cargar los profesionales');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="health-professional">
      <Header 
        title="Profesionales de la Salud"
        icon={faUserMd}
        showRating={false}
        rating={null}
      />
      
      <div className="list-content">
        {user?.role === 'Admin' && (
          <div className="admin-actions">
            <button 
              className="add-button"
              onClick={() => window.location.href = '/health-professionals/new'}
            >
              Agregar Profesional
            </button>
          </div>
        )}

        <CardGrid 
          items={professionals}
          entityType="healthProfessional"
        />
      </div>
    </div>
  );
};

export default HealthProfessional;
