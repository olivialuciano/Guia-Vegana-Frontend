import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import CardGrid from '../../components/CardGrid/CardGrid';
import Loading from '../../components/Loading/Loading';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import NewInformativeResourceForm from '../../components/NewInformativeResourceForm/NewInformativeResourceForm';
import './InformativeResource.css';

const InformativeResource = () => {
  const { user } = useContext(AuthContext);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    topic: '',
    platform: '',
    description: '',
    type: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autorizado');

      // Obtener el usuario del token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Token inválido');
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('Token payload:', payload);

      // Intentar obtener el ID del usuario de diferentes campos posibles
      const userId = payload.nameid || payload.sub || payload.userId || payload.id;
      
      if (!userId) {
        console.error('Payload del token:', payload);
        throw new Error('No se pudo obtener el ID del usuario del token');
      }

      // Validar datos requeridos
      if (!formData.name || !formData.topic || !formData.description) {
        setError('Por favor complete todos los campos requeridos');
        setIsSubmitting(false);
        return;
      }

      // Preparar los datos para enviar
      const resourceData = {
        name: formData.name,
        image: formData.image || null,
        topic: formData.topic,
        platform: formData.platform || null,
        description: formData.description,
        type: parseInt(formData.type),
        userId: userId
      };

      console.log('Enviando datos:', resourceData);

      const response = await fetch('https://localhost:7032/api/InformativeResource', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || `Error al crear el recurso: ${response.status}`);
      }

      const newResource = await response.json();
      console.log('Respuesta exitosa:', newResource);
      setResources(prev => [...prev, newResource]);
      setShowNewForm(false);
      setFormData({
        name: '',
        image: '',
        topic: '',
        platform: '',
        description: '',
        type: 0
      });
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al crear el recurso');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
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
        {user && (user.role === 'Sysadmin' || user.role === 'Investigador') && (
          <div className="admin-actions">
            <button 
              className="add-button"
              onClick={() => setShowNewForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Recurso
            </button>
          </div>
        )}

        {showNewForm && (
          <div className="new-resource-form-container">
            <div className="new-resource-form">
              <div className="form-header">
                <h2>Agregar Nuevo Recurso</h2>
                <button className="close-button" onClick={() => setShowNewForm(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nombre *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese el nombre del recurso"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">URL de la imagen</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Ingrese la URL de la imagen"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="topic">Tema *</label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese el tema del recurso"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="platform">Plataforma</label>
                  <input
                    type="text"
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    placeholder="Ingrese la plataforma"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingrese la descripción del recurso"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">Tipo de Recurso *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="0">Libro</option>
                    <option value="1">Documental</option>
                    <option value="2">Recurso Web</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowNewForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Recurso'}
                  </button>
                </div>
              </form>
            </div>
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
