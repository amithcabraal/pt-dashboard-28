import { closeMenu } from './menu';

export async function prepareForExport() {
  document.body.classList.add('screenshot-mode');
  await closeMenu();
  
  // Wait for any animations to complete
  await new Promise(resolve => setTimeout(resolve, 300));
}

export function cleanupAfterExport() {
  document.body.classList.remove('screenshot-mode');
}

// Re-export other export-related utilities
export { exportToPdf } from './exportPdf';
export { exportToPowerPoint } from './exportPowerPoint';