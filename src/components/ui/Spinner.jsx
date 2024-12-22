// src/components/Spinner.jsx
import React from 'react';
import './Spinner.css'; // Assurez-vous de créer ce fichier CSS

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner" aria-label="Chargement en cours"></div>
    </div>
  );
};

export default Spinner;
