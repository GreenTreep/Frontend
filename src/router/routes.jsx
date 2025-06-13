import Home from '../pages/Home.jsx';
import { createBrowserRouter } from 'react-router-dom';
import Error404 from '../pages/Error404.jsx';
import BaseLayout from '../layouts/BaseLayouts.jsx';
import MapPage from '../pages/Map.jsx';
import Test from '../pages/Test.jsx';
import Login from '../security/Login.jsx';
import Register from '../security/Register.jsx';
import HelpAdmin from '../help/HelpAdmin.jsx'
import Shop from '../pages/Shop.jsx';
import Checkout from '../pages/Checkout.jsx';
import Orders from '../pages/Orders.jsx'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe("cle_secrete");

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
        path: '/shop',
        element: <Shop/>
      },
      {
        path: "/checkout",
        element: (
          <Elements stripe={stripePromise}>
            <Checkout />
          </Elements>
        )
      },
      {
        path: '/orders',
        element: <Orders/>
      }
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;