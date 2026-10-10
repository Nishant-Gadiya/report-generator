/**
 * GeneratePage.jsx
 * Final step: generate PDF via Paged.js print window.
 */
import { useReport } from '../context/ReportContext.jsx';
import { openPrintWindow } from '../pdf/generatePdf.js';

export default function GeneratePage() {
  const { report } = useReport();
  const fs = report.frontSheet;
  const filledStudents = fs.students.filter((s) => s.name || s.usn);
  const totalSections = report.sections.length;

  function handleGenerate() {
    openPrintWindow(report);
  }

  return (
    <div>
      <h1 className="page-title">🖨️ Generate PDF</h1>
      <p className="page-subtitle">
        Opens a print-ready window. Use your browser&apos;s <strong>Print → Save as PDF</strong> with{' '}
        <strong>Background graphics</strong> enabled.
      </p>

      {/* Summary card */}
      <div className="card" style={{ marginBottom: 'var(--sp-lg)' }}>
        <div className="card-title"><span className="card-icon">📊</span> Report Summary</div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 'var(--sp-md)',
          }}
        >
          <StatCard label="Sections" value={totalSections} icon="📄" />
          <StatCard label="Students" value={filledStudents.length} icon="🎓" />
          <StatCard label="Guides" value={fs.guides.length} icon="👩‍🏫" />
          <StatCard
            label="Template"
            value={report.settings.template === 'modern' ? 'Modern Blue' : 'Classic'}
            icon="🎨"
          />
        </div>
      </div>

      {/* Report details */}
      <div className="card" style={{ marginBottom: 'var(--sp-lg)' }}>
        <div className="card-title"><span className="card-icon">📋</span> Details</div>
        <table style={{ width: '100%', fontSize: '.875rem', borderCollapse: 'collapse' }}>
          <tbody>
            {[
              ['College', fs.collegeName],
              ['Academic Year', fs.academicYear],
              ['Department', fs.departmentName],
              ['Course', fs.courseName],
              ['Semester', fs.semester],
              ['Project Title', fs.projectTitle],
              ['Font Size', `${report.settings.fontSize}pt`],
              ['Line Spacing', `${report.settings.lineSpacing}×`],
              ['Margins (T/B/L/R)', `${report.settings.marginTop}/${report.settings.marginBottom}/${report.settings.marginLeft}/${report.settings.marginRight} mm`],
            ].map(([key, val]) => (
              <tr key={key} style={{ borderBottom: '1px solid var(--c-border)' }}>
                <td style={{ padding: '6px 8px', color: 'var(--c-text-muted)', width: '180px', fontWeight: 600 }}>{key}</td>
                <td style={{ padding: '6px 8px', color: 'var(--c-text)' }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Generate button */}
      <div className="generate-btn-wrap">
        <button
          id="btn-generate-pdf"
          className="generate-btn"
          onClick={handleGenerate}
        >
          🖨️ Open Print Window
        </button>

        <div className="info-box" style={{ maxWidth: '520px', textAlign: 'left' }}>
          <strong>How to save as PDF:</strong>
          <ol style={{ paddingLeft: '18px', marginTop: '8px', lineHeight: '1.8' }}>
            <li>Wait for Paged.js to finish paginating (the page will settle).</li>
            <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>⌘+P</strong> (Mac).</li>
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
    <div
      style={{
        background: 'var(--c-surface-2)',
        border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-md)',
        padding: 'var(--sp-md)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--c-text)' }}>{value}</div>
      <div style={{ fontSize: '.75rem', color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
        {label}
      </div>
    </div>
  );
}
