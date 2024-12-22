import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const Error404 = () => {
  return (
    <div className="h-screen w-screen  flex items-center justify-center">
      <div className="container flex flex-col md:flex-row items-center justify-center px-5 ">
        

        <div className="max-w-md text-center md:text-left">
          <div className="text-5xl font-bold mb-4">404</div>
          <p className="text-2xl md:text-3xl font-light leading-normal mb-2">
            Désolé, nous ne pouvons pas trouver cette page.
          </p>
          <p className="mb-8">
            Mais ne vous inquiétez pas, vous pouvez trouver plein d'autres choses sur notre page d'accueil.
          </p>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:shadow-outline transition-colors duration-150"
          >
            Retour à l&apos;Accueil
          </Link>
        </div>


        <div className="max-w-lg mt-10 md:mt-0 md:ml-10">
          <FaExclamationTriangle className="mx-auto text-6xl text-yellow-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Error404;
