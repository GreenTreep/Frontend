import React, { createContext, useContext, useEffect, useState } from "react";


//https://ui.shadcn.com/docs/dark-mode/vite ça vient de là.
const initialState = {
  theme: "light", 
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export const ThemeProvider = ({
  children,
  defaultTheme = null, 
  storageKey = "vite-ui-theme",
  ...props
}) => {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [theme, setThemeState] = useState(() => {
    const storedTheme = localStorage.getItem(storageKey);
    return storedTheme ? storedTheme : getSystemTheme();
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };


  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem(storageKey)) {
        setThemeState(getSystemTheme());
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [storageKey]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};