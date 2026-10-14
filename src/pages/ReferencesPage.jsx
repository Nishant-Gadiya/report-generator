/**
 * ReferencesPage.jsx
 * Editor for the optional References section.
 * Supports types: Book, Research Paper / Journal, Website.
 */
import { useState } from 'react';
import { useReport } from '../context/ReportContext.jsx';
import { formatReferenceHtml } from '../pdf/printTemplate.js';

const REF_TYPES = [
  { id: 'book',    label: 'Book' },
  { id: 'paper',   label: 'Research Paper / Journal' },
  { id: 'website', label: 'Website' },
];

export default function ReferencesPage() {
  const {
    report,
    updateReferences,
    addReference,
    updateReferenceItem,
    deleteReferenceItem,
    moveReferenceItemUp,
    moveReferenceItemDown,
  } = useReport();

  const [defaultAddType, setDefaultAddType] = useState('book');

  const refs  = report?.references || { enabled: true, heading: 'References', items: [] };
  const items = Array.isArray(refs.items) ? refs.items : [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">References &amp; Bibliography</h1>
        <p className="page-subtitle">
          Manage citations. When enabled, References appear on a dedicated page at the end
          of the report and are indexed in the Table of Contents.
        </p>
      </div>

      {/* Configuration card */}
      <div className="card" id="card-references-settings">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="card-icon">⚙️</span> Configuration
            <span className={`badge ${refs.enabled ? 'badge-success' : 'badge-neutral'}`}>
              {refs.enabled ? `${items.length} entr${items.length === 1 ? 'y' : 'ies'}` : 'Disabled'}
            </span>
          </span>
          <label className="toggle-row" style={{ fontWeight: 500, fontSize: '.8125rem', marginBottom: 0 }}>
            <input
              id="checkbox-enable-references"
              type="checkbox"
              checked={!!refs.enabled}
              onChange={(e) => updateReferences({ enabled: e.target.checked })}
            />
            <span>Include in report</span>
          </label>
        </div>

        {refs.enabled ? (
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="ref-heading">Section Heading</label>
              <input
                id="ref-heading"
                type="text"
                placeholder="e.g. References or Bibliography"
                value={refs.heading || ''}
                onChange={(e) => updateReferences({ heading: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="select-ref-type-to-add">Add New Reference</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  id="select-ref-type-to-add"
                  value={defaultAddType}
                  onChange={(e) => setDefaultAddType(e.target.value)}
                  style={{ flex: 1 }}
                >
                  {REF_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <button
                  id="btn-add-reference"
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => addReference(defaultAddType)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="disabled-panel">
            References section is <strong>disabled</strong> — it will be omitted from the PDF and Table of Contents.
          </div>
        )}
      </div>

      {/* References list */}
      {refs.enabled && (
        <div style={{ marginTop: 'var(--sp-md)' }}>
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📖</div>
              <div className="empty-state-title">No references yet</div>
              <p className="empty-state-desc">
                Add books, journal papers, or websites using the controls above.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
              {items.map((item, index) => (
                <ReferenceCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={items.length}
                  onUpdate={(patch) => updateReferenceItem(item.id, patch)}
                  onDelete={() => {
                    const msg = item.title ? `Delete "${item.title}"?` : 'Delete this reference?';
                    if (confirm(msg)) deleteReferenceItem(item.id);
                  }}
                  onMoveUp={() => moveReferenceItemUp(item.id)}
                  onMoveDown={() => moveReferenceItemDown(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Individual Reference Card ───────────────────────────────────────── */
function ReferenceCard({ item, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const type       = item.type || 'book';
  const previewHtml = formatReferenceHtml(item);

  return (
    <div className="card ref-card-accent" id={`ref-card-${item.id}`}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="ref-index-badge">[{index + 1}]</span>
          <select
            id={`ref-type-${item.id}`}
            value={type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            style={{ fontSize: '.8125rem', fontWeight: 600, padding: '4px 8px' }}
          >
            {REF_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={index === 0}
            onClick={onMoveUp}
            title="Move up"
          >↑</button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={index === total - 1}
            onClick={onMoveDown}
            title="Move down"
          >↓</button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onDelete}
            title="Delete"
          >Delete</button>
        </div>
      </div>

      {/* Fields */}
      <div className="form-group">
        <label htmlFor={`ref-title-${item.id}`}>
          {type === 'book' ? 'Book Title' : type === 'paper' ? 'Paper / Article Title' : 'Website / Article Title'}
        </label>
        <input
          id={`ref-title-${item.id}`}
          type="text"
          placeholder={
            type === 'book'    ? 'e.g. Recommender Systems Handbook' :
            type === 'paper'   ? 'e.g. Attention Is All You Need' :
                                 'e.g. MongoDB Documentation'
          }
          value={item.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`ref-author-${item.id}`}>
            {type === 'website' ? 'Author / Organisation' : 'Author(s)'}
          </label>
          <input
            id={`ref-author-${item.id}`}
            type="text"
            placeholder={
              type === 'website'
                ? 'e.g. Mozilla Foundation'
                : 'e.g. Ricci, F., Rokach, L., & Shapira, B.'
            }
            value={item.author || ''}
            onChange={(e) => onUpdate({ author: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor={`ref-year-${item.id}`}>Year</label>
          <input
            id={`ref-year-${item.id}`}
            type="text"
            placeholder="e.g. 2024"
            value={item.year || ''}
            onChange={(e) => onUpdate({ year: e.target.value })}
          />
        </div>
      </div>

      {type === 'book' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={`ref-publisher-${item.id}`}>Publisher</label>
            <input
              id={`ref-publisher-${item.id}`}
              type="text"
              placeholder="e.g. Springer or O'Reilly Media"
              value={item.publisher || ''}
              onChange={(e) => onUpdate({ publisher: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`ref-url-${item.id}`}>URL (optional)</label>
            <input
              id={`ref-url-${item.id}`}
              type="text"
              placeholder="https://…"
              value={item.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
            />
          </div>
        </div>
      )}

      {type === 'paper' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor={`ref-journal-${item.id}`}>Journal / Conference / Publisher</label>
            <input
              id={`ref-journal-${item.id}`}
              type="text"
              placeholder="e.g. IEEE Transactions on Software Engineering"
              value={item.publisher || ''}
              onChange={(e) => onUpdate({ publisher: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`ref-url-${item.id}`}>URL / DOI (optional)</label>
            <input
              id={`ref-url-${item.id}`}
              type="text"
              placeholder="https://doi.org/…"
              value={item.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
            />
          </div>
        </div>
      )}

      {type === 'website' && (
        <div className="form-group">
          <label htmlFor={`ref-url-${item.id}`}>Website URL</label>
          <input
            id={`ref-url-${item.id}`}
            type="text"
            placeholder="https://www.example.com/"
            value={item.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
          />
        </div>
      )}

      {/* Citation preview */}
      <div className="ref-citation-preview">
        <div className="ref-citation-label">Print citation preview</div>
        <div style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '.9rem', lineHeight: 1.55, color: 'var(--c-text)' }}>
          <strong style={{ marginRight: '6px' }}>[{index + 1}]</strong>
          <span
            dangerouslySetInnerHTML={{ __html: previewHtml || '<em style="color:#94a3b8">Incomplete entry</em>' }}
          />
        </div>
      </div>
    </div>
  );
}
