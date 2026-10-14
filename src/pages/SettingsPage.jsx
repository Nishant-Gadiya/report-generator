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
    name: 'Bangalore Institute of Technology (BIT)',
    desc: 'Minor-project synopsis cover sheet with project group, details, and office evaluation tables.',
  },
];

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional black & white academic style with serif headings.',
    preview: <ClassicPreview />,
  },
  {
    id: 'modern',
    name: 'Modern Blue',
    desc: 'Contemporary design with indigo accent headings and borders.',
    preview: <ModernPreview />,
  },
];

export default function SettingsPage() {
  const {
    report,
    updateSettings,
    updateAcknowledgement,
    updateAbstract,
    updateReferences,
  } = useReport();
  const s = report.settings;
  const ack = report.acknowledgement;
  const abs = report.abstract;
  const refs = report.references;

  function set(field, value) {
    updateSettings({ [field]: value });
  }

  return (
    <div>
      <h1 className="page-title">⚙️ Settings & Templates</h1>
      <p className="page-subtitle">
        Choose a template and configure typography and page margins.
      </p>

      {/* ── Cover Sheet Template Selection ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📑</span> Cover Sheet Template</div>
        <div className="template-grid">
          {COVER_TEMPLATES.map((tmpl) => {
            const isSelected = (s.coverTemplate || 'jssateb') === tmpl.id;
            return (
              <div
                key={tmpl.id}
                id={`cover-template-card-${tmpl.id}`}
                className={`template-card ${isSelected ? 'selected' : ''}`}
                onClick={() => set('coverTemplate', tmpl.id)}
                role="button"
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && set('coverTemplate', tmpl.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="template-info" style={{ padding: '16px' }}>
                  <div className="template-name">
                    {tmpl.name}
                    {isSelected && (
                      <span className="badge badge-success" style={{ marginLeft: '8px' }}>Selected</span>
                    )}
                  </div>
                  <div className="template-desc">{tmpl.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Template Selection ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🎨</span> Report Template</div>
        <div className="template-grid">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              id={`template-card-${tmpl.id}`}
              className={`template-card ${s.template === tmpl.id ? 'selected' : ''}`}
              onClick={() => set('template', tmpl.id)}
              role="button"
              aria-pressed={s.template === tmpl.id}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && set('template', tmpl.id)}
            >
              <div className="template-preview">{tmpl.preview}</div>
              <div className="template-info">
                <div className="template-name">
                  {tmpl.name}
                  {s.template === tmpl.id && (
                    <span className="badge badge-success" style={{ marginLeft: '8px' }}>Selected</span>
                  )}
                </div>
                <div className="template-desc">{tmpl.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Typography ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🔤</span> Typography</div>
        <div className="form-row">
          <div className="form-group">
            <label>Body Font Size (pt)</label>
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
            <label>Line Spacing</label>
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
            <label>Top</label>
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
            <label>Bottom</label>
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
            <label>Left (binding side)</label>
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
            <label>Right</label>
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
        <div className="card-title"><span className="card-icon">📑</span> Report Options</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textTransform: 'none',
              fontSize: '.9rem',
              fontWeight: '500',
              color: 'var(--c-text)',
            }}
          >
            <input
              id="settings-show-toc"
              type="checkbox"
              checked={s.showTableOfContents}
              onChange={(e) => set('showTableOfContents', e.target.checked)}
            />
            Include Table of Contents
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textTransform: 'none',
              fontSize: '.9rem',
              fontWeight: '500',
              color: 'var(--c-text)',
            }}
          >
            <input
              id="settings-show-acknowledgement"
              type="checkbox"
              checked={!!ack?.enabled}
              onChange={(e) => updateAcknowledgement({ enabled: e.target.checked })}
            />
            Include Acknowledgement Page
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textTransform: 'none',
              fontSize: '.9rem',
              fontWeight: '500',
              color: 'var(--c-text)',
            }}
          >
            <input
              id="settings-show-abstract"
              type="checkbox"
              checked={!!abs?.enabled}
              onChange={(e) => updateAbstract({ enabled: e.target.checked })}
            />
            Include Abstract Page
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textTransform: 'none',
              fontSize: '.9rem',
              fontWeight: '500',
              color: 'var(--c-text)',
            }}
          >
            <input
              id="settings-show-references"
              type="checkbox"
              checked={!!refs?.enabled}
              onChange={(e) => updateReferences({ enabled: e.target.checked })}
            />
            Include References Section
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              textTransform: 'none',
              fontSize: '.9rem',
              fontWeight: '500',
              color: 'var(--c-text)',
            }}
          >
            <input
              id="settings-show-lof"
              type="checkbox"
              checked={s.showListOfFigures}
              onChange={(e) => set('showListOfFigures', e.target.checked)}
            />
            Include List of Figures
          </label>
        </div>
      </div>
    </div>
  );
}

/* ── Template preview miniatures ─────────────────────────────────── */
function ClassicPreview() {
  return (
    <div className="mini-page">
      <div className="mini-header-bar" style={{ background: '#000', height: '8px', borderRadius: '1px' }} />
      <div className="mini-title" style={{ background: '#111', height: '5px', width: '75%', margin: '3px auto' }} />
      <div className="mini-line" style={{ height: '3px', background: '#aaa', width: '90%', marginTop: '5px' }} />
      <div className="mini-line" style={{ height: '3px', background: '#ccc', width: '80%' }} />
      <div className="mini-line" style={{ height: '3px', background: '#ccc', width: '85%' }} />
      <div style={{ marginTop: '5px', borderTop: '1px solid #999', paddingTop: '3px' }}>
        <div className="mini-title" style={{ background: '#333', height: '4px', width: '50%', margin: '2px 0' }} />
        <div className="mini-line" style={{ height: '3px', background: '#ddd', width: '100%' }} />
        <div className="mini-line" style={{ height: '3px', background: '#ddd', width: '90%' }} />
        <div className="mini-line" style={{ height: '3px', background: '#ddd', width: '95%' }} />
        <div className="mini-line" style={{ height: '3px', background: '#ddd', width: '70%' }} />
      </div>
    </div>
  );
}

function ModernPreview() {
  return (
    <div className="mini-page">
      <div style={{ width: '100%', height: '6px', background: 'linear-gradient(90deg,#1a56db,#a78bfa)', borderRadius: '1px', marginBottom: '3px' }} />
      <div className="mini-title" style={{ background: '#1a56db', height: '5px', width: '75%', margin: '2px 0' }} />
      <div className="mini-line" style={{ height: '3px', background: '#e0e4f8', width: '90%', marginTop: '4px' }} />
      <div className="mini-line" style={{ height: '3px', background: '#e0e4f8', width: '80%' }} />
      <div className="mini-line" style={{ height: '3px', background: '#e0e4f8', width: '85%' }} />
      <div style={{ marginTop: '5px', borderLeft: '2px solid #1a56db', paddingLeft: '3px' }}>
        <div className="mini-title" style={{ background: '#1a56db', height: '4px', width: '55%', margin: '2px 0' }} />
        <div className="mini-line" style={{ height: '3px', background: '#e0e4f8', width: '100%' }} />
        <div className="mini-line" style={{ height: '3px', background: '#e0e4f8', width: '90%' }} />
        <div className="mini-line" style={{ height: '3px', background: '#e0e4f8', width: '70%' }} />
      </div>
    </div>
  );
}
