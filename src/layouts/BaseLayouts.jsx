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
  const isShop = location.pathname === '/shop';
  const isCheckout = location.pathname === '/checkout';
  const isOrders = location.pathname === '/orders';
  const isEcoNewsPage = location.pathname === '/eco-news';
  const isCarbonPage = location.pathname === '/carbon-footprint';
  return (
    <div className="min-h-screen relative">
      {!isMapBoxPage && !isHelpAdminPage && !isShop && !isCheckout && !isOrders && !isEcoNewsPage && !isCarbonPage && <Background />}
      {!isRegisterPage && !isLoginPage && !isMapBoxPage && <Header />} {/* Affiche le Header sauf sur /login et /register */}
      <main className="relative z-10"> {/* Ajustez pt-20 selon la hauteur de votre Header */}
        <Outlet />
      </main>
      {!isRegisterPage && !isLoginPage && !isMapBoxPage && !isHelpAdminPage && !isShop && ! isCheckout && !isOrders && <Footer />}
    </div>
  );
};

export default BaseLayout;