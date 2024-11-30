import { X, RotateCcw } from 'lucide-react';
import { useColorPalette } from '../contexts/ColorPaletteContext';

export function ColorPaletteModal() {
  const { palette, updateColor, resetToDefaults } = useColorPalette();

  const colorConfigs = [
    { path: 'status.red', label: 'Status: Red', colors: palette.status.red },
    { path: 'status.amber', label: 'Status: Amber', colors: palette.status.amber },
    { path: 'status.green', label: 'Status: Green', colors: palette.status.green },
    { path: 'status.neutral', label: 'Status: Neutral', colors: palette.status.neutral },
    { path: 'progress.low', label: 'Progress: Low', colors: palette.progress.low },
    { path: 'progress.medium', label: 'Progress: Medium', colors: palette.progress.medium },
    { path: 'progress.high', label: 'Progress: High', colors: palette.progress.high },
    { path: 'execution', label: 'Execution Bar', colors: palette.execution },
  ];

  return (
    <dialog id="color-palette-modal" className="rounded-lg shadow-xl p-0 w-full max-w-md dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">Color Palette</h2>
          <div className="flex gap-2">
            <button
              onClick={resetToDefaults}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Reset to defaults"
            >
              <RotateCcw size={20} className="dark:text-white" />
            </button>
            <button
              onClick={() => document.getElementById('color-palette-modal')?.close()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X size={20} className="dark:text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {colorConfigs.map(({ path, label, colors }) => (
            <div key={path} className="space-y-2">
              <h3 className="font-medium dark:text-white">{label}</h3>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm dark:text-gray-300">Background</label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: colors.background }}
                    />
                    <input
                      type="color"
                      value={colors.background}
                      onChange={(e) => updateColor(path, { background: e.target.value })}
                      className="w-12 h-8"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-sm dark:text-gray-300">Text</label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: colors.text }}
                    />
                    <input
                      type="color"
                      value={colors.text}
                      onChange={(e) => updateColor(path, { text: e.target.value })}
                      className="w-12 h-8"
                    />
                  </div>
                </div>
              </div>
              <div 
                className="mt-2 p-2 rounded text-center"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.text
                }}
              >
                Preview Text
              </div>
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
}