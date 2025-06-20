import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import { faBook, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewInformativeResourceForm from '../../components/NewInformativeResourceForm/NewInformativeResourceForm';
import './InformativeResource.css';

const InformativeResource = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  useEffect(() => {
    fetchResources();
  }, []);

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

  const handleResourceAdded = (newResource) => {
    setResources(prev => [...prev, newResource]);
    setShowNewForm(false);
  };

  if (loading) {
    return <Loading text="Cargando recursos..." subtitle="Buscando contenido educativo sobre veganismo" />;
  }

  if (error) {
    return (
      <div className="informative-resource">
        <div className="list-content">
          <div className="error-container">
            <p>{error}</p>
            <button className="add-button" onClick={fetchResources}>
              <FontAwesomeIcon icon={faPlus} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="informative-resource">
      <div className="list-content">
        {/* Header de la página */}
        <div className="page-header">
          <h1 className="page-title">Recursos Informativos</h1>
          <p className="page-subtitle">
            Accedé a artículos, videos, recetas y contenido educativo para aprender más sobre el veganismo
          </p>
        </div>

        {/* Barra de acciones */}
        <div className="actions-bar">
          <div className="admin-actions">
            {canEdit && (
              <button 
                className="add-button"
                onClick={() => setShowNewForm(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Agregar Recurso</span>
              </button>
            )}
          </div>
        </div>

        {/* Grid de tarjetas */}
        {resources.length > 0 ? (
          <div className="business-cards-grid">
            {resources.map((item) => (
              <Card
                key={item.id}
                title={item.name}
                subtitle={item.topic}
                description={item.description}
                image={item.image}
                icon={faBook}
                to={`/informativeresource/${item.id}`}
                informativeResourceData={item}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No hay recursos informativos disponibles</p>
          </div>
        )}

        {/* Formulario de nuevo recurso */}
        {showNewForm && (
          <NewInformativeResourceForm
            onResourceAdded={handleResourceAdded}
            onCancel={() => setShowNewForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InformativeResource;
