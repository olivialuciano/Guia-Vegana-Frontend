import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import CardGrid from '../../components/CardGrid/CardGrid';
import Loading from '../../components/Loading/Loading';
import { faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import NewActivismForm from '../../components/NewActivismForm/NewActivismForm';
import './Activism.css';

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
      const response = await fetch('https://localhost:7032/api/Activism');
      if (!response.ok) {
        throw new Error('Error al cargar las actividades');
      }
      const data = await response.json();
      setActivism(data);
    } catch (err) {
      setError('Error al cargar las actividades');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivismAdded = (newActivism) => {
    setActivism(prev => [...prev, newActivism]);
    setShowNewForm(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="activism">
      <Header 
        title="Actividades de Activismo"
        icon={faHandHoldingHeart}
        showRating={false}
        rating={null}
      />
      
      <div className="list-content">
        {canEdit && (
          <div className="admin-actions">
            <button 
              className="add-button"
              onClick={() => setShowNewForm(true)}
            >
              Agregar Actividad
            </button>
          </div>
        )}

        {showNewForm && (
          <NewActivismForm
            onActivismAdded={handleActivismAdded}
            onCancel={() => setShowNewForm(false)}
          />
        )}

        <CardGrid 
          items={activism}
          entityType="activism"
        />
      </div>
    </div>
  );
};

export default Activism;
