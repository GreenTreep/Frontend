// Background.jsx

import React from 'react';
import backgroundImage from '../assets/h.png'; // Assurez-vous que le chemin est correct

const Background = () => {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center z-[-2]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Optionnel : Ajouter un overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
    </div>
  );
};

export default Background;
