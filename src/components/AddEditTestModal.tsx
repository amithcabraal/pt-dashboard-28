import { useState } from 'react';
import { X } from 'lucide-react';
import { PerformanceTest } from '../types';

interface AddEditTestModalProps {
  onClose: () => void;
  onSave: (test: Partial<PerformanceTest>) => void;
  test?: PerformanceTest;
  isEdit?: boolean;
}

export function AddEditTestModal({ onClose, onSave, test, isEdit }: AddEditTestModalProps) {
  const [formData, setFormData] = useState({
    reference: test?.reference || '',
    name: test?.name || '',
    note: test?.note || '',
    sequence: test?.sequence || 0,
    preparation: {
      data: test?.preparation.data || 0,
      script: test?.preparation.script || 0,
      env: test?.preparation.env || 0,
    },
    execution: {
      targetTps: test?.execution.targetTps || 0,
      achievedTps: test?.execution.achievedTps || 0,
    },
    status: test?.status || 'neutral' as 'red' | 'amber' | 'green' | 'neutral',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: test?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Edit Test' : 'Add New Test'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="e.g., PT1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="e.g., Homepage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Optional notes about this test"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sequence</label>
            <input
              type="number"
              value={formData.sequence}
              onChange={(e) => setFormData({ ...formData, sequence: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="1"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.preparation.data}
                onChange={(e) => setFormData({
                  ...formData,
                  preparation: {
                    ...formData.preparation,
                    data: Number(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Script (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.preparation.script}
                onChange={(e) => setFormData({
                  ...formData,
                  preparation: {
                    ...formData.preparation,
                    script: Number(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Env (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.preparation.env}
                onChange={(e) => setFormData({
                  ...formData,
                  preparation: {
                    ...formData.preparation,
                    env: Number(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Target TPS</label>
              <input
                type="number"
                min="0"
                value={formData.execution.targetTps}
                onChange={(e) => setFormData({
                  ...formData,
                  execution: {
                    ...formData.execution,
                    targetTps: Number(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Achieved TPS</label>
              <input
                type="number"
                min="0"
                value={formData.execution.achievedTps}
                onChange={(e) => setFormData({
                  ...formData,
                  execution: {
                    ...formData.execution,
                    achievedTps: Number(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'red' | 'amber' | 'green' | 'neutral' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="neutral">Neutral</option>
              <option value="red">Red</option>
              <option value="amber">Amber</option>
              <option value="green">Green</option>
            </select>
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
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}