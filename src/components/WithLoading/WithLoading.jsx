import React from 'react';
import Loading from '../Loading/Loading';
import './WithLoading.css';

const WithLoading = ({ loading, children, error = null }) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return children;
};

export default WithLoading; 