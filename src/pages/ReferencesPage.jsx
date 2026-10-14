/**
 * ReferencesPage.jsx
 *
 * Dedicated editor for the optional References section:
 *  - Enable/disable toggle & editable heading
 *  - Add, edit, delete, reorder references
 *  - Supports types: Book, Research Paper / Journal, and Website
 *  - Dynamic field visibility per type
 *  - Live preview with blue underlined URLs
 *
 * Preserved independently of main report sections and cover templates.
 */
import { useState } from 'react';
import { useReport } from '../context/ReportContext.jsx';
import { formatReferenceHtml } from '../pdf/printTemplate.js';

const REF_TYPES = [
  { id: 'book', label: '📖 Book', name: 'Book' },
  { id: 'paper', label: '📄 Research Paper / Journal', name: 'Research Paper / Journal' },
  { id: 'website', label: '🌐 Website', name: 'Website' },
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

  const refs = report?.references || {
    enabled: true,
    heading: 'References',
    items: [],
  };

  const items = Array.isArray(refs.items) ? refs.items : [];

  function handleAdd() {
    addReference(defaultAddType);
  }

  function handleDelete(id, title) {
    const confirmMsg = title
      ? `Delete reference "${title}"?`
      : 'Delete this reference?';
    if (confirm(confirmMsg)) {
      deleteReferenceItem(id);
    }
  }

  return (
    <div className="references-page">
      <h1 className="page-title">📚 References & Bibliography</h1>
      <p className="page-subtitle">
        Manage citations and reference entries. When enabled, References are rendered on a dedicated
        page at the end of the report and indexed in the Table of Contents.
      </p>

      {/* ── Section Settings Card ── */}
      <div className="card" id="card-references-settings">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div className="card-title" style={{ margin: 0 }}>
            <span className="card-icon">⚙️</span> References Configuration
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              className={`badge ${refs.enabled ? 'badge-success' : ''}`}
              style={
                !refs.enabled
                  ? { background: 'var(--c-surface-3)', color: 'var(--c-text-muted)' }
                  : {}
              }
            >
              {refs.enabled ? `${items.length} Entries` : 'Disabled'}
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
                id="checkbox-enable-references"
                type="checkbox"
                checked={!!refs.enabled}
                onChange={(e) => updateReferences({ enabled: e.target.checked })}
              />
              Include References in Report
            </label>
          </div>
        </div>

        {refs.enabled ? (
          <div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ref-heading">Section Heading</label>
                <input
                  id="ref-heading"
                  type="text"
                  placeholder="e.g. References or Bibliography"
                  value={refs.heading || ''}
                  onChange={(e) => updateReferences({ heading: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Add New Reference</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    id="select-ref-type-to-add"
                    value={defaultAddType}
                    onChange={(e) => setDefaultAddType(e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {REF_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <button
                    id="btn-add-reference"
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAdd}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    + Add Reference
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '16px',
              background: 'var(--c-surface-2)',
              borderRadius: 'var(--r-sm)',
              color: 'var(--c-text-muted)',
              fontSize: '.85rem',
            }}
          >
            References section is currently <strong>disabled</strong>. It will be completely
            omitted from the generated PDF and Table of Contents without leaving any blank pages.
          </div>
        )}
      </div>

      {/* ── References List ── */}
      {refs.enabled && (
        <div style={{ marginTop: '20px' }}>
          {items.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--c-text-muted)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📖</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--c-text)' }}>
                No References Added Yet
              </div>
              <p style={{ fontSize: '.85rem', marginTop: '6px' }}>
                Add books, journal papers, or websites using the controls above.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item, index) => {
                const type = item.type || 'book';
                const previewHtml = formatReferenceHtml(item);

                return (
                  <div
                    key={item.id}
                    className="card"
                    id={`ref-card-${item.id}`}
                    style={{
                      borderLeft: '4px solid var(--c-accent)',
                      position: 'relative',
                    }}
                  >
                    {/* Header Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            background: 'var(--c-surface-3)',
                            color: 'var(--c-accent-light)',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '.85rem',
                          }}
                        >
                          [{index + 1}]
                        </span>
                        <div className="form-group" style={{ margin: 0, minWidth: '180px' }}>
                          <select
                            id={`ref-type-${item.id}`}
                            value={type}
                            onChange={(e) =>
                              updateReferenceItem(item.id, { type: e.target.value })
                            }
                            style={{
                              padding: '4px 8px',
                              fontSize: '.85rem',
                              fontWeight: 600,
                              background: 'var(--c-surface-2)',
                            }}
                          >
                            {REF_TYPES.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Action buttons: Move Up, Move Down, Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={index === 0}
                          onClick={() => moveReferenceItemUp(item.id)}
                          title="Move Up"
                          style={{ padding: '4px 10px' }}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={index === items.length - 1}
                          onClick={() => moveReferenceItemDown(item.id)}
                          title="Move Down"
                          style={{ padding: '4px 10px' }}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Delete Reference"
                          style={{ padding: '4px 10px' }}
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Form Fields According to Type */}
                    <div>
                      {/* Row 1: Title */}
                      <div className="form-group">
                        <label htmlFor={`ref-title-${item.id}`}>
                          {type === 'book'
                            ? 'Book Title'
                            : type === 'paper'
                            ? 'Paper / Article Title'
                            : 'Website / Article Title'}
                        </label>
                        <input
                          id={`ref-title-${item.id}`}
                          type="text"
                          placeholder={
                            type === 'book'
                              ? 'e.g. Recommender Systems Handbook'
                              : type === 'paper'
                              ? 'e.g. Attention Is All You Need'
                              : 'e.g. MongoDB Documentation'
                          }
                          value={item.title || ''}
                          onChange={(e) =>
                            updateReferenceItem(item.id, { title: e.target.value })
                          }
                        />
                      </div>

                      {/* Row 2: Author / Organization & Year */}
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor={`ref-author-${item.id}`}>
                            {type === 'website' ? 'Author / Organization' : 'Author(s)'}
                          </label>
                          <input
                            id={`ref-author-${item.id}`}
                            type="text"
                            placeholder={
                              type === 'website'
                                ? 'e.g. MongoDB Inc. or Mozilla'
                                : 'e.g. Ricci, F., Rokach, L., & Shapira, B.'
                            }
                            value={item.author || ''}
                            onChange={(e) =>
                              updateReferenceItem(item.id, { author: e.target.value })
                            }
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor={`ref-year-${item.id}`}>Year</label>
                          <input
                            id={`ref-year-${item.id}`}
                            type="text"
                            placeholder="e.g. 2024"
                            value={item.year || ''}
                            onChange={(e) =>
                              updateReferenceItem(item.id, { year: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* Row 3: Type-specific fields */}
                      {type === 'book' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor={`ref-publisher-${item.id}`}>Publisher</label>
                            <input
                              id={`ref-publisher-${item.id}`}
                              type="text"
                              placeholder="e.g. Springer or O'Reilly Media"
                              value={item.publisher || ''}
                              onChange={(e) =>
                                updateReferenceItem(item.id, { publisher: e.target.value })
                              }
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor={`ref-url-${item.id}`}>URL (Optional)</label>
                            <input
                              id={`ref-url-${item.id}`}
                              type="text"
                              placeholder="https://..."
                              value={item.url || ''}
                              onChange={(e) =>
                                updateReferenceItem(item.id, { url: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      )}

                      {type === 'paper' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor={`ref-journal-${item.id}`}>
                              Journal / Conference / Publisher
                            </label>
                            <input
                              id={`ref-journal-${item.id}`}
                              type="text"
                              placeholder="e.g. IEEE Transactions on Software Engineering"
                              value={item.publisher || ''}
                              onChange={(e) =>
                                updateReferenceItem(item.id, { publisher: e.target.value })
                              }
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor={`ref-url-${item.id}`}>URL / DOI (Optional)</label>
                            <input
                              id={`ref-url-${item.id}`}
                              type="text"
                              placeholder="https://doi.org/... or https://arxiv.org/..."
                              value={item.url || ''}
                              onChange={(e) =>
                                updateReferenceItem(item.id, { url: e.target.value })
                              }
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
                            placeholder="https://www.mongodb.com/docs/"
                            value={item.url || ''}
                            onChange={(e) =>
                              updateReferenceItem(item.id, { url: e.target.value })
                            }
                          />
                        </div>
                      )}

                      {/* Live Citation Preview */}
                      <div
                        style={{
                          marginTop: '10px',
                          padding: '10px 14px',
                          background: 'var(--c-surface-2)',
                          borderRadius: 'var(--r-sm)',
                          border: '1px dashed var(--c-border)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'var(--c-text-muted)',
                            marginBottom: '4px',
                            letterSpacing: '.5px',
                          }}
                        >
                          Print Citation Preview:
                        </div>
                        <div
                          style={{
                            fontFamily: "'Times New Roman', Times, serif",
                            fontSize: '.95rem',
                            lineHeight: 1.5,
                            color: 'var(--c-text)',
                          }}
                        >
                          <span style={{ fontWeight: 'bold', marginRight: '6px' }}>
                            [{index + 1}]
                          </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: previewHtml || '<em>Incomplete reference entry</em>',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
