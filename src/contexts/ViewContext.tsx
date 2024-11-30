import React, { createContext, useContext, useState } from 'react';

type ViewMode = 'standard' | 'compact';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  hideControls: boolean;
  setHideControls: (hide: boolean) => void;
  showOverview: boolean;
  setShowOverview: (show: boolean) => void;
  showOverview2: boolean;
  setShowOverview2: (show: boolean) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [hideControls, setHideControls] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showOverview2, setShowOverview2] = useState(false);

  return (
    <ViewContext.Provider value={{ 
      viewMode, 
      setViewMode, 
      hideControls, 
      setHideControls,
      showOverview,
      setShowOverview,
      showOverview2,
      setShowOverview2
    }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}