import React from 'react';
import './ReportsTable.css';

const ReportsTable = ({ data, columns, title, onRowClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className="reports-table-container">
        <h3>{title}</h3>
        <div className="no-data">
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-table-container">
      <h3>{title}</h3>
      <div className="table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'clickable' : ''}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable; 