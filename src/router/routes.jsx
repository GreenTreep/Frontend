import { createBrowserRouter } from 'react-router-dom';
import HelpAdmin from '../help/HelpAdmin.jsx';
import BaseLayout from '../layouts/BaseLayouts.jsx';
import Error404 from '../pages/Error404.jsx';
import HebergementsPage from '../pages/Hebergements.jsx';
import Home from '../pages/Home.jsx';
import MapPage from '../pages/Map.jsx';
import Shop from '../pages/Shop.jsx';
import Test from '../pages/Test.jsx';
import Login from '../security/Login.jsx';
import Register from '../security/Register.jsx';



import CarbonCalculator from '../pages/CarbonCalculator.jsx';
import EcoNews from '../pages/EcoNews.jsx';
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
        path: '/shop',
        element: <Shop />
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
        path: '/hebergements',
        element: <HebergementsPage />,
      },
      {
        path: '/help-admin',
        element: <HelpAdmin />,
      },
      {
        path: '*',
        element: <Error404 />,
      }
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
