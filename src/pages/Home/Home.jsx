// import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);

  const cardData = [
    {
      id: 1,
      title: "Negocios",
      description:
        "Bares, restaurantes, heladerías, dietéticas, panaderías y mercados.",
      link: "/business",
    },
    {
      id: 2,
      title: "Activismo",
      description: "Todo tipo de activismos.",
      link: "/activism",
    },
    {
      id: 3,
      title: "Profesionales de la Salud",
      description:
        "Profesionales de la salud de distintas áreas de la medicina y nutrición.",
      link: "/healthprofessional",
    },
    {
      id: 4,
      title: "Recursos Informativos",
      description: "Películas, documentales, libros y recursos web.",
      link: "/informativeresource",
    },
  ];

  // Agregar tarjeta de Usuarios solo para Sysadmin
  if (user?.role === "Sysadmin") {
    cardData.push({
      id: 5,
      title: "Usuarios",
      description: "Gestión de usuarios del sistema.",
      link: "/users",
    });
  }

  return (
    <main className="home">
      {/* Encapsulado en un div con fondo verde */}
      <div className="highlight-box">
        <h1 className="home-title">La Guía Vegana de Rosario</h1>
        <p className="home-description">
          Descubrí bares, restaurantes, heladerías, panaderías, emprendimientos,
          mercados, dietéticas, especialistas, recursos informativos, grupos de
          activismo y más!
        </p>
      </div>

      <section className="card-container">
        {cardData.map((card) => (
          <Link to={card.link} className="card-link" key={card.id}>
            <div className="card">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Home;
