export const saveToLocalStorage = (data: any) => {
  const dataWithTimestamp = {
    tests: data,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem('performanceTests', JSON.stringify(dataWithTimestamp));
};

export const loadFromLocalStorage = () => {
  const data = localStorage.getItem('performanceTests');
  if (!data) return { tests: [], lastUpdated: null };
  
  const parsed = JSON.parse(data);
  // Handle both old format (array only) and new format (object with tests and lastUpdated)
  if (Array.isArray(parsed)) {
    return {
      tests: parsed,
      lastUpdated: null
    };
  }
  return parsed;
};

export const exportToJson = () => {
  const { tests } = loadFromLocalStorage();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const blob = new Blob([JSON.stringify(tests, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `performance-tests-${timestamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
};