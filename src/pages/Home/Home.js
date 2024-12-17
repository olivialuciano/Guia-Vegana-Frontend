import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import CardGrid from "../../components/CardGrid/CardGrid";

const Home = () => {
  const categories = [
    { id: 1, name: "Bares y Restaurantes", businessType: "0" },
    { id: 2, name: "Panaderías", businessType: "1" },
    { id: 3, name: "Heladerías", businessType: "2" },
    { id: 4, name: "Emprendimientos", businessType: "4" },
    { id: 5, name: "Mercados y Dietéticas", businessType: "3" },
    { id: 6, name: "Recursos Informativos", link: "/informative-resource" },
    { id: 7, name: "Médicos y Nutricionistas", link: "/health-professional" },
    { id: 8, name: "Activismos", link: "/activism" },
  ];

  return (
    <div className="home">
      <br></br>
      <br></br>
      <h1 className="home-title">La Guía Vegana de Rosario</h1>
      <br></br>
      <p className="home-description">
        Descubrí bares, restaurantes, heladerías, panaderías, emprendimientos,
        mercados, dietéticas, especialistas, recursos informativos, grupos de
        activismo y más!
      </p>
    </div>
  );
};

export default Home;
