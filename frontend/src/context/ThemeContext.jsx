import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('eec_theme') || 'ocean-blue';
  });

  const themes = [
    { id: 'ocean-blue', name: 'Ocean Blue', color: '#0284c7' },
    { id: 'forest-green', name: 'Forest Green', color: '#15803d' },
    { id: 'royal-purple', name: 'Royal Purple', color: '#6d28d9' },
    { id: 'sunset-orange', name: 'Sunset Orange', color: '#c2410c' },
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eec_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
