import { X, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ColorSchemeModal() {
  const { colorScheme, setColorScheme } = useTheme();

  const schemes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ] as const;

  return (
    <dialog id="color-scheme-modal" className="rounded-lg shadow-xl p-0 w-full max-w-md dark:bg-gray-800">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold dark:text-white">Color Scheme</h2>
          <button
            onClick={() => document.getElementById('color-scheme-modal')?.close()}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        <div className="space-y-2">
          {schemes.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setColorScheme(id);
                document.getElementById('color-scheme-modal')?.close();
              }}
              className={`w-full flex items-center p-3 rounded-lg ${
                colorScheme === id
                  ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white'
              }`}
            >
              <Icon size={20} className="mr-3" />
              <span className="flex-grow text-left">{name}</span>
              {colorScheme === id && (
                <span className="text-sm">Current</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}