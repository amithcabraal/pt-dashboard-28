import pptxgen from 'pptxgenjs';
import { PerformanceTest } from '../types';
import { prepareForExport, cleanupAfterExport } from './export';
import { captureScreenshot } from './screenshot';
import { formatTestDetails, getStatusColor } from './formatTestDetails';

export async function exportToPowerPoint(tests: PerformanceTest[]) {
  try {
    await prepareForExport();
    
    const pptx = new pptxgen();
    
    // Create title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText("Performance Test Dashboard", {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1,
      fontSize: 44,
      bold: true,
      color: "363636",
      align: "center"
    });

    // Add overview slide
    const canvas = await captureScreenshot();
    if (canvas) {
      const overviewSlide = pptx.addSlide();
      
      // Add title to overview slide
      overviewSlide.addText("Dashboard Overview", {
        x: 0.5,
        y: 0.25,
        w: 9,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: "363636"
      });

      // Calculate dimensions while maintaining aspect ratio
      const imgAspectRatio = canvas.width / canvas.height;
      let finalWidth = 9;
      let finalHeight = finalWidth / imgAspectRatio;
      
      if (finalHeight > 5) {
        finalHeight = 5;
        finalWidth = finalHeight * imgAspectRatio;
      }

      // Center the image on the slide
      const xOffset = (10 - finalWidth) / 2;
      
      overviewSlide.addImage({
        data: canvas.toDataURL('image/png'),
        x: xOffset,
        y: 1,
        w: finalWidth,
        h: finalHeight
      });
    }

    // Add detail slides for each test
    tests.forEach((test, index) => {
      const slide = pptx.addSlide();
      
      // Add test title
      slide.addText(`${test.reference} - ${test.name}`, {
        x: 0.5,
        y: 0.25,
        w: 9,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: getStatusColor(test.status)
      });

      // Add status indicator
      slide.addText(`Status: ${test.status.toUpperCase()}`, {
        x: 0.5,
        y: 1,
        w: 9,
        h: 0.3,
        fontSize: 16,
        color: getStatusColor(test.status)
      });

      // Add preparation progress
      const prepData = [
        ['Component', 'Progress'],
        ['Data', `${test.preparation.data}%`],
        ['Script', `${test.preparation.script}%`],
        ['Environment', `${test.preparation.env}%`]
      ];

      slide.addTable(prepData, {
        x: 0.5,
        y: 1.5,
        w: 4,
        fontSize: 14,
        border: { pt: 1, color: '363636' }
      });

      // Add execution metrics
      const execData = [
        ['Metric', 'Value'],
        ['Target TPS', test.execution.targetTps.toString()],
        ['Achieved TPS', test.execution.achievedTps.toString()],
        ['Achievement Rate', `${(test.execution.achievedTps / test.execution.targetTps * 100).toFixed(1)}%`]
      ];

      slide.addTable(execData, {
        x: 5.5,
        y: 1.5,
        w: 4,
        fontSize: 14,
        border: { pt: 1, color: '363636' }
      });

      // Add notes if present
      if (test.note) {
        slide.addText('Notes:', {
          x: 0.5,
          y: 3.5,
          w: 9,
          h: 0.3,
          fontSize: 16,
          bold: true
        });

        slide.addText(test.note, {
          x: 0.5,
          y: 4,
          w: 9,
          h: 1,
          fontSize: 14,
          color: '363636'
        });
      }

      // Add test runs if present
      if (test.testRuns.length > 0) {
        const runSlide = pptx.addSlide();
        
        runSlide.addText(`${test.reference} - Test Runs`, {
          x: 0.5,
          y: 0.25,
          w: 9,
          h: 0.5,
          fontSize: 24,
          bold: true,
          color: '363636'
        });

        test.testRuns.forEach((run, runIndex) => {
          const yPos = 1 + (runIndex * 1.5);
          
          runSlide.addText(`Run #${runIndex + 1}`, {
            x: 0.5,
            y: yPos,
            w: 9,
            h: 0.3,
            fontSize: 16,
            bold: true
          });

          const runDetails = [
            ['Start Time', new Date(run.startTime).toLocaleString()],
            ['End Time', new Date(run.endTime).toLocaleString()],
            ['AppDynamics', run.appDynamicsUrl],
            ['LoadRunner', run.loadRunnerUrl]
          ];

          if (run.notes) {
            runDetails.push(['Notes', run.notes]);
          }

          runSlide.addTable(runDetails, {
            x: 0.5,
            y: yPos + 0.4,
            w: 9,
            fontSize: 12,
            border: { pt: 1, color: '363636' }
          });
        });
      }
    });

    await pptx.writeFile('performance-dashboard.pptx');
  } catch (error) {
    console.error('Error exporting to PowerPoint:', error);
  } finally {
    cleanupAfterExport();
  }
}