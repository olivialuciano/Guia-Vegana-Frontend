import React from 'react';
import Card from '../Card/Card';
import './CardGrid.css';

const CardGrid = ({ items, entityType }) => {
  if (!items || items.length === 0) {
    return <div className="no-items">No hay elementos para mostrar</div>;
  }

  return (
    <div className="card-grid">
      {items.map((item) => (
        <Card
          key={item.id}
          item={item}
          entityType={entityType}
        />
      ))}
    </div>
  );
};

export default CardGrid;
