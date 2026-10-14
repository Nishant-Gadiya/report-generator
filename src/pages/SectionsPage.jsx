/**
 * SectionsPage.jsx
 * Editor for all report sections — add, edit, delete, reorder, upload images,
 * and insert/edit inline tables.
 */
import { useState, useRef } from 'react';
import { useReport } from '../context/ReportContext.jsx';
import imageCompression from 'browser-image-compression';

export default function SectionsPage() {
  const {
    report,
    addSection,
    updateSection,
    deleteSection,
    moveSectionUp,
    moveSectionDown,
    addImageToSection,
    updateImageInSection,
    removeImageFromSection,
    addTableToSection,
    updateTable,
    updateTableCell,
    addTableRow,
    removeTableRow,
    addTableCol,
    removeTableCol,
    deleteTable,
  } = useReport();

  const [expandedId, setExpandedId]     = useState(null);
  const [uploadError, setUploadError]   = useState(null);
  const [tableDialog, setTableDialog]   = useState(null);
  const [newTableRows, setNewTableRows] = useState(3);
  const [newTableCols, setNewTableCols] = useState(3);
  const fileInputRefs = useRef({});

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleAddSection() {
    const newId = addSection();
    if (newId) setExpandedId(newId);
  }

  async function handleImageUpload(sectionId, files) {
    setUploadError(null);
    const opts = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file (JPG, PNG, WebP).');
        continue;
      }
      try {
        const compressed = await imageCompression(file, opts);
        await addImageToSection(sectionId, compressed, '', 'medium');
      } catch {
        try {
          await addImageToSection(sectionId, file, '', 'medium');
        } catch {
          setUploadError(`Could not process image "${file.name}". Please try another.`);
        }
      }
    }
  }

  function handleDrop(e, sectionId) {
    e.preventDefault();
    handleImageUpload(sectionId, e.dataTransfer.files);
  }

  function openTableDialog(sectionId) {
    setNewTableRows(3);
    setNewTableCols(3);
    setTableDialog({ sectionId });
  }

  function confirmInsertTable() {
    const rows = Math.max(1, Math.min(30, parseInt(newTableRows, 10) || 3));
    const cols = Math.max(1, Math.min(15, parseInt(newTableCols, 10) || 3));
    addTableToSection(tableDialog.sectionId, rows, cols);
    setTableDialog(null);
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h1 className="page-title">Report Sections</h1>
          <p className="page-subtitle">
            Add, edit, and reorder sections. Content flows naturally across pages.
          </p>
        </div>
        <button
          id="btn-add-section"
          className="btn btn-primary"
          style={{ flexShrink: 0, marginTop: '2px' }}
          onClick={handleAddSection}
        >
          + Add Section
        </button>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="info-box error" style={{ marginBottom: '12px' }}>
          ⚠️ {uploadError}
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: '8px', padding: '2px 6px' }}
            onClick={() => setUploadError(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Empty state */}
      {report.sections.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-title">No sections yet</div>
          <p className="empty-state-desc">
            Click <strong>+ Add Section</strong> above to start building your report.
          </p>
        </div>
      )}

      {/* Section cards */}
      {report.sections.map((sec, idx) => {
        const isExpanded = expandedId === sec.id;
        const tableCnt   = (sec.tables || []).length;
        return (
          <div
            key={sec.id}
            className={`section-card${isExpanded ? ' expanded' : ''}`}
          >
            {/* Header */}
            <div
              className="section-card-header"
              onClick={() => toggleExpand(sec.id)}
              role="button"
              aria-expanded={isExpanded}
              id={`section-header-${sec.id}`}
            >
              <div className="section-index-badge" aria-hidden="true">{idx + 1}</div>
              <span className="section-title-preview">{sec.title || 'Untitled Section'}</span>

              {sec.pageBreakBefore && (
                <span className="badge badge-accent" style={{ marginRight: '4px' }}>Page break</span>
              )}
              {tableCnt > 0 && (
                <span className="badge badge-neutral" style={{ marginRight: '4px' }}>
                  {tableCnt} table{tableCnt > 1 ? 's' : ''}
                </span>
              )}
              {sec.images?.length > 0 && (
                <span className="badge badge-neutral" style={{ marginRight: '4px' }}>
                  {sec.images.length} image{sec.images.length > 1 ? 's' : ''}
                </span>
              )}

              {/* Controls — stop propagation so clicks don't toggle */}
              <div
                style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  id={`btn-move-up-${sec.id}`}
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => moveSectionUp(sec.id)}
                  disabled={idx === 0}
                  title="Move up"
                >↑</button>
                <button
                  id={`btn-move-down-${sec.id}`}
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => moveSectionDown(sec.id)}
                  disabled={idx === report.sections.length - 1}
                  title="Move down"
                >↓</button>
                <button
                  id={`btn-delete-section-${sec.id}`}
                  className="btn btn-danger btn-icon btn-sm"
                  onClick={() => {
                    if (confirm(`Delete section "${sec.title || 'Untitled'}"?`)) {
                      deleteSection(sec.id);
                      if (expandedId === sec.id) setExpandedId(null);
                    }
                  }}
                  title="Delete section"
                >✕</button>
              </div>

              <span style={{ marginLeft: '8px', color: 'var(--c-text-dim)', fontSize: '.75rem', userSelect: 'none' }}>
                {isExpanded ? '▲' : '▼'}
              </span>
            </div>

            {/* Body */}
            {isExpanded && (
              <div className="section-card-body">
                {/* Title */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor={`sec-title-${sec.id}`}>Section Title</label>
                  <input
                    id={`sec-title-${sec.id}`}
                    type="text"
                    value={sec.title}
                    onChange={(e) => updateSection(sec.id, { title: e.target.value })}
                    placeholder="Section heading"
                  />
                </div>

                {/* Content */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor={`sec-content-${sec.id}`}>Content</label>
                  <textarea
                    id={`sec-content-${sec.id}`}
                    value={sec.content}
                    rows={8}
                    onChange={(e) => updateSection(sec.id, { content: e.target.value })}
                    placeholder="Enter section content here. Use blank lines to separate paragraphs."
                    style={{ minHeight: '160px' }}
                  />
                </div>

                {/* Page-break option */}
                <label className="toggle-row" style={{ width: 'fit-content' }}>
                  <input
                    id={`sec-pagebreak-${sec.id}`}
                    type="checkbox"
                    checked={sec.pageBreakBefore}
                    onChange={(e) => updateSection(sec.id, { pageBreakBefore: e.target.checked })}
                  />
                  <span>Start this section on a new page</span>
                </label>

                {/* ── Tables ── */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span className="subsection-label">Tables</span>
                    {tableCnt > 0 && (
                      <span className="badge badge-neutral">{tableCnt}</span>
                    )}
                    <button
                      id={`btn-insert-table-${sec.id}`}
                      className="btn btn-ghost btn-sm"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => openTableDialog(sec.id)}
                    >
                      + Insert Table
                    </button>
                  </div>

                  {(sec.tables || []).map((tbl, tblIdx) => (
                    <TableEditor
                      key={tbl.id}
                      tbl={tbl}
                      tblIdx={tblIdx}
                      onUpdateCell={(r, c, v) => updateTableCell(sec.id, tbl.id, r, c, v)}
                      onUpdateMeta={(patch) => updateTable(sec.id, tbl.id, patch)}
                      onAddRow={() => addTableRow(sec.id, tbl.id)}
                      onRemoveRow={(r) => removeTableRow(sec.id, tbl.id, r)}
                      onAddCol={() => addTableCol(sec.id, tbl.id)}
                      onRemoveCol={(c) => removeTableCol(sec.id, tbl.id, c)}
                      onDelete={() => {
                        if (confirm('Delete this table?')) deleteTable(sec.id, tbl.id);
                      }}
                    />
                  ))}
                </div>

                {/* ── Images ── */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span className="subsection-label">Images</span>
                    {sec.images.length > 0 && (
                      <span className="badge badge-neutral">{sec.images.length}</span>
                    )}
                  </div>

                  <div
                    className="image-upload-zone"
                    id={`sec-img-dropzone-${sec.id}`}
                    onDrop={(e) => handleDrop(e, sec.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRefs.current[sec.id]?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRefs.current[sec.id]?.click()}
                    aria-label="Click or drag to upload images"
                  >
                    Click or drag images here — JPG, PNG, WebP
                  </div>
                  <input
                    ref={(el) => (fileInputRefs.current[sec.id] = el)}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(sec.id, e.target.files)}
                  />

                  {sec.images.length > 0 && (
                    <div className="image-thumbnail-grid">
                      {sec.images.map((img) => (
                        <ImageThumb
                          key={img.id}
                          img={img}
                          sectionId={sec.id}
                          onRemove={removeImageFromSection}
                          onUpdate={(patch) => updateImageInSection(sec.id, img.id, patch)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Bottom add button */}
      {report.sections.length > 0 && (
        <button
          id="btn-add-section-bottom"
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '8px' }}
          onClick={addSection}
        >
          + Add Section
        </button>
      )}

      {/* ── Insert Table Modal ── */}
      {tableDialog && (
        <div
          id="table-modal-overlay"
          className="modal-overlay"
          onClick={() => setTableDialog(null)}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Insert Table</div>
            <p className="modal-subtitle">
              Specify the initial number of rows and columns.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="input-table-rows">Rows</label>
                <input
                  id="input-table-rows"
                  type="number"
                  min={1}
                  max={30}
                  value={newTableRows}
                  onChange={(e) => setNewTableRows(e.target.value)}
                  autoFocus
                  style={{ textAlign: 'center' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="input-table-cols">Columns</label>
                <input
                  id="input-table-cols"
                  type="number"
                  min={1}
                  max={15}
                  value={newTableCols}
                  onChange={(e) => setNewTableCols(e.target.value)}
                  style={{ textAlign: 'center' }}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button
                id="btn-cancel-insert-table"
                className="btn btn-ghost btn-sm"
                onClick={() => setTableDialog(null)}
              >
                Cancel
              </button>
              <button
                id="btn-confirm-insert-table"
                className="btn btn-primary btn-sm"
                onClick={confirmInsertTable}
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Inline Table Editor ─────────────────────────────────────────────── */
function TableEditor({ tbl, tblIdx, onUpdateCell, onUpdateMeta, onAddRow, onRemoveRow, onAddCol, onRemoveCol, onDelete }) {
  const rows = tbl.rows || [];
  const cols = rows[0]?.length || 0;

  return (
    <div className="table-editor">
      {/* Toolbar */}
      <div className="table-editor-toolbar">
        <span className="table-editor-label">Table {tblIdx + 1}</span>

        <input
          type="text"
          placeholder="Caption (optional)"
          value={tbl.caption || ''}
          onChange={(e) => onUpdateMeta({ caption: e.target.value })}
          style={{
            flex: 1,
            minWidth: '120px',
            fontSize: '.78rem',
            padding: '3px 8px',
          }}
        />

        <label className="toggle-row" style={{ fontSize: '.75rem', gap: '5px', whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={!!tbl.headerRow}
            onChange={(e) => onUpdateMeta({ headerRow: e.target.checked })}
          />
          <span style={{ color: 'var(--c-text-muted)', fontWeight: 500 }}>Header row</span>
        </label>

        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
          <button className="btn btn-ghost btn-sm" onClick={onAddRow} title="Add row">+ Row</button>
          <button className="btn btn-ghost btn-sm" onClick={onAddCol} title="Add column">+ Col</button>
          <button className="btn btn-danger btn-sm" onClick={onDelete} title="Delete table">Delete</button>
        </div>
      </div>

      {/* Grid */}
      <div className="table-editor-grid">
        <table>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {/* Row remove */}
                <td style={{ width: '24px', textAlign: 'center', verticalAlign: 'middle', border: 'none', paddingRight: '4px' }}>
                  <button
                    className="table-row-remove"
                    onClick={() => onRemoveRow(ri)}
                    disabled={rows.length <= 1}
                    title="Remove row"
                  >✕</button>
                </td>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={ri === 0 && tbl.headerRow ? 'table-cell-header' : ''}
                  >
                    <textarea
                      value={cell}
                      onChange={(e) => onUpdateCell(ri, ci, e.target.value)}
                      rows={2}
                    />
                  </td>
                ))}
              </tr>
            ))}
            {/* Column remove row */}
            <tr>
              <td style={{ border: 'none' }} />
              {Array(cols).fill(0).map((_, ci) => (
                <td key={ci} style={{ border: 'none', textAlign: 'center', paddingTop: '3px', paddingBottom: '6px' }}>
                  <button
                    className="table-col-remove"
                    onClick={() => onRemoveCol(ci)}
                    disabled={cols <= 1}
                    title="Remove column"
                  >✕</button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Image Thumbnail ─────────────────────────────────────────────────── */
function ImageThumb({ img, sectionId, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '108px' }}>
      <div className="image-thumb">
        <img src={img.blobUrl || ''} alt={img.caption || 'Uploaded image'} />
        <button
          className="image-thumb-remove"
          onClick={() => onRemove(sectionId, img.id)}
          title="Remove image"
          aria-label="Remove image"
        >✕</button>
      </div>

      {editing ? (
        <input
          type="text"
          placeholder="Caption"
          value={img.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          onBlur={() => setEditing(false)}
          autoFocus
          style={{ fontSize: '.72rem', padding: '3px 6px' }}
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          title="Click to edit caption"
          style={{
            fontSize: '.7rem',
            color: 'var(--c-text-muted)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {img.caption || '(no caption)'}
        </span>
      )}

      <select
        value={img.size || 'medium'}
        onChange={(e) => onUpdate({ size: e.target.value })}
        style={{ fontSize: '.7rem', padding: '2px 4px' }}
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="full">Full width</option>
      </select>
    </div>
  );
}
