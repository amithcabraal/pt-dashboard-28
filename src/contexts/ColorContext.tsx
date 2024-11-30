import React, { createContext, useContext, useState, useEffect } from 'react';

interface ColorConfig {
  background: string;
  text: string;
}

interface ColorSettings {
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

const defaultColors: ColorSettings = {
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

interface ColorContextType {
  colors: ColorSettings;
  updateColor: (category: string, key: string, colors: Partial<ColorConfig>) => void;
  resetColors: () => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ColorSettings>(() => {
    const saved = localStorage.getItem('customColors');
    return saved ? JSON.parse(saved) : defaultColors;
  });

  useEffect(() => {
    localStorage.setItem('customColors', JSON.stringify(colors));
    applyColors(colors);
  }, [colors]);

  const applyColors = (colors: ColorSettings) => {
    const style = document.documentElement.style;
    
    Object.entries(colors.status).forEach(([key, value]) => {
      style.setProperty(`--status-${key}-bg`, value.background);
      style.setProperty(`--status-${key}-text`, value.text);
    });

    Object.entries(colors.progress).forEach(([key, value]) => {
      style.setProperty(`--progress-${key}-bg`, value.background);
      style.setProperty(`--progress-${key}-text`, value.text);
    });

    style.setProperty('--execution-bg', colors.execution.background);
    style.setProperty('--execution-text', colors.execution.text);
  };

  const updateColor = (category: string, key: string, newColors: Partial<ColorConfig>) => {
    setColors(prev => {
      const updated = { ...prev };
      if (category === 'execution') {
        updated.execution = { ...updated.execution, ...newColors };
      } else {
        updated[category][key] = { ...updated[category][key], ...newColors };
      }
      return updated;
    });
  };

  const resetColors = () => {
    setColors(defaultColors);
  };

  return (
    <ColorContext.Provider value={{ colors, updateColor, resetColors }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColors() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
}