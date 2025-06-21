import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BusinessDetail.css";
import Loading from "../../components/Loading/Loading";
import OpeningHour from "../../components/OpeningHour/OpeningHour";
import VeganOption from "../../components/VeganOption/VeganOption";
import defaultImage from "../../assets/img/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMapMarkerAlt, faTruck, faLeaf, faBreadSlice, faStore, faEdit, faTrash, faDoorOpen, faDoorClosed, faClock, faCheckCircle, faTimesCircle, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { useBusinessStatus } from "../../hooks/useBusinessStatus";
import { API } from '../../services/api';

const BusinessDetail = () => {
  const [business, setBusiness] = useState({
    openingHours: []
  });
  const [openingHours, setOpeningHours] = useState([]);
  const [veganOptions, setVeganOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState({
    openingHours: []
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState(null);

  const { isOpen, getStatusText, getStatusClass } = useBusinessStatus(business.openingHours);

  useEffect(() => {
    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API}/Business/${id}`);
      if (!response.ok) {
        throw new Error('Error al cargar el negocio');
      }
      const data = await response.json();
      setBusiness({
        ...data,
        openingHours: data.openingHours || []
      });
      setEditedBusiness({
        ...data,
        openingHours: data.openingHours || []
      });

      // Fetch opening hours
      const hoursResponse = await fetch(`${API}/OpeningHour/business/${id}`);
      if (hoursResponse.ok) {
        const hoursData = await hoursResponse.json();
        setBusiness(prev => ({
          ...prev,
          openingHours: hoursData || []
        }));
      } else if (hoursResponse.status === 404) {
        // If no hours found, set empty array
        setBusiness(prev => ({
          ...prev,
          openingHours: []
        }));
      } else {
        throw new Error('Error al cargar los horarios');
      }

      // Fetch vegan options
      const optionsResponse = await fetch(`${API}/VeganOption/business/${id}`);
      if (optionsResponse.ok) {
        const optionsData = await optionsResponse.json();
        setVeganOptions(optionsData || []);
      } else if (optionsResponse.status === 404) {
        setVeganOptions([]);
      } else {
        throw new Error('Error al cargar las opciones veganas');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedBusiness(business);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API}/Business`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editedBusiness,
          id: parseInt(id)
        })
      });

      if (!response.ok) {
        let errorMessage = 'Error al actualizar el negocio';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Si no se puede parsear el JSON, usar el status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Intentar parsear la respuesta solo si hay contenido
      let updatedBusiness;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          updatedBusiness = await response.json();
        } catch (e) {
          // Si no hay respuesta JSON, usar los datos editados
          updatedBusiness = editedBusiness;
        }
      } else {
        // Si no hay respuesta JSON, usar los datos editados
        updatedBusiness = editedBusiness;
      }

      setBusiness(updatedBusiness);
      setIsEditing(false);
    } catch (error) {
      setError("Error al actualizar el negocio");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API}/Business/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el negocio');
      }

      setShowDeleteConfirm(false);
      navigate('/business');
    } catch (error) {
      setError("Error al eliminar el negocio");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedBusiness(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getStatusIcon = () => {
    if (isOpen === null) return faClock;
    return isOpen ? faDoorOpen : faDoorClosed;
  };

  const getImageUrl = () => {
    if (!business.image) return defaultImage;
    return business.image;
  };

  const handleNewHour = (newHour) => {
    setBusiness(prevBusiness => ({
      ...prevBusiness,
      openingHours: [...prevBusiness.openingHours, newHour]
    }));
  };

  const handleHourUpdate = (updatedHour) => {
    setBusiness(prevBusiness => ({
      ...prevBusiness,
      openingHours: prevBusiness.openingHours.map(hour => 
        hour.id === updatedHour.id ? updatedHour : hour
      )
    }));
  };

  const handleHourDelete = (hourId) => {
    setBusiness(prevBusiness => ({
      ...prevBusiness,
      openingHours: prevBusiness.openingHours.filter(hour => hour.id !== hourId)
    }));
  };

  const handleNewOption = (newOption) => {
    setBusiness(prevBusiness => ({
      ...prevBusiness,
      veganOptions: [...prevBusiness.veganOptions, newOption]
    }));
  };

  const handleOptionUpdate = (updatedOption) => {
    setBusiness(prevBusiness => ({
      ...prevBusiness,
      veganOptions: prevBusiness.veganOptions.map(option => 
        option.id === updatedOption.id ? updatedOption : option
      )
    }));
  };

  const handleOptionDelete = (optionId) => {
    setBusiness(prevBusiness => ({
      ...prevBusiness,
      veganOptions: prevBusiness.veganOptions.filter(option => option.id !== optionId)
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!business) {
    return <div className="error-message">No se encontró el negocio</div>;
  }

  const zoneMap = {
    0: "Zona Norte",
    1: "Zona Sur",
    2: "Zona Oeste",
    3: "Barrio Pichincha",
    4: "Zona Centro",
    5: "Barrio Martin",
    6: "Avenida Pellegrini",
    7: "Bulevar Oroño",
    8: "Barrio Abasto",
    9: "Barrio La Sexta",
    10: "Barrio Echesortu",
    11: "Barrio Lourdes",
  };

  const deliveryMap = {
    0: "Pedidos Ya",
    1: "Rappi",
    2: "Envío propio",
    3: "Otro servicio",
    4: "No tiene delivery",
  };

  const ratingMap = {
    1: "⭐",
    2: "⭐⭐",
    3: "⭐⭐⭐",
    4: "⭐⭐⭐⭐",
    5: "⭐⭐⭐⭐⭐",
  };

  const businessTypeMap = {
    0: "Bar / Restaurante",
    1: "Panadería",
    2: "Heladería",
    3: "Mercado / Dietética",
    4: "Emprendimiento",
  };

  return (
    <div className="business-detail-container">
      <div className="business-detail">
        {/* Header de la página */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <FontAwesomeIcon icon={faStore} />
              </div>
              <div className="header-title-section">
                <h1 className="page-title">{business.name}</h1>
                <div className="business-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={star <= business.rating ? 'star filled' : 'star'}
                    />
                  ))}
                  <span className="rating-value">{business.rating}/5</span>
                </div>
              </div>
            </div>
            {user && (
              <div className="header-actions">
                <button className="icon-button edit" onClick={handleEdit} title="Editar negocio">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="icon-button delete" onClick={() => setShowDeleteConfirm(true)} title="Eliminar negocio">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="business-image-container">
          <img
            src={getImageUrl()}
            alt={business.name}
            className="business-detail-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>

        <div className="business-info-container">
          {isEditing ? (
            <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedBusiness.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese el nombre del negocio"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={editedBusiness.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese la dirección"
                />
              </div>

              <div className="form-group">
                <label htmlFor="zone">Zona</label>
                <select
                  id="zone"
                  name="zone"
                  value={editedBusiness.zone}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una zona</option>
                  {Object.entries(zoneMap).map(([key, value]) => (
                    <option key={key} value={parseInt(key)}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="delivery">Tipo de Entrega</label>
                <select
                  id="delivery"
                  name="delivery"
                  value={editedBusiness.delivery}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione el tipo de entrega</option>
                  {Object.entries(deliveryMap).map(([key, value]) => (
                    <option key={key} value={parseInt(key)}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="businessType">Tipo de Negocio</label>
                <select
                  id="businessType"
                  name="businessType"
                  value={editedBusiness.businessType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione el tipo de negocio</option>
                  {Object.entries(businessTypeMap).map(([key, value]) => (
                    <option key={key} value={parseInt(key)}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="rating">Calificación</label>
                <select
                  id="rating"
                  name="rating"
                  value={editedBusiness.rating}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccione una calificación</option>
                  {Object.entries(ratingMap).map(([key, value]) => (
                    <option key={key} value={parseInt(key)}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="glutenFree"
                  name="glutenFree"
                  checked={editedBusiness.glutenFree}
                  onChange={handleInputChange}
                />
                <label htmlFor="glutenFree">Opciones sin TACC</label>
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="allPlantBased"
                  name="allPlantBased"
                  checked={editedBusiness.allPlantBased}
                  onChange={handleInputChange}
                />
                <label htmlFor="allPlantBased">100% basado en plantas</label>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  Guardar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="business-status-indicator">
                <div className={`status-badge ${getStatusClass()}`}>
                  <FontAwesomeIcon icon={getStatusIcon()} />
                  <span>{getStatusText()}</span>
                </div>
              </div>

              <div className="business-type">
                {businessTypeMap[business.businessType] || business.businessType}
              </div>

              <div className="business-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <div className="location-details">
                  <p className="business-address">{business.address}</p>
                  <p className="business-zone">{zoneMap[business.zone] || business.zone}</p>
                </div>
              </div>

              <div className="business-features">
                {business.glutenFree && (
                  <div className="feature-tag-sintacc">
                    <FontAwesomeIcon icon={faBreadSlice} />
                    <span>Opciones sin TACC</span>
                  </div>
                )}
                {business.allPlantBased && (
                  <div className="feature-tag">
                    <FontAwesomeIcon icon={faLeaf} />
                    <span>100% basado en plantas</span>
                  </div>
                )}
              </div>

              <div className="business-delivery">
                <FontAwesomeIcon icon={faTruck} />
                <span>{deliveryMap[business.delivery] || business.delivery}</span>
              </div>
            </>
          )}
        </div>

        <div className="business-details-grid">
          <OpeningHour 
            openingHours={business.openingHours || []} 
            businessId={parseInt(id)}
            onHourAdded={handleNewHour}
            onHourUpdated={handleHourUpdate}
            onHourDeleted={handleHourDelete}
          />
          <VeganOption 
            veganOptions={veganOptions} 
            businessId={parseInt(id)}
            onOptionAdded={handleNewOption}
            onOptionUpdated={handleOptionUpdate}
            onOptionDeleted={handleOptionDelete}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Negocio"
        message="¿Estás seguro de que deseas eliminar este negocio? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default BusinessDetail;
