// BusinessList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faPlus } from '@fortawesome/free-solid-svg-icons';
import CardGrid from '../../components/CardGrid/CardGrid';
import Loading from '../../components/Loading/Loading';
import Header from '../../components/Header/Header';
import './BusinessList.css';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('httpS://localhost:7032/api/business');
        if (!response.ok) {
          throw new Error('Error al cargar los negocios');
        }
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="business-list-container">
      <Header 
        title="Negocios" 
        icon={faStore}
        showRating={false}
        rating={null}
      >
        {user?.role === 'admin' && (
          <button 
            className="add-button"
            onClick={() => navigate('/businesses/new')}
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Negocio
          </button>
        )}
      </Header>
      <div className="business-list-content">
        <CardGrid businesses={businesses || []} />
      </div>
    </div>
  );
};

export default BusinessList;
