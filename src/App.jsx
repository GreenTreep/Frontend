import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/routes.jsx';
import { ThemeProvider } from './hooks/theme-provider.jsx';
import { AuthProvider } from '@/security/auth/AuthContext';
import { CartProvider } from './context/CartContext.jsx';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <CartProvider>
        <div className="relative h-full w-full overflow-x-hidden">
          <RouterProvider router={router} />
        </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
