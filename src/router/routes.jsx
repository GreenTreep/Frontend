import Home from '../pages/Home.jsx';
import { createBrowserRouter } from 'react-router-dom';
import Error404 from '../pages/Error404.jsx';
import BaseLayout from '../layouts/BaseLayouts.jsx';
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
    ]
  },
  {
    path: '*',
    element: <Error404 />
  }
];

const router = createBrowserRouter(routes);

export default router;