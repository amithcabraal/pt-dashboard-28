import { X } from 'lucide-react';

interface NoteModalProps {
  note: string;
  onClose: () => void;
}

export function NoteModal({ note, onClose }: NoteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold dark:text-white">Note</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>
        <div className="p-4">
          <p className="whitespace-pre-wrap dark:text-white">{note}</p>
        </div>
      </div>
    </div>
  );
}