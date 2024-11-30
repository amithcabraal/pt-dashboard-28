import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">Welcome to Performance Test Dashboard</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X size={20} className="dark:text-white" />
            </button>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            <h3>Getting Started</h3>
            <p>
              This dashboard helps you track and visualize performance test progress and results.
              Here's how to use it:
            </p>
            
            <h4>Key Features</h4>
            <ul>
              <li>Add and manage performance tests with preparation status and execution metrics</li>
              <li>Track test runs with detailed notes and monitoring tool links</li>
              <li>View progress bars for Data, Script, and Environment readiness</li>
              <li>Monitor Target vs Achieved TPS for each test</li>
            </ul>
            
            <h4>Data Management</h4>
            <ul>
              <li><strong>Import:</strong> Use the Import button to load existing test data from a JSON file</li>
              <li><strong>Export:</strong> Export your test data anytime using the Export Data option in the menu</li>
              <li><strong>Auto-save:</strong> All changes are automatically saved to your browser's local storage</li>
            </ul>
            
            <h4>View Modes</h4>
            <ul>
              <li><strong>Standard:</strong> Default view with full details</li>
              <li><strong>Compact:</strong> Condensed view for more tests on screen</li>
              <li><strong>Report:</strong> Clean view without action buttons, perfect for sharing</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}