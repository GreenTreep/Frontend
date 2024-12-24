import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Background from './Background.jsx';

const BaseLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isMapBoxPage = location.pathname === '/mapbox';
  const isHelpAdminPage = location.pathname === '/help-admin';

  return (
    <div className="min-h-screen relative">
      {!isHelpAdminPage && <Background />}
      {!isRegisterPage && !isLoginPage && !isMapBoxPage && <Header />} {/* Affiche le Header sauf sur /login et /register */}
      <main className="relative z-10"> {/* Ajustez pt-20 selon la hauteur de votre Header */}
        <Outlet />
      </main>
      {!isRegisterPage && !isLoginPage && !isMapBoxPage && !isHelpAdminPage && <Footer />}
    </div>
  );
};

export default BaseLayout;