import { useState } from 'react';
import { X } from 'lucide-react';
import { TestRun } from '../types';

interface AddEditTestRunModalProps {
  onClose: () => void;
  onSave: (testRun: Omit<TestRun, 'id'>) => void;
  testRun?: TestRun | null;
  isEdit?: boolean;
}

export function AddEditTestRunModal({ onClose, onSave, testRun, isEdit }: AddEditTestRunModalProps) {
  const [formData, setFormData] = useState({
    startTime: testRun?.startTime || '',
    endTime: testRun?.endTime || '',
    notes: testRun?.notes || '',
    appDynamicsUrl: testRun?.appDynamicsUrl || '',
    loadRunnerUrl: testRun?.loadRunnerUrl || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Test Run' : 'Add Test Run'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">AppDynamics URL</label>
            <input
              type="url"
              value={formData.appDynamicsUrl}
              onChange={(e) => setFormData({ ...formData, appDynamicsUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">LoadRunner URL</label>
            <input
              type="url"
              value={formData.loadRunnerUrl}
              onChange={(e) => setFormData({ ...formData, loadRunnerUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? 'Update' : 'Add'} Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}