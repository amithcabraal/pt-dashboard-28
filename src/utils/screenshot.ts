import html2canvas from 'html2canvas';
import { closeMenu } from './menu';

export async function captureScreenshot(): Promise<HTMLCanvasElement | null> {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return null;
  }

  try {
    await closeMenu();

    // Ensure we capture the full height
    const fullHeight = Math.max(
      rootElement.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    // Ensure we capture the full width
    const fullWidth = Math.max(
      rootElement.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    );

    return await html2canvas(rootElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      foreignObjectRendering: true,
      scrollX: 0,
      scrollY: -window.scrollY, // Adjust for scroll position
      width: fullWidth,
      height: fullHeight,
      windowWidth: fullWidth,
      windowHeight: fullHeight
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

export async function takeScreenshot() {
  try {
    document.body.classList.add('screenshot-mode');
    await closeMenu();

    const canvas = await captureScreenshot();
    if (!canvas) {
      throw new Error('Failed to capture screenshot');
    }

    // Create a download link with timestamp in filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `dashboard-snapshot-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    document.body.classList.remove('screenshot-mode');
  }
}