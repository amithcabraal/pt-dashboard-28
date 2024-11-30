import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TestRow } from './components/TestRow';
import { TestRunsModal } from './components/TestRunsModal';
import { AboutModal } from './components/AboutModal';
import { ColorSchemeModal } from './components/ColorSchemeModal';
import { ColorSettingsModal } from './components/ColorSettingsModal';
import { WelcomeModal } from './components/WelcomeModal';
import { AddEditTestModal } from './components/AddEditTestModal';
import { RadialChart } from './components/RadialChart';
import { RadialChart2 } from './components/chart/RadialChart2';
import { PerformanceTest, TestRun } from './types';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/storage';
import { Upload, Plus } from 'lucide-react';
import { useView } from './contexts/ViewContext';

function App() {
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<PerformanceTest | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState<PerformanceTest | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { hideControls, showOverview, showOverview2 } = useView();

  useEffect(() => {
    const { tests: savedTests, lastUpdated: savedLastUpdated } = loadFromLocalStorage();
    setTests(savedTests);
    setLastUpdated(savedLastUpdated);
  }, []);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTests = JSON.parse(e.target?.result as string);
          setTests(importedTests);
          saveToLocalStorage(importedTests);
        } catch (error) {
          console.error('Error importing file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveTest = (testData: Partial<PerformanceTest>) => {
    if (editingTest) {
      // Update existing test
      const updatedTests = tests.map(test => 
        test.id === editingTest.id 
          ? { ...test, ...testData }
          : test
      );
      setTests(updatedTests);
      saveToLocalStorage(updatedTests);
      setEditingTest(null);
    } else {
      // Add new test
      const newTest: PerformanceTest = {
        id: crypto.randomUUID(),
        reference: testData.reference || '',
        name: testData.name || '',
        note: testData.note,
        sequence: testData.sequence || 0,
        preparation: testData.preparation || { data: 0, script: 0, env: 0 },
        execution: testData.execution || { targetTps: 0, achievedTps: 0 },
        status: testData.status || 'neutral',
        testRuns: []
      };

      const updatedTests = [...tests, newTest];
      setTests(updatedTests);
      saveToLocalStorage(updatedTests);
    }
    setShowAddModal(false);
  };

  const handleAddTestRun = (testId: string, testRun: Omit<TestRun, 'id'>) => {
    const updatedTests = tests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          testRuns: [...test.testRuns, { ...testRun, id: crypto.randomUUID() }]
        };
      }
      return test;
    });
    setTests(updatedTests);
    saveToLocalStorage(updatedTests);
  };

  const handleEditTestRun = (testId: string, testRunId: string, testRun: Omit<TestRun, 'id'>) => {
    const updatedTests = tests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          testRuns: test.testRuns.map(run => 
            run.id === testRunId 
              ? { ...testRun, id: testRunId }
              : run
          )
        };
      }
      return test;
    });
    setTests(updatedTests);
    saveToLocalStorage(updatedTests);
  };

  const handleDeleteTestRun = (testId: string, testRunId: string) => {
    const updatedTests = tests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          testRuns: test.testRuns.filter(run => run.id !== testRunId)
        };
      }
      return test;
    });
    setTests(updatedTests);
    saveToLocalStorage(updatedTests);
  };

  const handleDeleteTest = (testId: string) => {
    const updatedTests = tests.filter(test => test.id !== testId);
    setTests(updatedTests);
    saveToLocalStorage(updatedTests);
  };

  const handleEditTest = (test: PerformanceTest) => {
    setEditingTest(test);
    setShowAddModal(true);
  };

  // Sort tests by sequence number
  const sortedTests = [...tests].sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header lastUpdated={lastUpdated} tests={tests} />
      <AboutModal />
      <ColorSchemeModal />
      <ColorSettingsModal />
      <WelcomeModal />
      
      <main className="container mx-auto p-4">
        {!hideControls && (
          <div className="mb-6 flex justify-between screenshot-hide">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Add Test
            </button>
            
            <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
              <Upload size={16} className="mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        )}

        {sortedTests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No performance tests added yet. Click "Add Test" to get started.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 performance-table">
              {sortedTests.map((test) => (
                <TestRow
                  key={test.id}
                  test={test}
                  onTestClick={!hideControls ? (test) => setSelectedTest(test) : undefined}
                  onEdit={!hideControls ? handleEditTest : undefined}
                  onDelete={!hideControls ? handleDeleteTest : undefined}
                />
              ))}
            </div>
            {showOverview && <RadialChart tests={sortedTests} />}
            {showOverview2 && <RadialChart2 tests={sortedTests} />}
          </>
        )}
      </main>

      {showAddModal && (
        <AddEditTestModal
          onClose={() => {
            setShowAddModal(false);
            setEditingTest(null);
          }}
          onSave={handleSaveTest}
          test={editingTest}
          isEdit={!!editingTest}
        />
      )}

      {selectedTest && (
        <TestRunsModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onAddTestRun={handleAddTestRun}
          onEditTestRun={handleEditTestRun}
          onDeleteTestRun={handleDeleteTestRun}
        />
      )}
    </div>
  );
}

export default App;