import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/routes.jsx';
import { ThemeProvider } from "./hooks/theme-provider.jsx";
import { AuthProvider } from '@/security/auth/AuthContext'; 



function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="relative h-full w-full overflow-x-hidden  dark:bg-slate-950">
        <AuthProvider>
          <RouterProvider router={router} />
          </AuthProvider>
        </div>
    </ThemeProvider>
  );
}

export default App;
