import Home from '../pages/Home.jsx';
import { createBrowserRouter } from 'react-router-dom';
import Error404 from '../pages/Error404.jsx';
import BaseLayout from '../layouts/BaseLayouts.jsx';
import MapPage from '../pages/Map.jsx';
import Test from '../pages/Test.jsx';
import Login from '../security/Login.jsx';
import Register from '../security/Register.jsx';
import HelpAdmin from '../help/HelpAdmin.jsx'
import EcoNews from '../pages/EcoNews.jsx';
import CarbonCalculator from '../pages/CarbonCalculator.jsx';
import Chatbot from '@/components/chatbot/Chatbot.jsx';


const routes = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: '/test',
        element: <Test />,
      },
      {
        path: '/mapbox',
        element: <MapPage />,
      },
      {
        path: '/eco-news',
        element: <EcoNews />,
      },
      {
        path: '/carbon-footprint',
        element: <CarbonCalculator />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '*',
        element: <Error404 />,
      },
      {
        path: '/help-admin',
        element: <HelpAdmin />,
      },
      {
        path: '/chatbot',
        element: <Chatbot />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
