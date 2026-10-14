/**
 * GeneratePage.jsx
 * Final step: generate PDF via Paged.js print window.
 */
import { useReport } from '../context/ReportContext.jsx';
import { openPrintWindow } from '../pdf/generatePdf.js';

export default function GeneratePage() {
  const { report } = useReport();
  const fs             = report.frontSheet;
  const filledStudents = fs.students.filter((s) => s.name || s.usn);
  const totalSections  = report.sections.length;

  function handleGenerate() {
    openPrintWindow(report);
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Generate PDF</h1>
        <p className="page-subtitle">
          Opens a print-ready window. Use your browser&apos;s{' '}
          <strong>Print → Save as PDF</strong> with <strong>Background graphics</strong> enabled.
        </p>
      </div>

      {/* Summary */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📊</span> Report Summary</div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 'var(--sp-md)',
          }}
        >
          <StatCard label="Sections"  value={totalSections}         icon="📄" />
          <StatCard label="Students"  value={filledStudents.length} icon="🎓" />
          <StatCard label="Guides"    value={fs.guides.length}      icon="👩‍🏫" />
          <StatCard
            label="Template"
            value={report.settings.template === 'modern' ? 'Modern Blue' : 'Classic'}
            icon="🎨"
          />
        </div>
      </div>

      {/* Report details */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📋</span> Details</div>
        <table style={{ width: '100%', fontSize: '.8125rem', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['College',          fs.collegeName],
              ['Academic Year',    fs.academicYear],
              ['Department',       fs.departmentName],
              ['Course',           fs.courseName],
              ['Semester',         fs.semester],
              ['Project Title',    fs.projectTitle],
              ['Font Size',        `${report.settings.fontSize} pt`],
              ['Line Spacing',     `${report.settings.lineSpacing}×`],
              ['Margins (T/B/L/R)', `${report.settings.marginTop} / ${report.settings.marginBottom} / ${report.settings.marginLeft} / ${report.settings.marginRight} mm`],
            ].map(([key, val]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--c-border-light)' }}>
                <td style={{ padding: '6px 8px', color: 'var(--c-text-muted)', width: '180px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {key}
                </td>
                <td style={{ padding: '6px 8px', color: 'var(--c-text)' }}>{val || <em style={{ color: 'var(--c-text-dim)' }}>—</em>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate button + instructions */}
      <div className="generate-btn-wrap">
        <button
          id="btn-generate-pdf"
          className="generate-btn"
          onClick={handleGenerate}
        >
          🖨️ Open Print Window
        </button>

        <div className="info-box" style={{ maxWidth: '520px', textAlign: 'left' }}>
          <strong>How to save as PDF</strong>
          <ol style={{ paddingLeft: '18px', marginTop: '8px', lineHeight: '1.85' }}>
            <li>Wait for Paged.js to finish paginating (the page will settle).</li>
            <li>Press <strong>Ctrl + P</strong> (Windows) or <strong>⌘ + P</strong> (Mac).</li>
            <li>Set <em>Destination</em> to <strong>Save as PDF</strong>.</li>
            <li>Enable <strong>Background graphics</strong> in More Settings.</li>
            <li>Set Paper size to <strong>A4</strong>, Margins to <strong>None</strong>.</li>
            <li>Click <strong>Save</strong>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" aria-hidden="true">{icon}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
