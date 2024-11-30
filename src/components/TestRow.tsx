import { PerformanceTest } from '../types';
import { Edit, ListTodo, StickyNote } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { useView } from '../contexts/ViewContext';
import { NoteModal } from './NoteModal';
import { useState } from 'react';

interface TestRowProps {
  test: PerformanceTest;
  onTestClick?: (test: PerformanceTest) => void;
  onEdit?: (test: PerformanceTest) => void;
  onDelete?: (testId: string) => void;
}

const statusColors = {
  neutral: 'status-neutral',
  red: 'status-red',
  amber: 'status-amber',
  green: 'status-green',
};

export function TestRow({ test, onTestClick, onEdit, onDelete }: TestRowProps) {
  const { viewMode } = useView();
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const achievedPercentage = (test.execution.achievedTps / test.execution.targetTps) * 100;
  const isCompact = viewMode === 'compact';

  const handleDelete = () => {
    if (onDelete) {
      onDelete(test.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className={isCompact ? 'py-0.5' : 'border rounded-lg mb-4 overflow-hidden'}>
        <div className={`grid grid-cols-12 gap-2 ${isCompact ? 'px-1' : 'p-4'} items-center min-h-[48px]`}>
          {/* Reference and Name */}
          <div className="col-span-3 border border-gray-300 rounded flex items-stretch min-w-0 overflow-hidden h-full">
            <div className="flex items-center px-3 min-w-[4.5rem] bg-gray-50 border-r border-gray-300">
              <span className="font-mono text-sm whitespace-nowrap">{test.reference}</span>
            </div>
            <div className={`flex-grow flex items-center justify-center gap-2 px-2 ${statusColors[test.status]}`}>
              <span className="truncate text-sm">{test.name}</span>
              {test.note && (
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="group relative focus:outline-none"
                >
                  <StickyNote size={16} className="shrink-0" />
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bars */}
          <div className="col-span-4 grid grid-cols-3 gap-1 h-full">
            <ProgressBar value={test.preparation.data} label="Data" isCompact={isCompact} />
            <ProgressBar value={test.preparation.script} label="Script" isCompact={isCompact} />
            <ProgressBar value={test.preparation.env} label="Env" isCompact={isCompact} />
          </div>

          {/* Execution Bar */}
          <div className="col-span-4 border border-gray-300 rounded overflow-hidden h-full">
            <div className="relative h-full flex items-center">
              <div 
                className="absolute top-0 left-0 h-full execution-bar"
                style={{ width: `${achievedPercentage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className={`${isCompact ? 'text-xs' : 'text-sm'} whitespace-nowrap flex items-center h-full`}>
                  Achieved: {test.execution.achievedTps} TPS
                </span>
                <span className={`${isCompact ? 'text-xs' : 'text-sm'} whitespace-nowrap flex items-center h-full`}>
                  Target: {test.execution.targetTps} TPS
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {onEdit && onTestClick && onDelete && (
            <div className="col-span-1 flex justify-end items-center gap-1 action-buttons">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(test);
                }}
                className={`flex items-center justify-center ${
                  isCompact ? 'w-6 h-6' : 'w-8 h-8'
                } hover:bg-gray-100 rounded text-gray-600`}
                title="Edit Test"
              >
                <Edit size={isCompact ? 14 : 16} />
              </button>
              <button
                onClick={() => onTestClick(test)}
                className={`flex items-center justify-center ${
                  isCompact ? 'w-6 h-6' : 'w-8 h-8'
                } hover:bg-gray-100 rounded text-gray-600 relative`}
                title="View Test Runs"
              >
                <ListTodo size={isCompact ? 14 : 16} />
                {test.testRuns.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                    {test.testRuns.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={`flex items-center justify-center ${
                  isCompact ? 'w-6 h-6' : 'w-8 h-8'
                } hover:bg-red-100 rounded text-red-600`}
                title="Delete Test"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {showNoteModal && (
        <NoteModal note={test.note || ''} onClose={() => setShowNoteModal(false)} />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Test</h3>
            <p className="mb-6">Are you sure you want to delete "{test.reference} - {test.name}"?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}