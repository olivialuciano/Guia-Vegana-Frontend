import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import { faHandsHelping, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewActivismForm from '../../components/NewActivismForm/NewActivismForm';
import './Activism.css';
import { API } from '../../services/api';

const Activism = () => {
  const { user } = useContext(AuthContext);
  const [activism, setActivism] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  useEffect(() => {
    fetchActivism();
  }, []);

  const fetchActivism = async () => {
    try {
      const response = await fetch(`${API}/Activism`);
      if (!response.ok) {
        throw new Error('Error al cargar las actividades');
      }
      const data = await response.json();
      setActivism(data);
    } catch (err) {
      setError("Error al cargar activismo");
    } finally {
      setLoading(false);
    }
  };

  const handleActivismAdded = (newActivism) => {
    setActivism(prev => [...prev, newActivism]);
    setShowNewForm(false);
  };

  if (loading) {
    return <Loading text="Cargando activismos..." subtitle="Buscando actividades de activismo" />;
  }

  if (error) {
    return (
      <div className="activism-container">
        <div className="activism">
          <div className="list-content">
            <div className="error-container">
              <p>{error}</p>
              <button className="add-button" onClick={fetchActivism}>
                <FontAwesomeIcon icon={faPlus} />
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activism-container">
      <div className="activism">
        <div className="list-content">
          {/* Header de la página */}
          <div className="page-header">
            <h1 className="page-title">Activismo</h1>

            {/* Barra de acciones */}

            <div className="actions-bar">
              <div className="admin-actions">
                {canEdit && (
                  <button 
                    className="add-button"
                    onClick={() => setShowNewForm(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Agregar Activismo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid de tarjetas */}
          {activism.length > 0 ? (
            <div className="business-cards-grid">
              {activism.map((item) => (
                <Card
                  key={item.id}
                  title={item.name}
                  subtitle={item.type}
                  description={item.description}
                  image={item.image}
                  icon={faHandsHelping}
                  to={`/activism/${item.id}`}
                  activismData={item}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No hay actividades de activismo disponibles</p>
            </div>
          )}

          {/* Formulario de nueva actividad */}
          {showNewForm && (
            <NewActivismForm
              onActivismAdded={handleActivismAdded}
              onCancel={() => setShowNewForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Activism;
