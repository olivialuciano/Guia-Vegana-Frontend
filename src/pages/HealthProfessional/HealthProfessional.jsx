import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import CardGrid from '../../components/CardGrid/CardGrid';
import Loading from '../../components/Loading/Loading';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import NewHealthProfessionalForm from '../../components/NewHealthProfessionalForm/NewHealthProfessionalForm';
import './HealthProfessional.css';

const HealthProfessional = () => {
  const { user } = useContext(AuthContext);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const canEdit = user && (user.role === 'Sysadmin' || user.role === 'Investigador');

  useEffect(() => {
    fetchProfessionals();
  }, []);

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

  const handleProfessionalAdded = (newProfessional) => {
    setProfessionals(prev => [...prev, newProfessional]);
    setShowNewForm(false);
  };

  if (loading) {
    return <Loading />;
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
        {canEdit && (
          <div className="admin-actions">
            <button 
              className="add-button"
              onClick={() => setShowNewForm(true)}
            >
              Agregar Profesional
            </button>
          </div>
        )}

        {showNewForm && (
          <NewHealthProfessionalForm
            onProfessionalAdded={handleProfessionalAdded}
            onCancel={() => setShowNewForm(false)}
          />
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
