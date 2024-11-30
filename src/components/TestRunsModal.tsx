import { useState } from 'react';
import { X, Plus, Edit } from 'lucide-react';
import { TestRun, PerformanceTest } from '../types';
import { AddEditTestRunModal } from './AddEditTestRunModal';

interface TestRunsModalProps {
  test: PerformanceTest;
  onClose: () => void;
  onAddTestRun: (testId: string, testRun: Omit<TestRun, 'id'>) => void;
  onEditTestRun: (testId: string, testRunId: string, testRun: Omit<TestRun, 'id'>) => void;
  onDeleteTestRun: (testId: string, testRunId: string) => void;
}

export function TestRunsModal({ test, onClose, onAddTestRun, onEditTestRun, onDeleteTestRun }: TestRunsModalProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTestRun, setEditingTestRun] = useState<TestRun | null>(null);
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);

  const handleSaveTestRun = (testRun: Omit<TestRun, 'id'>) => {
    if (editingTestRun) {
      onEditTestRun(test.id, editingTestRun.id, testRun);
      setEditingTestRun(null);
    } else {
      onAddTestRun(test.id, testRun);
    }
    setShowAddModal(false);
  };

  const handleDeleteConfirm = (runId: string) => {
    onDeleteTestRun(test.id, runId);
    setDeletingRunId(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {test.reference} - {test.name} Test Runs
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <button
            onClick={() => {
              setEditingTestRun(null);
              setShowAddModal(true);
            }}
            className="mb-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add Test Run
          </button>

          <div className="overflow-y-auto max-h-[60vh]">
            {test.testRuns.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No test runs recorded yet.</p>
            ) : (
              test.testRuns.map((run) => (
                <div key={run.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="grid grid-cols-2 gap-4 flex-grow">
                      <div>
                        <p className="text-sm text-gray-600">Start Time</p>
                        <p>{new Date(run.startTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">End Time</p>
                        <p>{new Date(run.endTime).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTestRun(run);
                          setShowAddModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded text-gray-600"
                        title="Edit Test Run"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingRunId(run.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600 text-xl leading-none"
                        title="Delete Test Run"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="whitespace-pre-wrap">{run.notes}</p>
                  </div>
                  
                  <div className="mt-4 flex space-x-4">
                    <a
                      href={run.appDynamicsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      AppDynamics Dashboard
                    </a>
                    <a
                      href={run.loadRunnerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LoadRunner Dashboard
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEditTestRunModal
          onClose={() => {
            setShowAddModal(false);
            setEditingTestRun(null);
          }}
          onSave={handleSaveTestRun}
          testRun={editingTestRun}
          isEdit={!!editingTestRun}
        />
      )}

      {deletingRunId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Test Run</h3>
            <p className="mb-6">Are you sure you want to delete this test run?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeletingRunId(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingRunId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}