import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import CardGrid from '../../components/CardGrid/CardGrid';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import './InformativeResource.css';

const InformativeResource = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('https://localhost:7032/api/InformativeResource');
        if (!response.ok) {
          throw new Error('Error al cargar los recursos');
        }
        const data = await response.json();
        setResources(data);
      } catch (err) {
        setError('Error al cargar los recursos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="informative-resource">
      <Header 
        title="Recursos Informativos"
        icon={faBook}
        showRating={false}
        rating={null}
      />
      
      <div className="list-content">
        {user?.role === 'Admin' && (
          <div className="admin-actions">
            <button 
              className="add-button"
              onClick={() => window.location.href = '/informative-resources/new'}
            >
              Agregar Recurso
            </button>
          </div>
        )}

        <CardGrid 
          items={resources}
          entityType="informativeResource"
        />
      </div>
    </div>
  );
};

export default InformativeResource;
