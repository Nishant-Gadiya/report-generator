/**
 * SectionsPage.jsx
 * Editor for all report sections — add, edit, delete, reorder, upload images.
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
  } = useReport();

  const [expandedId, setExpandedId] = useState(null);
  const [uploadError, setUploadError] = useState(null);
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
      } catch (err) {
        console.warn('Image compression fallback to original:', err);
        try {
          await addImageToSection(sectionId, file, '', 'medium');
        } catch (saveErr) {
          setUploadError(`Could not process image "${file.name}". Please try another image.`);
        }
      }
    }
  }

  function handleDrop(e, sectionId) {
    e.preventDefault();
    handleImageUpload(sectionId, e.dataTransfer.files);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
        <div>
          <h1 className="page-title">📝 Report Sections</h1>
          <p className="page-subtitle">
            Add, edit, reorder, and manage sections. Content flows naturally across pages.
          </p>
        </div>
        <button
          id="btn-add-section"
          className="btn btn-primary"
          style={{ marginLeft: 'auto', flexShrink: 0 }}
          onClick={handleAddSection}
        >
          + Add Section
        </button>
      </div>

      {uploadError && (
        <div className="info-box" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', marginBottom: '12px' }}>
          ⚠️ {uploadError}
        </div>
      )}

      {report.sections.length === 0 && (
        <div className="info-box" style={{ textAlign: 'center', padding: '40px' }}>
          No sections yet. Click <strong>+ Add Section</strong> to get started.
        </div>
      )}

      {report.sections.map((sec, idx) => {
        const isExpanded = expandedId === sec.id;
        return (
          <div
            key={sec.id}
            className={`section-card ${isExpanded ? 'expanded' : ''}`}
          >
            {/* ── Header ── */}
            <div
              className="section-card-header"
              onClick={() => toggleExpand(sec.id)}
              role="button"
              aria-expanded={isExpanded}
              id={`section-header-${sec.id}`}
            >
              <div className="section-index-badge">{idx + 1}</div>
              <span className="section-title-preview">{sec.title || 'Untitled Section'}</span>

              {sec.pageBreakBefore && (
                <span className="badge badge-accent" style={{ marginRight: '4px' }}>
                  Page Break
                </span>
              )}

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
                    if (confirm(`Delete section "${sec.title}"?`)) {
                      deleteSection(sec.id);
                      if (expandedId === sec.id) setExpandedId(null);
                    }
                  }}
                  title="Delete section"
                >✕</button>
              </div>

              <span style={{ marginLeft: '8px', color: 'var(--c-text-dim)', fontSize: '.8rem' }}>
                {isExpanded ? '▲' : '▼'}
              </span>
            </div>

            {/* ── Body ── */}
            {isExpanded && (
              <div className="section-card-body">
                {/* Title */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Section Title</label>
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
                  <label>Content</label>
                  <textarea
                    id={`sec-content-${sec.id}`}
                    value={sec.content}
                    rows={8}
                    onChange={(e) => updateSection(sec.id, { content: e.target.value })}
                    placeholder="Enter the section content here. Use blank lines to separate paragraphs."
                    style={{ minHeight: '160px' }}
                  />
                </div>

                {/* Options row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <label
                    id={`sec-pagebreak-label-${sec.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      textTransform: 'none',
                      fontSize: '.875rem',
                      fontWeight: '500',
                      color: 'var(--c-text-muted)',
                    }}
                  >
                    <input
                      id={`sec-pagebreak-${sec.id}`}
                      type="checkbox"
                      checked={sec.pageBreakBefore}
                      onChange={(e) =>
                        updateSection(sec.id, { pageBreakBefore: e.target.checked })
                      }
                    />
                    Start this section on a new page
                  </label>
                </div>

                {/* Images */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      gap: '8px',
                    }}
                  >
                    <label style={{ textTransform: 'uppercase', fontSize: '.75rem', marginBottom: 0 }}>
                      Images
                    </label>
                    <span className="badge badge-accent">{sec.images.length}</span>
                  </div>

                  {/* Upload zone */}
                  <div
                    className="image-upload-zone"
                    id={`sec-img-dropzone-${sec.id}`}
                    onDrop={(e) => handleDrop(e, sec.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRefs.current[sec.id]?.click()}
                  >
                    📎 Click or drag images here (JPG, PNG, WebP)
                  </div>
                  <input
                    ref={(el) => (fileInputRefs.current[sec.id] = el)}
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(sec.id, e.target.files)}
                  />

                  {/* Thumbnails */}
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
    </div>
  );
}

/** Individual image thumbnail with caption and size controls */
function ImageThumb({ img, sectionId, onRemove, onUpdate }) {
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '110px' }}>
      <div className="image-thumb">
        <img src={img.blobUrl || ''} alt={img.caption || 'image'} />
        <button
          className="image-thumb-remove"
          onClick={() => onRemove(sectionId, img.id)}
          title="Remove image"
        >
          ✕
        </button>
      </div>

      {editing ? (
        <input
          type="text"
          placeholder="Caption"
          value={img.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          onBlur={() => setEditing(false)}
          autoFocus
          style={{ fontSize: '.75rem', padding: '2px 5px' }}
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          style={{
            fontSize: '.7rem',
            color: 'var(--c-text-muted)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title="Click to edit caption"
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
