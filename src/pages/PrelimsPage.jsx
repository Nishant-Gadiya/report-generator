/**
 * PrelimsPage.jsx
 * Editor for Acknowledgement and Abstract preliminary pages.
 */
import { useReport } from '../context/ReportContext.jsx';

export default function PrelimsPage() {
  const { report, updateAcknowledgement, updateAbstract } = useReport();

  const ack = report?.acknowledgement || { enabled: true, heading: 'Acknowledgement', content: '' };
  const abs = report?.abstract        || { enabled: true, heading: 'Abstract',         content: '' };

  function countWords(str) {
    if (!str) return 0;
    return str.trim().split(/\s+/).filter(Boolean).length;
  }

  function countParagraphs(str) {
    if (!str) return 0;
    return str.split('\n').filter((l) => l.trim()).length;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Acknowledgement &amp; Abstract</h1>
        <p className="page-subtitle">
          Configure optional preliminary pages. When enabled, each starts on a fresh page
          and is indexed in the Table of Contents.
        </p>
      </div>

      {/* ── Acknowledgement ── */}
      <PrelimCard
        id="card-acknowledgement"
        icon="🤝"
        title="Acknowledgement"
        enabled={!!ack.enabled}
        onToggle={(val) => updateAcknowledgement({ enabled: val })}
        checkboxId="checkbox-enable-acknowledgement"
      >
        {ack.enabled ? (
          <>
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                <label htmlFor="ack-content" style={{ margin: 0 }}>Content</label>
                <span className="word-count">
                  {countWords(ack.content)} words · {countParagraphs(ack.content)} paragraphs
                </span>
              </div>
              <textarea
                id="ack-content"
                rows={10}
                placeholder="Write your acknowledgement here. Separate paragraphs with a blank line."
                value={ack.content || ''}
                onChange={(e) => updateAcknowledgement({ content: e.target.value })}
                style={{ minHeight: '200px' }}
              />
              <p style={{ fontSize: '.75rem', color: 'var(--c-text-dim)', marginTop: '5px', lineHeight: 1.5 }}>
                Tip: Express gratitude to your guides, department heads, institution, and contributors.
                Long content will automatically flow across pages.
              </p>
            </div>
          </>
        ) : (
          <div className="disabled-panel">
            Acknowledgement page is <strong>disabled</strong> — it will be omitted from the PDF and Table of Contents.
          </div>
        )}
      </PrelimCard>

      {/* ── Abstract ── */}
      <PrelimCard
        id="card-abstract"
        icon="📄"
        title="Abstract"
        enabled={!!abs.enabled}
        onToggle={(val) => updateAbstract({ enabled: val })}
        checkboxId="checkbox-enable-abstract"
        style={{ marginTop: 'var(--sp-md)' }}
      >
        {abs.enabled ? (
          <>
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                <label htmlFor="abs-content" style={{ margin: 0 }}>Content</label>
                <span className="word-count">
                  {countWords(abs.content)} words · {countParagraphs(abs.content)} paragraphs
                </span>
              </div>
              <textarea
                id="abs-content"
                rows={10}
                placeholder="Write your executive summary or project abstract here."
                value={abs.content || ''}
                onChange={(e) => updateAbstract({ content: e.target.value })}
                style={{ minHeight: '200px' }}
              />
              <p style={{ fontSize: '.75rem', color: 'var(--c-text-dim)', marginTop: '5px', lineHeight: 1.5 }}>
                Tip: Provide a concise summary of the problem, proposed solution, methodology, and key results.
              </p>
            </div>
          </>
        ) : (
          <div className="disabled-panel">
            Abstract page is <strong>disabled</strong> — it will be omitted from the PDF and Table of Contents.
          </div>
        )}
      </PrelimCard>
    </div>
  );
}

/* ── Reusable card wrapper for prelim sections ───────────────────────── */
function PrelimCard({ id, icon, title, enabled, onToggle, checkboxId, children, style }) {
  return (
    <div className="card" id={id} style={style}>
      <div className="card-title" style={{ justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="card-icon">{icon}</span>
          {title}
          <span className={`badge ${enabled ? 'badge-success' : 'badge-neutral'}`}>
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
        </span>
        <label
          className="toggle-row"
          style={{ fontWeight: 500, fontSize: '.8125rem', marginBottom: 0 }}
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span>Include in report</span>
        </label>
      </div>
      {children}
    </div>
  );
}
