// BaseLayout.jsx

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Background from './Background.jsx';

const BaseLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <div className="min-h-screen relative">
      <Background />
      {!isRegisterPage && !isLoginPage && <Header />} {/* Cache le Header si on est sur /login */}
      <main className="relative z-10">
        <Outlet />
      </main>
      {!isRegisterPage && !isLoginPage && <Footer />}
    </div>
  );
};

export default BaseLayout;
