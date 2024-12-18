import { Outlet } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Background from './Background.jsx';

const HorizontalLayout = () => {
  return (
    <div className={'h-screen overflow-auto '}>
    <Background />
      <Header />
      <div className={' p-4 '}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default HorizontalLayout;
