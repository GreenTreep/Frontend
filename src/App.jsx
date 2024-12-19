import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/routes.jsx';
import { ThemeProvider } from './hooks/theme-provider.jsx';
import { AuthProvider } from '@/security/auth/AuthContext';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="relative h-full w-full overflow-x-hidden">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
