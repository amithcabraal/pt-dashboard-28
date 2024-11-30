import React, { createContext, useContext, useState, useEffect } from 'react';

interface ColorConfig {
  background: string;
  text: string;
}

interface ColorPalette {
  status: {
    red: ColorConfig;
    amber: ColorConfig;
    green: ColorConfig;
    neutral: ColorConfig;
  };
  progress: {
    low: ColorConfig;
    medium: ColorConfig;
    high: ColorConfig;
  };
  execution: ColorConfig;
}

interface ColorPaletteContextType {
  palette: ColorPalette;
  updateColor: (path: string, color: Partial<ColorConfig>) => void;
  resetToDefaults: () => void;
}

const defaultPalette: ColorPalette = {
  status: {
    red: { background: '#fecaca', text: '#7f1d1d' },
    amber: { background: '#fef08a', text: '#713f12' },
    green: { background: '#bbf7d0', text: '#14532d' },
    neutral: { background: '#e5e7eb', text: '#374151' }
  },
  progress: {
    low: { background: '#ef4444', text: '#ffffff' },
    medium: { background: '#eab308', text: '#ffffff' },
    high: { background: '#22c55e', text: '#ffffff' }
  },
  execution: { background: '#14b8a6', text: '#ffffff' }
};

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined);

export function ColorPaletteProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPalette] = useState<ColorPalette>(() => {
    try {
      const saved = localStorage.getItem('colorPalette');
      return saved ? JSON.parse(saved) : defaultPalette;
    } catch (error) {
      console.error('Error loading color palette:', error);
      return defaultPalette;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('colorPalette', JSON.stringify(palette));
      
      const root = document.documentElement;
      Object.entries(palette.status).forEach(([key, value]) => {
        root.style.setProperty(`--color-status-${key}-bg`, value.background);
        root.style.setProperty(`--color-status-${key}-text`, value.text);
      });
      
      Object.entries(palette.progress).forEach(([key, value]) => {
        root.style.setProperty(`--color-progress-${key}-bg`, value.background);
        root.style.setProperty(`--color-progress-${key}-text`, value.text);
      });

      root.style.setProperty('--color-execution-bg', palette.execution.background);
      root.style.setProperty('--color-execution-text', palette.execution.text);
    } catch (error) {
      console.error('Error saving color palette:', error);
    }
  }, [palette]);

  const updateColor = (path: string, color: Partial<ColorConfig>) => {
    setPalette(prev => {
      const newPalette = { ...prev };
      const parts = path.split('.');
      let current: any = newPalette;
      
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      
      const lastPart = parts[parts.length - 1];
      current[lastPart] = {
        ...current[lastPart],
        ...color
      };
      
      return newPalette;
    });
  };

  const resetToDefaults = () => {
    setPalette(defaultPalette);
  };

  const value = {
    palette,
    updateColor,
    resetToDefaults
  };

  return (
    <ColorPaletteContext.Provider value={value}>
      {children}
    </ColorPaletteContext.Provider>
  );
}

export function useColorPalette() {
  const context = useContext(ColorPaletteContext);
  if (!context) {
    throw new Error('useColorPalette must be used within a ColorPaletteProvider');
  }
  return context;
}

export { defaultPalette };