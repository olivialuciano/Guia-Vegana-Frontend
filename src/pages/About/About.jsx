import "./About.css";
import Olivia from "../../assets/img/olivia.jpeg";
import Lucia from "../../assets/img/lucia.jpeg";

const About = () => {
  return (
    <div className="about-container">
      <div className="sobrenosotras">
        <h1>Sobre Nosotras</h1>
      </div>

      <div className="about-content">
        <div className="about-text">
          <p className="primerp">
            Bienvenid@s a nuestra página web. Somos Olivia y Lucía, creadoras y desarrolladoras de esta página web. Ambas
            somos Técnicas Universitarias en Programación, apasionadas por la
            tecnología y el desarrollo.
          </p>
          <p>
            Este proyecto nació con la intención de brindar un espacio accesible
            y organizado donde se puedan encontrar recursos útiles, negocios,
            activismos y profesionales de la salud dentro del veganismo. Creemos
            que la tecnología puede ser una herramienta poderosa para conectar
            comunidades y facilitar el acceso a la información.
          </p>
          <p>
            Nuestra formación nos ha permitido diseñar y desarrollar esta
            plataforma con un enfoque en la experiencia del usuario, la
            accesibilidad y la eficiencia. Nos esforzamos por mejorar
            constantemente, implementando nuevas funcionalidades y optimizando
            el sitio para que sea lo más intuitivo y útil posible.
          </p>
        </div>

        <div className="about-photos">
          <div className="photo-container">
            <a 
              href="https://linkedin.com/in/olivialuciano"
              target="_blank"
              rel="noopener noreferrer"
              className="photo-link"
            >
              <img src={Olivia} alt="Olivia Luciano" className="profile-photo" />
              <p>Olivia</p>
            </a>
          </div>
          <div className="photo-container">
            <a 
              href="https://linkedin.com/in/luciapalazzini"
              target="_blank"
              rel="noopener noreferrer"
              className="photo-link"
            >
              <img src={Lucia} alt="Lucía Palazzini" className="profile-photo" />
              <p>Lucía</p>
            </a>
          </div>
        </div>
      </div>

      <h2>Contacto</h2>
      <p>
        📧 <strong>Correo electrónico:</strong>{" "}
        <a href="mailto:guiaveganaderosario@gmail.com">guiaveganaderosario@gmail.com</a>
      </p>
    </div>
  );
};

export default About;
