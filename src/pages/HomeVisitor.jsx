// HomeVisitor.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomeVisitor = () => {
  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center bg-gradient-to-r p-4">
      <div className="text-center   max-w-md">
        <h1 className="text-5xl animate-slidein300 opacity-0 font-bold mb-4">Bienvenue sur Notre Site!</h1>
        <p className="text-2xl animate-slidein500 opacity-0 font-light mb-6">
          Page pour les visiteur
        </p>
        <div className="flex space-x-4 animate-slidein700 opacity-0 justify-center">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium   bg-blue-600 border border-transparent rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:shadow-outline transition-colors duration-150"
          >
            Se Connecter
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-transparent rounded-lg shadow hover:bg-gray-100 focus:outline-none focus:shadow-outline transition-colors duration-150"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeVisitor;
