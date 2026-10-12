import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_REPORT } from '../src/data/defaultReport.js';
import { buildPrintDocument } from '../src/pdf/printTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test report with sample students matching user test case
const testReport = {
  ...DEFAULT_REPORT,
  frontSheet: {
    ...DEFAULT_REPORT.frontSheet,
    students: [
      { name: 'Aditya Kumar', usn: '1JS21CS001' },
      { name: 'Ananya Sharma', usn: '1JS21CS015' },
      { name: 'Rohan Verma', usn: '1JS21CS089' },
    ],
  },
};

const html = buildPrintDocument(testReport, 'classic', '/college-logo.jpg');
const outputPath = path.resolve(__dirname, '../public/print-preview.html');
fs.writeFileSync(outputPath, html, 'utf-8');
console.log('Successfully wrote preview HTML to:', outputPath);
