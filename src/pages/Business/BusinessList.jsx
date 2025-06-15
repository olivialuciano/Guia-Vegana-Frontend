// BusinessList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import CardGrid from '../../components/CardGrid/CardGrid';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import './BusinessList.css';

const BusinessList = () => {
  const { user } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('https://localhost:7032/api/Business');
        if (!response.ok) {
          throw new Error('Error al cargar los negocios');
        }
        const data = await response.json();
        setBusinesses(data);
      } catch (err) {
        setError('Error al cargar los negocios');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="business-list">
      <Header 
        title="Negocios"
        icon={faStore}
        showRating={false}
        rating={null}
      />
      
      <div className="list-content">
        {user?.role === 'Admin' && (
          <div className="admin-actions">
            <button 
              className="add-button"
              onClick={() => window.location.href = '/business/new'}
            >
              Agregar Negocio
            </button>
          </div>
        )}

        <CardGrid 
          items={businesses}
          entityType="business"
        />
      </div>
    </div>
  );
};

export default BusinessList;
