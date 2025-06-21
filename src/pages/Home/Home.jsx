import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStore, 
  faUserMd, 
  faBook, 
  faHandsHelping, 
  faArrowRight,
  faUsers,
  faLeaf,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user, role } = useContext(AuthContext);
  const isSysadmin = role === 'Sysadmin';

  return (
    <div className="home-container">
      <div className="home-content">
        <section className="hero-section">
          <h1 className="hero-title">
            Guía Vegana de Rosario
          </h1>
          <p className="hero-subtitle">
            Descubrí negocios veganos, profesionales de la salud, recursos informativos y activismos en la ciudad de Rosario. Tu guía completa para una vida vegana.
          </p>
          <Link to="/business" className="hero-cta">
            <span>Explorar Negocios</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </section>

        <section className="features-section">
          <h2 className="section-title">¿Qué encontrarás acá?</h2>
          <div className="features-grid">
            <Link to="/business" className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faStore} />
              </div>
              <h3 className="feature-title">Negocios</h3>
              <p className="feature-description">
                Descubrí restaurantes, cafeterías, tiendas y otros negocios que ofrecen opciones veganas.
              </p>
            </Link>

            <Link to="/healthprofessional" className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faUserMd} />
              </div>
              <h3 className="feature-title">Profesionales de la Salud</h3>
              <p className="feature-description">
                Encontrá nutricionistas, médicos y otros profesionales especializados en alimentación basada en plantas y salud integral.
              </p>
            </Link>

            <Link to="/informativeresource" className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <h3 className="feature-title">Recursos Informativos</h3>
              <p className="feature-description">
                Accedé a artículos, videos, recetas y contenido educativo para aprender más sobre el veganismo.
              </p>
            </Link>

            <Link to="/activism" className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faHandsHelping} />
              </div>
              <h3 className="feature-title">Activismo</h3>
              <p className="feature-description">
                Participa en eventos, campañas y actividades de activismo por los derechos de los animales.
              </p>
            </Link>

            {isSysadmin && (
              <Link to="/users" className="feature-card admin-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <h3 className="feature-title">Gestión de Usuarios</h3>
                <p className="feature-description">
                  Administrá usuarios del sistema, activá o desactivá cuentas y gestioná roles de acceso.
                </p>
              </Link>
            )}
      </div>
        </section>

        <section className="stats-section">
          <h2 className="section-title">Nuestra Comunidad</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <div className="stat-label">Negocios Registrados</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <div className="stat-label">Profesionales de la Salud</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <div className="stat-label">Recursos Informativos</div>
            </div>
            <div className="stat-item">
              <span className="stat-number">5+</span>
              <div className="stat-label">Activismos</div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2 className="section-title">¿List@ para empezar?</h2>
          <p className="hero-subtitle">
            Unite a nuestra comunidad vegana y descubrí todo lo que Rosario tiene para ofrecer.
          </p>
          <div className="cta-buttons">
            <Link to="/business" className="cta-button primary">
              <FontAwesomeIcon icon={faStore} />
              <span>Explorar Negocios</span>
            </Link>
            <Link to="/comments" className="cta-button secondary">
              <FontAwesomeIcon icon={faUsers} />
              <span>Unirse a la Comunidad</span>
          </Link>
          </div>
      </section>
      </div>
    </div>
  );
};

export default Home;
