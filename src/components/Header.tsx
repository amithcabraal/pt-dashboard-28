import { Menu, Info, Download, Palette, Layout, Eye, EyeOff, Camera, PieChart, FileText, Presentation } from 'lucide-react';
import { useState } from 'react';
import { exportToJson } from '../utils/storage';
import { useView } from '../contexts/ViewContext';
import { formatLastUpdated } from '../utils/date';
import { takeScreenshot } from '../utils/screenshot';
import { exportToPdf, exportToPowerPoint } from '../utils/export';
import { PerformanceTest } from '../types';

interface HeaderProps {
  lastUpdated: string | null;
  tests: PerformanceTest[];
}

export function Header({ lastUpdated, tests }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { 
    viewMode, 
    setViewMode, 
    hideControls, 
    setHideControls, 
    showOverview, 
    setShowOverview,
    showOverview2,
    setShowOverview2 
  } = useView();

  const handleOverviewClick = (type: 'overview' | 'overview2') => {
    if (type === 'overview') {
      setShowOverview(!showOverview);
      if (showOverview2) setShowOverview2(false);
    } else {
      setShowOverview2(!showOverview2);
      if (showOverview) setShowOverview(false);
    }
    setIsMenuOpen(false);
    
    setTimeout(() => {
      const elementId = type === 'overview' ? 'overview-chart' : 'overview-chart-2';
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Performance Test Dashboard</h1>
          <span className="text-gray-300 text-sm">
            Last updated: {formatLastUpdated(lastUpdated)}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-full"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById('about-modal')?.showModal();
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById('color-scheme-modal')?.showModal();
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Info className="w-4 h-4 mr-2" />
                  Theme
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById('color-settings-modal')?.showModal();
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </button>
                <div className="relative group/view">
                  <button
                    className="flex items-center justify-between px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left group-hover/view:bg-gray-100 dark:group-hover/view:bg-gray-700"
                  >
                    <span className="flex items-center">
                      <Layout className="w-4 h-4 mr-2" />
                      View
                    </span>
                    <span className="text-xs text-gray-500">◀</span>
                  </button>
                  <div className="absolute right-full top-0 w-48 invisible group-hover/view:visible">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl -mr-0.5 py-1">
                      <button
                        onClick={() => {
                          setViewMode('standard');
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center px-4 py-2 w-full text-left ${
                          viewMode === 'standard'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        onClick={() => {
                          setViewMode('compact');
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center px-4 py-2 w-full text-left ${
                          viewMode === 'compact'
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        Compact
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleOverviewClick('overview')}
                  className={`flex items-center px-4 py-2 w-full text-left ${
                    showOverview
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Overview 1
                </button>
                <button
                  onClick={() => handleOverviewClick('overview2')}
                  className={`flex items-center px-4 py-2 w-full text-left ${
                    showOverview2
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Overview 2
                </button>
                <button
                  onClick={() => {
                    setHideControls(!hideControls);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  {hideControls ? (
                    <Eye className="w-4 h-4 mr-2" />
                  ) : (
                    <EyeOff className="w-4 h-4 mr-2" />
                  )}
                  {hideControls ? 'Show Controls' : 'Hide Controls'}
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    takeScreenshot();
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Screenshot
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    exportToPdf();
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export to PDF
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    exportToPowerPoint(tests);
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Presentation className="w-4 h-4 mr-2" />
                  Export to PPT
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    exportToJson();
                  }}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}