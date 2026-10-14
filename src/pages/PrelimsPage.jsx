/**
 * PrelimsPage.jsx
 *
 * Dedicated editor for optional Preliminary Pages:
 *  - Acknowledgement (enable/disable, heading, content)
 *  - Abstract (enable/disable, heading, content)
 *
 * Preserved independently of main report sections and cover templates.
 */
import { useReport } from '../context/ReportContext.jsx';

export default function PrelimsPage() {
  const { report, updateAcknowledgement, updateAbstract } = useReport();

  const ack = report?.acknowledgement || {
    enabled: true,
    heading: 'Acknowledgement',
    content: '',
  };

  const abs = report?.abstract || {
    enabled: true,
    heading: 'Abstract',
    content: '',
  };

  function countWords(str) {
    if (!str) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  return (
    <div className="prelims-page">
      <h1 className="page-title">📑 Preliminary Pages</h1>
      <p className="page-subtitle">
        Configure optional Acknowledgement and Abstract preliminary pages. When enabled, each
        starts on a fresh page directly following the cover sheet and is indexed in the Table of Contents.
      </p>

      {/* ── Acknowledgement Card ── */}
      <div className="card" id="card-acknowledgement">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="card-title" style={{ margin: 0 }}>
            <span className="card-icon">🤝</span> Acknowledgement
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`badge ${ack.enabled ? 'badge-success' : ''}`} style={!ack.enabled ? { background: 'var(--c-surface-3)', color: 'var(--c-text-muted)' } : {}}>
              {ack.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                margin: 0,
                textTransform: 'none',
                fontWeight: 600,
                color: 'var(--c-text)',
                fontSize: '.85rem',
              }}
            >
              <input
                id="checkbox-enable-acknowledgement"
                type="checkbox"
                checked={!!ack.enabled}
                onChange={(e) => updateAcknowledgement({ enabled: e.target.checked })}
              />
              Include in Report
            </label>
          </div>
        </div>

        {ack.enabled ? (
          <div>
            <div className="form-group">
              <label htmlFor="ack-heading">Page Heading</label>
              <input
                id="ack-heading"
                type="text"
                placeholder="e.g. Acknowledgement"
                value={ack.heading || ''}
                onChange={(e) => updateAcknowledgement({ heading: e.target.value })}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label htmlFor="ack-content" style={{ margin: 0 }}>Content</label>
                <span style={{ fontSize: '.75rem', color: 'var(--c-text-muted)' }}>
                  {countWords(ack.content)} words · {ack.content ? ack.content.split('\n').filter(Boolean).length : 0} paragraphs
                </span>
              </div>
              <textarea
                id="ack-content"
                rows={10}
                placeholder="Write your acknowledgement here. Separate paragraphs with a blank line..."
                value={ack.content || ''}
                onChange={(e) => updateAcknowledgement({ content: e.target.value })}
                style={{ resize: 'vertical', lineHeight: '1.6' }}
              />
              <span style={{ fontSize: '.75rem', color: 'var(--c-text-dim)', marginTop: '4px' }}>
                Tip: Express gratitude to your guides, department heads, institution, and contributors. Content will automatically flow across multiple pages if required.
              </span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px', background: 'var(--c-surface-2)', borderRadius: 'var(--r-sm)', color: 'var(--c-text-muted)', fontSize: '.85rem' }}>
            Acknowledgement page is currently <strong>disabled</strong>. It will be completely omitted from the generated PDF and Table of Contents without leaving any blank pages.
          </div>
        )}
      </div>

      {/* ── Abstract Card ── */}
      <div className="card" id="card-abstract" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="card-title" style={{ margin: 0 }}>
            <span className="card-icon">📄</span> Abstract
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`badge ${abs.enabled ? 'badge-success' : ''}`} style={!abs.enabled ? { background: 'var(--c-surface-3)', color: 'var(--c-text-muted)' } : {}}>
              {abs.enabled ? 'Enabled' : 'Disabled'}
            </span>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                margin: 0,
                textTransform: 'none',
                fontWeight: 600,
                color: 'var(--c-text)',
                fontSize: '.85rem',
              }}
            >
              <input
                id="checkbox-enable-abstract"
                type="checkbox"
                checked={!!abs.enabled}
                onChange={(e) => updateAbstract({ enabled: e.target.checked })}
              />
              Include in Report
            </label>
          </div>
        </div>

        {abs.enabled ? (
          <div>
            <div className="form-group">
              <label htmlFor="abs-heading">Page Heading</label>
              <input
                id="abs-heading"
                type="text"
                placeholder="e.g. Abstract"
                value={abs.heading || ''}
                onChange={(e) => updateAbstract({ heading: e.target.value })}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label htmlFor="abs-content" style={{ margin: 0 }}>Content</label>
                <span style={{ fontSize: '.75rem', color: 'var(--c-text-muted)' }}>
                  {countWords(abs.content)} words · {abs.content ? abs.content.split('\n').filter(Boolean).length : 0} paragraphs
                </span>
              </div>
              <textarea
                id="abs-content"
                rows={10}
                placeholder="Write your executive summary or project abstract here..."
                value={abs.content || ''}
                onChange={(e) => updateAbstract({ content: e.target.value })}
                style={{ resize: 'vertical', lineHeight: '1.6' }}
              />
              <span style={{ fontSize: '.75rem', color: 'var(--c-text-dim)', marginTop: '4px' }}>
                Tip: Provide a concise summary of the problem, proposed solution, methodology, and key results. Long abstracts will automatically flow across pages.
              </span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px', background: 'var(--c-surface-2)', borderRadius: 'var(--r-sm)', color: 'var(--c-text-muted)', fontSize: '.85rem' }}>
            Abstract page is currently <strong>disabled</strong>. It will be completely omitted from the generated PDF and Table of Contents without leaving any blank pages.
          </div>
        )}
      </div>
    </div>
  );
}
