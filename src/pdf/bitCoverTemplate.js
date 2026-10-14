/**
 * bitCoverTemplate.js
 *
 * Bangalore Institute of Technology (BIT) Minor-Project Synopsis Cover Sheet Template.
 * Fully separated from the default JSSATEB template.
 */

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render the BIT Cover Sheet HTML.
 * @param {object} frontSheet - Front sheet data object
 * @param {string} [bitLogoUrl] - Path/URL to the BIT logo image
 * @returns {string} HTML string for the front-sheet section
 */
export function renderBitCoverSheet(frontSheet, bitLogoUrl = '') {
  const collegeName = frontSheet.collegeName || 'BANGALORE INSTITUTE OF TECHNOLOGY';
  const affiliation =
    frontSheet.affiliation || 'An Autonomous Institution affiliated to VTU, Belagavi';
  const address = frontSheet.address || 'K.R. Road, V.V.Pura, Bengaluru-560 004';
  const department =
    frontSheet.departmentName || 'DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING';
  const synopsisTitle =
    frontSheet.synopsisTitle || frontSheet.reportType || 'Minor-Project Synopsis (BCS586)';
  const semester = frontSheet.semester || 'V – Sem';
  const academicYear = frontSheet.academicYear || '2026-2027 (ODD)';
  const projectTitle =
    frontSheet.projectTitle ||
    'QueueLess – A Smart Digital Queue & Appointment Management Platform';
  const domain =
    frontSheet.domain || 'Web Application Development & Real-Time Systems';
  const groupId = frontSheet.groupId || '';
  const guideName =
    (Array.isArray(frontSheet.guides) && frontSheet.guides[0]?.name) ||
    frontSheet.guideName ||
    '';
  const coordinatorTitle =
    frontSheet.coordinatorTitle || 'Signature of the Mini Project Co-ordinator';

  // Render project group members (at least 4 rows as in the reference)
  const rawStudents = Array.isArray(frontSheet.students) ? [...frontSheet.students] : [];
  while (rawStudents.length < 4) {
    rawStudents.push({ name: '', usn: '', section: '', email: '', phone: '' });
  }

  const studentRows = rawStudents
    .map(
      (s, idx) => `
    <tr>
      <td class="bit-col-sl">${idx + 1}</td>
      <td class="bit-col-usn">${escHtml(s.usn) || '&nbsp;'}</td>
      <td class="bit-col-name">${escHtml(s.name) || '&nbsp;'}</td>
      <td class="bit-col-sec">${escHtml(s.section) || '&nbsp;'}</td>
      <td class="bit-col-email">${escHtml(s.email) || '&nbsp;'}</td>
      <td class="bit-col-phone">${escHtml(s.phone) || '&nbsp;'}</td>
      <td class="bit-col-sig">&nbsp;</td>
    </tr>`
    )
    .join('');

  return `
<section class="front-sheet bit-cover" role="region" aria-label="BIT Front Sheet">
  <div class="bit-inner">
    ${bitLogoUrl ? `<div class="bit-logo-wrap"><img src="${bitLogoUrl}" alt="BIT Logo" class="bit-logo" /></div>` : ''}

    <div class="bit-header">
      <div class="bit-college-name">${escHtml(collegeName)}</div>
      <div class="bit-college-sub">${escHtml(affiliation)}</div>
      <div class="bit-college-sub">${escHtml(address)}</div>
      <div class="bit-department">${escHtml(department)}</div>
      <div class="bit-synopsis-title">${escHtml(synopsisTitle)}</div>
      <div class="bit-sem">${escHtml(semester)}</div>
      <div class="bit-academic-year">${escHtml(academicYear)}</div>
    </div>

    <!-- Section 1: Project Group -->
    <div class="bit-section">
      <div class="bit-section-title bit-center">PROJECT GROUP</div>
      <table class="bit-table bit-group-table">
        <thead>
          <tr>
            <th style="width: 7%;">Sl. No.</th>
            <th style="width: 14%;">USN</th>
            <th style="width: 21%;">Name</th>
            <th style="width: 8%;">Sec.</th>
            <th style="width: 22%;">Email-Id</th>
            <th style="width: 14%;">Phone No.</th>
            <th style="width: 14%;">Signature</th>
          </tr>
        </thead>
        <tbody>
          ${studentRows}
        </tbody>
      </table>
    </div>

    <!-- Section 2: Minor-Project Details -->
    <div class="bit-section">
      <div class="bit-section-title">MINOR-PROJECT DETAILS:</div>
      <table class="bit-table bit-details-table">
        <tbody>
          <tr>
            <td class="bit-label-cell">Title:</td>
            <td class="bit-content-cell">${escHtml(projectTitle)}</td>
          </tr>
          <tr>
            <td class="bit-label-cell">Domain:</td>
            <td class="bit-content-cell">${escHtml(domain)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 3: Office Use -->
    <div class="bit-section">
      <div class="bit-section-subtitle"><u>For office use only:</u></div>
      <table class="bit-table bit-office-table">
        <tbody>
          <tr>
            <td class="bit-office-label">Group ID:</td>
            <td class="bit-office-content">${escHtml(groupId)}</td>
          </tr>
          <tr>
            <td class="bit-office-label">Guide:</td>
            <td class="bit-office-content">${escHtml(guideName)}</td>
          </tr>
          <tr>
            <td class="bit-office-label">Status:</td>
            <td class="bit-office-content">Accepted / To be modified / Rejected</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Coordinator Signature -->
    <div class="bit-coordinator-wrap">
      <div class="bit-coordinator-title">${escHtml(coordinatorTitle)}</div>
    </div>
  </div>
</section>
`;
}

