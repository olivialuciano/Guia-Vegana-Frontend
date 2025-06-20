import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import Header from '../../components/Header/Header';
import { faUserMd, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewHealthProfessionalForm from '../../components/NewHealthProfessionalForm/NewHealthProfessionalForm';
import './HealthProfessional.css';
import { API } from '../../services/api';

const HealthProfessional = () => {
  const { user } = useContext(AuthContext);
  const [healthProfessionals, setHealthProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  useEffect(() => {
    fetchHealthProfessionals();
  }, []);

  const fetchHealthProfessionals = async () => {
    try {
      const response = await fetch(`${API}/HealthProfessional`);
      if (!response.ok) {
        throw new Error('Error al cargar los profesionales');
      }
      const data = await response.json();
      setHealthProfessionals(data);
    } catch (err) {
      setError('Error al cargar los profesionales');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHealthProfessionalAdded = (newHealthProfessional) => {
    setHealthProfessionals(prev => [...prev, newHealthProfessional]);
    setShowNewForm(false);
  };

  if (loading) {
    return <Loading text="Cargando profesionales..." subtitle="Buscando especialistas en salud vegana" />;
  }

  if (error) {
    return (
      <div className="health-professional">
        <div className="list-content">
          <div className="error-container">
            <p>{error}</p>
            <button className="add-button" onClick={fetchHealthProfessionals}>
              <FontAwesomeIcon icon={faPlus} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="health-professional">
      <Header 
        title="Profesionales de la Salud"
        icon={faUserMd}
        showRating={false}
        rating={null}
      >
        {canEdit && (
          <button 
            className="add-button"
            onClick={() => setShowNewForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Agregar Profesional</span>
          </button>
        )}
      </Header>

      <div className="list-content">
        {/* Grid de tarjetas */}
        {healthProfessionals.length > 0 ? (
          <div className="business-cards-grid">
            {healthProfessionals.map((item) => (
              <Card
                key={item.id}
                title={item.name}
                subtitle={item.specialty}
                description={item.description}
                image={item.image}
                icon={faUserMd}
                to={`/healthprofessional/${item.id}`}
                healthProfessionalData={item}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No hay profesionales de la salud disponibles</p>
          </div>
        )}

        {/* Formulario de nuevo profesional */}
        {showNewForm && (
          <NewHealthProfessionalForm
            onHealthProfessionalAdded={handleHealthProfessionalAdded}
            onCancel={() => setShowNewForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HealthProfessional;
