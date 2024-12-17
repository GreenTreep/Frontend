import Home from '../pages/Home.jsx';
import { createBrowserRouter } from 'react-router-dom';
import Error404 from '../pages/Error404.jsx';
import BaseLayout from '../layouts/BaseLayouts.jsx';
import MapPage from '../pages/Map.jsx';
import Test from '../pages/Test.jsx';

const routes = [
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        element: <Home />,
        index: true
      },
      {
        path: '/test',
        element: <Test />
      },
      {
        path: '/mapbox',
        element: <MapPage /> // Assure-toi que le nom du composant est correct
      },
    ]
  },
  {
    path: '*',
    element: <Error404 />
  }
];

const router = createBrowserRouter(routes);

export default router;
