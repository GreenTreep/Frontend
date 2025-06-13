import { Outlet, useLocation } from 'react-router-dom';
import Background from './Background.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';

const BaseLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isMapBoxPage = location.pathname === '/mapbox';
  const isHelpAdminPage = location.pathname === '/help-admin';
  const isEcoNewsPage = location.pathname === '/eco-news';
  const isCarbonPage = location.pathname === '/carbon-footprint';
  return (
    <div className="min-h-screen relative">
      {!isMapBoxPage && !isHelpAdminPage && !isEcoNewsPage && !isCarbonPage && <Background />}
      {!isRegisterPage && !isLoginPage && !isMapBoxPage && <Header />} {/* Affiche le Header sauf sur /login et /register */}
      <main className="relative z-10"> {/* Ajustez pt-20 selon la hauteur de votre Header */}
        <Outlet />
      </main>
      {!isRegisterPage && !isLoginPage && !isMapBoxPage && !isHelpAdminPage && <Footer />}
    </div>
  );
};

export default BaseLayout;