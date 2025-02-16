import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardGrid.css";

const CardGrid = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="card-grid">
      {items.map((item) => (
        <div
          key={item.id}
          className="card-grid-item"
          onClick={() => navigate(item.link)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default CardGrid;
