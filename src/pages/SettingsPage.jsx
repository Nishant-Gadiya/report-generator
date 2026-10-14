/**
 * SettingsPage.jsx
 * Template selection + typography / margin settings.
 */
import { useReport } from '../context/ReportContext.jsx';

const COVER_TEMPLATES = [
  {
    id: 'jssateb',
    name: 'JSSATEB (Default)',
    desc: 'Formal academic cover sheet with red headers, circular emblem, and 2-column student table.',
  },
  {
    id: 'bit',
    name: 'Bangalore Institute of Technology',
    desc: 'Minor-project synopsis cover sheet with project group, details, and office evaluation tables.',
  },
];

const REPORT_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional black & white academic style with serif headings.',
    preview: ClassicPreview,
  },
  {
    id: 'modern',
    name: 'Modern Blue',
    desc: 'Contemporary design with indigo accent headings and borders.',
    preview: ModernPreview,
  },
];

export default function SettingsPage() {
  const { report, updateSettings, updateAcknowledgement, updateAbstract, updateReferences } =
    useReport();
  const s    = report.settings;
  const ack  = report.acknowledgement;
  const abs  = report.abstract;
  const refs = report.references;

  function set(field, value) {
    updateSettings({ [field]: value });
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings &amp; Templates</h1>
        <p className="page-subtitle">
          Choose a cover sheet design, select a report template, and configure typography and page margins.
        </p>
      </div>

      {/* ── Cover Sheet Template ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📑</span> Cover Sheet Template</div>
        <div className="template-grid">
          {COVER_TEMPLATES.map((tmpl) => {
            const isSelected = (s.coverTemplate || 'jssateb') === tmpl.id;
            return (
              <div
                key={tmpl.id}
                id={`cover-template-card-${tmpl.id}`}
                className={`template-card${isSelected ? ' selected' : ''}`}
                onClick={() => set('coverTemplate', tmpl.id)}
                role="button"
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && set('coverTemplate', tmpl.id)}
              >
                <div className="template-info">
                  <div className="template-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {tmpl.name}
                    {isSelected && <span className="badge badge-success">Selected</span>}
                  </div>
                  <div className="template-desc" style={{ marginTop: '4px' }}>{tmpl.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Report Template ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🎨</span> Report Template</div>
        <div className="template-grid">
          {REPORT_TEMPLATES.map((tmpl) => {
            const isSelected = s.template === tmpl.id;
            const Preview    = tmpl.preview;
            return (
              <div
                key={tmpl.id}
                id={`template-card-${tmpl.id}`}
                className={`template-card${isSelected ? ' selected' : ''}`}
                onClick={() => set('template', tmpl.id)}
                role="button"
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && set('template', tmpl.id)}
              >
                <div className="template-preview">
                  <Preview />
                </div>
                <div className="template-info">
                  <div className="template-name" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {tmpl.name}
                    {isSelected && <span className="badge badge-success">Selected</span>}
                  </div>
                  <div className="template-desc" style={{ marginTop: '4px' }}>{tmpl.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Typography ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🔤</span> Typography</div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="settings-font-size">Body Font Size (pt)</label>
            <input
              id="settings-font-size"
              type="number"
              min={9}
              max={14}
              step={0.5}
              value={s.fontSize}
              onChange={(e) => set('fontSize', parseFloat(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="settings-line-spacing">Line Spacing</label>
            <select
              id="settings-line-spacing"
              value={s.lineSpacing}
              onChange={(e) => set('lineSpacing', parseFloat(e.target.value))}
            >
              <option value={1.0}>Single (1.0)</option>
              <option value={1.15}>1.15</option>
              <option value={1.5}>1.5 (default)</option>
              <option value={2.0}>Double (2.0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Page Margins ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📐</span> Page Margins (mm)</div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="settings-margin-top">Top</label>
            <input
              id="settings-margin-top"
              type="number"
              min={10}
              max={50}
              value={s.marginTop}
              onChange={(e) => set('marginTop', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="settings-margin-bottom">Bottom</label>
            <input
              id="settings-margin-bottom"
              type="number"
              min={10}
              max={50}
              value={s.marginBottom}
              onChange={(e) => set('marginBottom', parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="settings-margin-left">Left (binding side)</label>
            <input
              id="settings-margin-left"
              type="number"
              min={15}
              max={50}
              value={s.marginLeft}
              onChange={(e) => set('marginLeft', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="settings-margin-right">Right</label>
            <input
              id="settings-margin-right"
              type="number"
              min={10}
              max={40}
              value={s.marginRight}
              onChange={(e) => set('marginRight', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* ── Report Options ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📋</span> Report Options</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              id: 'settings-show-toc',
              label: 'Include Table of Contents',
              checked: s.showTableOfContents,
              onChange: (v) => set('showTableOfContents', v),
            },
            {
              id: 'settings-show-acknowledgement',
              label: 'Include Acknowledgement Page',
              checked: !!ack?.enabled,
              onChange: (v) => updateAcknowledgement({ enabled: v }),
            },
            {
              id: 'settings-show-abstract',
              label: 'Include Abstract Page',
              checked: !!abs?.enabled,
              onChange: (v) => updateAbstract({ enabled: v }),
            },
            {
              id: 'settings-show-references',
              label: 'Include References Section',
              checked: !!refs?.enabled,
              onChange: (v) => updateReferences({ enabled: v }),
            },
            {
              id: 'settings-show-lof',
              label: 'Include List of Figures',
              checked: s.showListOfFigures,
              onChange: (v) => set('showListOfFigures', v),
            },
          ].map(({ id, label, checked, onChange }) => (
            <label key={id} className="toggle-row" style={{ width: 'fit-content' }}>
              <input
                id={id}
                type="checkbox"
                checked={!!checked}
                onChange={(e) => onChange(e.target.checked)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Template preview miniatures ─────────────────────────────────────── */
function ClassicPreview() {
  return (
    <div className="mini-page">
      <div style={{ width: '100%', height: '7px', background: '#111', borderRadius: '1px' }} />
      <div className="mini-title" />
      <div className="mini-line" style={{ width: '90%', marginTop: '4px' }} />
      <div className="mini-line" style={{ width: '80%' }} />
      <div className="mini-line" style={{ width: '85%' }} />
      <div style={{ marginTop: '4px', borderTop: '1px solid #bbb', paddingTop: '3px' }}>
        <div className="mini-title" style={{ width: '48%', margin: '2px 0' }} />
        <div className="mini-line" style={{ width: '100%' }} />
        <div className="mini-line" style={{ width: '90%' }} />
        <div className="mini-line" style={{ width: '95%' }} />
        <div className="mini-line" style={{ width: '68%' }} />
      </div>
    </div>
  );
}

function ModernPreview() {
  return (
    <div className="mini-page">
      <div style={{ width: '100%', height: '6px', background: 'linear-gradient(90deg,#1a56db,#6366f1)', borderRadius: '1px', marginBottom: '3px' }} />
      <div className="mini-title" style={{ background: '#1a56db', width: '75%', margin: '2px 0' }} />
      <div className="mini-line" style={{ background: '#e0e4f8', width: '90%', marginTop: '4px' }} />
      <div className="mini-line" style={{ background: '#e0e4f8', width: '80%' }} />
      <div className="mini-line" style={{ background: '#e0e4f8', width: '85%' }} />
      <div style={{ marginTop: '4px', borderLeft: '2px solid #1a56db', paddingLeft: '3px' }}>
        <div className="mini-title" style={{ background: '#1a56db', width: '55%', margin: '2px 0' }} />
        <div className="mini-line" style={{ background: '#e0e4f8', width: '100%' }} />
        <div className="mini-line" style={{ background: '#e0e4f8', width: '90%' }} />
        <div className="mini-line" style={{ background: '#e0e4f8', width: '70%' }} />
      </div>
    </div>
  );
}
