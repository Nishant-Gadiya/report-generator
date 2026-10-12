import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_REPORT } from '../src/data/defaultReport.js';
import { buildPrintDocument } from '../src/pdf/printTemplate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Case 1: 1 student
const report1 = {
  ...DEFAULT_REPORT,
  frontSheet: {
    ...DEFAULT_REPORT.frontSheet,
    students: [{ name: 'Aditya Kumar', usn: '1JS21CS001' }],
  },
};
fs.writeFileSync(
  path.resolve(__dirname, '../public/test-1-student.html'),
  buildPrintDocument(report1, 'classic', '/college-logo.jpg'),
  'utf-8'
);

// Case 2: 5 students + Long title
const report5 = {
  ...DEFAULT_REPORT,
  frontSheet: {
    ...DEFAULT_REPORT.frontSheet,
    projectTitle:
      'CINENOVA: AN INTELLIGENT REAL-TIME CLOUD-HOSTED AI TICKET BOOKING & CINEMA RECOMMENDER ECOSYSTEM',
    students: [
      { name: 'Aditya Kumar', usn: '1JS21CS001' },
      { name: 'Ananya Sharma', usn: '1JS21CS015' },
      { name: 'Rohan Verma', usn: '1JS21CS089' },
      { name: 'Pooja Hegde', usn: '1JS21CS102' },
      { name: 'Siddharth Rao', usn: '1JS21CS114' },
    ],
  },
};
fs.writeFileSync(
  path.resolve(__dirname, '../public/test-5-students-long-title.html'),
  buildPrintDocument(report5, 'classic', '/college-logo.jpg'),
  'utf-8'
);

console.log('Generated test-1-student.html and test-5-students-long-title.html successfully.');
