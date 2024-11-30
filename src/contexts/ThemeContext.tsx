import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem('colorScheme');
    return (saved as ColorScheme) || 'system';
  });

  useEffect(() => {
    const updateTheme = (scheme: ColorScheme) => {
      const isDark = scheme === 'dark' || 
        (scheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      document.documentElement.classList.toggle('dark', isDark);
    };

    updateTheme(colorScheme);
    localStorage.setItem('colorScheme', colorScheme);

    if (colorScheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}