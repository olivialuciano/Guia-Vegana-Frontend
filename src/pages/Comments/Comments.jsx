import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faUser, 
  faComments, 
  faPaperPlane, 
  faCheckCircle, 
  faExclamationTriangle,
  faLeaf,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/Loading/Loading";
import "./Comments.css";

const Comments = () => {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const data = new FormData(e.target);

    try {
      const response = await fetch("https://formspree.io/f/mldnwdrj", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-container">
      <div className="comments-header">
        <div className="header-icon-wrapper">
          <FontAwesomeIcon icon={faComments} className="header-icon" />
        </div>
        <h1>Contáctanos</h1>
        <p className="header-subtitle">
          ¿Tienes alguna pregunta, sugerencia o comentario? ¡Nos encantaría escucharte!
        </p>
      </div>

      <div className="comments-content">
        <div className="contact-info-section">
          
          
          <div className="contact-card">
            <div className="contact-icon">
              <FontAwesomeIcon icon={faLeaf} />
            </div>
            <h3>Comunidad Vegana</h3>
            <p>Forma parte de nuestra comunidad</p>
            <a 
              href="https://chat.whatsapp.com/DJeImc8KwM0ATemynnnjPI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              <FontAwesomeIcon icon={faPhone} />
              <span>Entrar al grupo</span>
            </a>
          </div>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="textarea-wrapper">
                <FontAwesomeIcon icon={faComments} className="input-icon" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="form-textarea"
                  rows="6"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="button-loading">
                  <Loading />
                  <span>Enviando...</span>
                </div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Enviar Mensaje
                </>
              )}
            </button>
          </form>

          {status && (
            <div className={`status-message ${status}`}>
              <FontAwesomeIcon 
                icon={status === "success" ? faCheckCircle : faExclamationTriangle} 
                className="status-icon"
              />
              <p>
                {status === "success" 
                  ? "¡Mensaje enviado con éxito! Te responderemos pronto." 
                  : "Error al enviar el mensaje. Por favor, intenta nuevamente."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
