import { X } from 'lucide-react';

export function AboutModal() {
  return (
    <dialog id="about-modal" className="rounded-lg shadow-xl p-0 w-full max-w-2xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">About Performance Test Dashboard</h2>
          <button
            onClick={() => document.getElementById('about-modal')?.close()}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="prose">
          <p>
            The Performance Test Dashboard is a tool for tracking and visualizing performance test progress
            and results. It provides a clear overview of:
          </p>
          
          <ul>
            <li>Test preparation status (Data, Script, Environment readiness)</li>
            <li>Execution metrics (Target vs Achieved TPS)</li>
            <li>Overall test status using a Red/Amber/Green approach</li>
            <li>Detailed test run history with links to monitoring tools</li>
          </ul>
          
          <p>
            All data is stored locally in your browser and can be exported/imported as JSON files
            for backup and sharing purposes.
          </p>
        </div>
      </div>
    </dialog>
  );
}