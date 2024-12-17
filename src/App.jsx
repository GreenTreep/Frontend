import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/routes.jsx';
import { ThemeProvider } from "./hooks/theme-provider.jsx";


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="relative h-full w-full overflow-x-hidden  dark:bg-slate-950">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
