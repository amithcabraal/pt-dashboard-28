import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ColorProvider } from './contexts/ColorContext';
import { ViewProvider } from './contexts/ViewContext';

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider>
        <ColorProvider>
          <ViewProvider>
            <App />
          </ViewProvider>
        </ColorProvider>
      </ThemeProvider>
    </StrictMode>
  );
}