/**
 * CSS styles for the BIT Cover Sheet Template.
 */
export const bitCoverSheetCss = `
/* ════════════════════════════════════════════════════════
   BIT Cover Sheet Layout
   ════════════════════════════════════════════════════════ */
.front-sheet.bit-cover {
  page: frontpage;
  page-break-after: always;
  break-after: page;
  width: 210mm;
  height: 297mm;
  padding: 12mm 14mm;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
  color: #000;
  background: #fff;
}

.front-sheet.bit-cover .bit-inner {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.front-sheet.bit-cover .bit-logo-wrap {
  text-align: center;
  margin-bottom: 3mm;
}

.front-sheet.bit-cover .bit-logo {
  height: 21mm;
  width: auto;
  object-fit: contain;
}

.front-sheet.bit-cover .bit-header {
  text-align: center;
  margin-bottom: 4.5mm;
  line-height: 1.4;
}

.front-sheet.bit-cover .bit-college-name {
  font-size: 13.5pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 1.5mm;
}

.front-sheet.bit-cover .bit-college-sub {
  font-size: 9pt;
  font-weight: normal;
  color: #222;
  margin-bottom: 1mm;
}

.front-sheet.bit-cover .bit-department {
  font-size: 10.5pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-top: 2mm;
  margin-bottom: 2mm;
}

.front-sheet.bit-cover .bit-synopsis-title {
  font-size: 11pt;
  font-weight: bold;
  margin-bottom: 1mm;
}

.front-sheet.bit-cover .bit-sem {
  font-size: 10.5pt;
  font-weight: bold;
  margin-bottom: 1mm;
}

.front-sheet.bit-cover .bit-academic-year {
  font-size: 10.5pt;
  font-weight: bold;
}

.front-sheet.bit-cover .bit-section {
  margin-bottom: 4.5mm;
}

.front-sheet.bit-cover .bit-section-title {
  font-size: 10pt;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 2mm;
}

.front-sheet.bit-cover .bit-section-subtitle {
  font-size: 9.5pt;
  font-weight: bold;
  margin-bottom: 2mm;
}

.front-sheet.bit-cover .bit-center {
  text-align: center;
}

.front-sheet.bit-cover .bit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;
}

.front-sheet.bit-cover .bit-table th,
.front-sheet.bit-cover .bit-table td {
  border: 1px solid #000;
  padding: 2.2mm 2.2mm;
  line-height: 1.35;
  vertical-align: middle;
}

.front-sheet.bit-cover .bit-group-table th {
  background-color: #dbeafe;
  font-weight: bold;
  text-align: center;
  font-size: 8.5pt;
}

.front-sheet.bit-cover .bit-group-table td {
  height: 6.2mm;
}

.front-sheet.bit-cover .bit-col-sl { text-align: center; }
.front-sheet.bit-cover .bit-col-usn { text-align: center; font-weight: 500; }
.front-sheet.bit-cover .bit-col-name { text-align: left; }
.front-sheet.bit-cover .bit-col-sec { text-align: center; }
.front-sheet.bit-cover .bit-col-email { text-align: left; font-size: 8.5pt; }
.front-sheet.bit-cover .bit-col-phone { text-align: center; font-size: 8.5pt; }
.front-sheet.bit-cover .bit-col-sig { text-align: center; }

.front-sheet.bit-cover .bit-details-table .bit-label-cell {
  background-color: #dbeafe;
  font-weight: bold;
  width: 18%;
  vertical-align: middle;
}

.front-sheet.bit-cover .bit-details-table .bit-content-cell {
  width: 82%;
  font-weight: normal;
}

.front-sheet.bit-cover .bit-office-table .bit-office-label {
  background-color: #edf5ed;
  font-weight: bold;
  width: 18%;
  vertical-align: middle;
}

.front-sheet.bit-cover .bit-office-table .bit-office-content {
  width: 82%;
}

.front-sheet.bit-cover .bit-coordinator-wrap {
  margin-top: 10mm;
  margin-bottom: 0;
  text-align: right;
  padding-right: 2mm;
  padding-top: 0;
}

.front-sheet.bit-cover .bit-coordinator-title {
  font-size: 10pt;
  font-weight: bold;
}
`;
