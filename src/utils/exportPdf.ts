import { jsPDF } from 'jspdf';
import { PerformanceTest } from '../types';
import { prepareForExport, cleanupAfterExport } from './export';
import { captureScreenshot } from './screenshot';
import { formatTestDetails, getStatusColor } from './formatTestDetails';

export async function exportToPdf() {
  try {
    await prepareForExport();

    const canvas = await captureScreenshot();
    if (!canvas) {
      throw new Error('Failed to capture screenshot');
    }

    // Create PDF in landscape orientation for the overview
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    // Add title
    pdf.setFontSize(24);
    pdf.text('Performance Test Dashboard', 40, 40);

    // Calculate dimensions for overview image
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgAspectRatio = canvas.width / canvas.height;
    
    let imgWidth = pageWidth - 80;
    let imgHeight = imgWidth / imgAspectRatio;

    if (imgHeight > pageHeight - 100) {
      imgHeight = pageHeight - 100;
      imgWidth = imgHeight * imgAspectRatio;
    }

    // Add overview image
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      40,
      60,
      imgWidth,
      imgHeight
    );

    // Get all tests
    const tests = JSON.parse(localStorage.getItem('performanceTests') || '{"tests":[]}').tests as PerformanceTest[];

    // Add detailed test information on new pages
    tests.forEach((test: PerformanceTest) => {
      pdf.addPage();
      
      // Switch to portrait for detail pages
      pdf.setPage(pdf.internal.pages.length);
      
      // Add test details
      pdf.setFontSize(20);
      pdf.setTextColor(getStatusColor(test.status));
      pdf.text(`${test.reference} - ${test.name}`, 40, 40);

      // Reset text color for details
      pdf.setTextColor(0);
      pdf.setFontSize(12);
      
      const details = formatTestDetails(test);
      const lines = pdf.splitTextToSize(details, pageWidth - 80);
      
      let yPos = 70;
      lines.forEach(line => {
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 40;
        }
        pdf.text(line, 40, yPos);
        yPos += 20;
      });
    });

    pdf.save('performance-dashboard.pdf');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  } finally {
    cleanupAfterExport();
  }
}