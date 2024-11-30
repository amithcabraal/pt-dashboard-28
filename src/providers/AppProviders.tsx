import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ColorProvider } from '../contexts/ColorContext';
import { ViewProvider } from '../contexts/ViewContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <ColorProvider>
        <ViewProvider>
          {children}
        </ViewProvider>
      </ColorProvider>
    </ThemeProvider>
  );
}