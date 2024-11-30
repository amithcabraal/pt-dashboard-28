import { X, RotateCcw } from 'lucide-react';
import { useColors } from '../contexts/ColorContext';

export function ColorSettingsModal() {
  const { colors, updateColor, resetColors } = useColors();

  const colorSections = [
    {
      title: 'Status Colors',
      category: 'status',
      items: [
        { key: 'neutral', label: 'Neutral Status' },
        { key: 'red', label: 'Red Status' },
        { key: 'amber', label: 'Amber Status' },
        { key: 'green', label: 'Green Status' }
      ]
    },
    {
      title: 'Progress Colors',
      category: 'progress',
      items: [
        { key: 'low', label: 'Low Progress' },
        { key: 'medium', label: 'Medium Progress' },
        { key: 'high', label: 'High Progress' }
      ]
    }
  ];

  return (
    <dialog id="color-settings-modal" className="rounded-lg shadow-xl p-0 w-full max-w-2xl dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Color Settings</h2>
          <div className="flex gap-2">
            <button
              onClick={resetColors}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Reset to defaults"
            >
              <RotateCcw size={20} className="dark:text-white" />
            </button>
            <button
              onClick={() => document.getElementById('color-settings-modal')?.close()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X size={20} className="dark:text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {colorSections.map(section => (
            <div key={section.category} className="space-y-4">
              <h3 className="text-lg font-semibold dark:text-white">{section.title}</h3>
              <div className="grid gap-4">
                {section.items.map(item => (
                  <div key={item.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium dark:text-gray-300">{item.label}</label>
                      <div className="flex gap-4">
                        <div className="space-y-1">
                          <span className="text-xs dark:text-gray-400">Background</span>
                          <input
                            type="color"
                            value={colors[section.category][item.key].background}
                            onChange={(e) => updateColor(section.category, item.key, { background: e.target.value })}
                            className="block w-12 h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs dark:text-gray-400">Text</span>
                          <input
                            type="color"
                            value={colors[section.category][item.key].text}
                            onChange={(e) => updateColor(section.category, item.key, { text: e.target.value })}
                            className="block w-12 h-8"
                          />
                        </div>
                      </div>
                    </div>
                    <div 
                      className="p-2 rounded text-center"
                      style={{ 
                        backgroundColor: colors[section.category][item.key].background,
                        color: colors[section.category][item.key].text
                      }}
                    >
                      Preview Text
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold dark:text-white">Execution Bar</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium dark:text-gray-300">Bar Colors</label>
                <div className="flex gap-4">
                  <div className="space-y-1">
                    <span className="text-xs dark:text-gray-400">Background</span>
                    <input
                      type="color"
                      value={colors.execution.background}
                      onChange={(e) => updateColor('execution', 'bar', { background: e.target.value })}
                      className="block w-12 h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs dark:text-gray-400">Text</span>
                    <input
                      type="color"
                      value={colors.execution.text}
                      onChange={(e) => updateColor('execution', 'bar', { text: e.target.value })}
                      className="block w-12 h-8"
                    />
                  </div>
                </div>
              </div>
              <div 
                className="p-2 rounded text-center"
                style={{ 
                  backgroundColor: colors.execution.background,
                  color: colors.execution.text
                }}
              >
                Preview Text
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}