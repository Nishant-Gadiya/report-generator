/**
 * HeaderFooterPage.jsx
 *
 * Dedicated UI panel to configure Header, Footer, Page Borders, Line Widths & Alignments.
 */
import { useReport } from '../context/ReportContext.jsx';

export default function HeaderFooterPage() {
  const { report, updateHeaderFooter } = useReport();

  if (!report) return null;

  const hf = report.headerFooter || {};
  const header = hf.header || {
    enabled: true,
    text: '',
    alignment: 'right',
    showLine: true,
    lineThickness: 1,
    lineWidth: 70,
    lineAlignment: 'center',
    headerToLineSpacingMm: 3,
    lineToContentSpacingMm: 8,
  };
  const footer = hf.footer || {
    enabled: true,
    layout: 'left-center-page',
    leftText: '',
    centerText: '',
    rightText: '',
    showPageNumber: true,
    showLine: true,
    lineThickness: 1,
    lineWidth: 70,
    lineAlignment: 'center',
    contentToLineSpacingMm: 8,
    lineToTextSpacingMm: 3,
    bottomSpacingMm: 8,
  };
  const pageDecoration = hf.pageDecoration || {
    firstPageBorder: hf.pageDecoration?.border || 'double',
    otherPagesBorder: hf.pageDecoration?.border || 'double',
  };

  function handleHeaderChange(field, val) {
    updateHeaderFooter({
      header: { ...header, [field]: val },
    });
  }

  function handleFooterChange(field, val) {
    updateHeaderFooter({
      footer: { ...footer, [field]: val },
    });
  }

  function handleBorderChange(target, val) {
    updateHeaderFooter({
      pageDecoration: { ...pageDecoration, [target]: val },
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Header, Footer & Border Settings</h1>
        <p className="page-description">
          Configure page borders, header/footer text, line rules, line widths, alignments, and content spacing.
        </p>
      </div>

      <div className="settings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* ── Page Border (Decoration) ── */}
        <section className="card">
          <h2 className="card-title">Page Border Settings</h2>
          <p className="card-subtitle" style={{ marginBottom: '16px', color: '#666', fontSize: '13px' }}>
            Set independent border styles for the front sheet and remaining report pages.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                First Page Border (Front Sheet)
              </label>
              <div className="button-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${pageDecoration.firstPageBorder === 'none' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('firstPageBorder', 'none')}
                >
                  🚫 None
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${pageDecoration.firstPageBorder === 'single' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('firstPageBorder', 'single')}
                >
                  ▭ Single
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${pageDecoration.firstPageBorder === 'double' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('firstPageBorder', 'double')}
                >
                  ⧈ Double
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
                Remaining Pages Border (TOC, Body, Refs)
              </label>
              <div className="button-group" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${pageDecoration.otherPagesBorder === 'none' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('otherPagesBorder', 'none')}
                >
                  🚫 None
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${pageDecoration.otherPagesBorder === 'single' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('otherPagesBorder', 'single')}
                >
                  ▭ Single
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${pageDecoration.otherPagesBorder === 'double' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('otherPagesBorder', 'double')}
                >
                  ⧈ Double
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Header Settings ── */}
        <section className="card">
          <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="card-title" style={{ margin: 0 }}>Header Settings</h2>
            <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={(e) => handleHeaderChange('enabled', e.target.checked)}
              />
              <span>Enable Header</span>
            </label>
          </div>

          {header.enabled && (
            <div className="form-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Header Text</label>
                <input
                  type="text"
                  className="form-control"
                  value={header.text}
                  placeholder="e.g. CINENOVA: AI TICKET BOOKING PLATFORM"
                  onChange={(e) => handleHeaderChange('text', e.target.value)}
                />
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Header Text Alignment</label>
                  <select
                    className="form-control"
                    value={header.alignment}
                    onChange={(e) => handleHeaderChange('alignment', e.target.value)}
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Center Aligned</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Line Below Header</label>
                  <label className="toggle-label mt-2" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      checked={header.showLine}
                      onChange={(e) => handleHeaderChange('showLine', e.target.checked)}
                    />
                    <span>Show Horizontal Line</span>
                  </label>
                </div>
              </div>

              {header.showLine && (
                <>
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Line Width (%)</label>
                      <select
                        className="form-control"
                        value={header.lineWidth ?? 70}
                        onChange={(e) => handleHeaderChange('lineWidth', parseInt(e.target.value, 10))}
                      >
                        <option value="50">50% Width</option>
                        <option value="65">65% Width</option>
                        <option value="70">70% Width (Default)</option>
                        <option value="75">75% Width</option>
                        <option value="85">85% Width</option>
                        <option value="100">100% Full Width</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Line Alignment</label>
                      <select
                        className="form-control"
                        value={header.lineAlignment || 'center'}
                        onChange={(e) => handleHeaderChange('lineAlignment', e.target.value)}
                      >
                        <option value="left">Left Aligned</option>
                        <option value="center">Center Aligned (Default)</option>
                        <option value="right">Right Aligned</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Line Thickness (px)</label>
                      <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.5"
                        className="form-control"
                        value={header.lineThickness}
                        onChange={(e) => handleHeaderChange('lineThickness', parseFloat(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Header-to-line spacing (mm)</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        className="form-control"
                        value={header.headerToLineSpacingMm}
                        onChange={(e) => handleHeaderChange('headerToLineSpacingMm', parseInt(e.target.value, 10) || 3)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Line-to-content spacing (mm)</label>
                      <input
                        type="number"
                        min="2"
                        max="20"
                        className="form-control"
                        value={header.lineToContentSpacingMm}
                        onChange={(e) => handleHeaderChange('lineToContentSpacingMm', parseInt(e.target.value, 10) || 8)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* ── Footer Settings ── */}
        <section className="card">
          <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="card-title" style={{ margin: 0 }}>Footer Settings</h2>
            <label className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              <input
                type="checkbox"
                checked={footer.enabled}
                onChange={(e) => handleFooterChange('enabled', e.target.checked)}
              />
              <span>Enable Footer</span>
            </label>
          </div>

          {footer.enabled && (
            <div className="form-stack" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Footer Layout Options</label>
                <select
                  className="form-control"
                  value={footer.layout}
                  onChange={(e) => handleFooterChange('layout', e.target.value)}
                >
                  <option value="left-page">A. Left Text + Page Number (Right)</option>
                  <option value="left-center-page">B. Left Text + Center Text + Page Number (Right)</option>
                  <option value="left-right">C. Left Text + Right Text (No Page Number)</option>
                  <option value="left-center-right">D. Left Text + Center Text + Right Text (No Page Number)</option>
                </select>
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Left Footer Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={footer.leftText}
                    placeholder="e.g. Department of Information Science"
                    onChange={(e) => handleFooterChange('leftText', e.target.value)}
                  />
                </div>

                {(footer.layout === 'left-center-page' || footer.layout === 'left-center-right') && (
                  <div className="form-group">
                    <label className="form-label">Center Footer Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={footer.centerText}
                      placeholder="e.g. Academic Report 2025-2026"
                      onChange={(e) => handleFooterChange('centerText', e.target.value)}
                    />
                  </div>
                )}

                {(footer.layout === 'left-right' || footer.layout === 'left-center-right') && (
                  <div className="form-group">
                    <label className="form-label">Right Footer Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={footer.rightText}
                      placeholder="e.g. Confidential"
                      onChange={(e) => handleFooterChange('rightText', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Dynamic Page Number</label>
                  <label className="toggle-label mt-2" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      checked={footer.showPageNumber}
                      onChange={(e) => handleFooterChange('showPageNumber', e.target.checked)}
                    />
                    <span>Include Dynamic Page Number</span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Line Above Footer</label>
                  <label className="toggle-label mt-2" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginTop: '8px' }}>
                    <input
                      type="checkbox"
                      checked={footer.showLine}
                      onChange={(e) => handleFooterChange('showLine', e.target.checked)}
                    />
                    <span>Show Horizontal Line</span>
                  </label>
                </div>
              </div>

              {footer.showLine && (
                <>
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Line Width (%)</label>
                      <select
                        className="form-control"
                        value={footer.lineWidth ?? 70}
                        onChange={(e) => handleFooterChange('lineWidth', parseInt(e.target.value, 10))}
                      >
                        <option value="50">50% Width</option>
                        <option value="65">65% Width</option>
                        <option value="70">70% Width (Default)</option>
                        <option value="75">75% Width</option>
                        <option value="85">85% Width</option>
                        <option value="100">100% Full Width</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Line Alignment</label>
                      <select
                        className="form-control"
                        value={footer.lineAlignment || 'center'}
                        onChange={(e) => handleFooterChange('lineAlignment', e.target.value)}
                      >
                        <option value="left">Left Aligned</option>
                        <option value="center">Center Aligned (Default)</option>
                        <option value="right">Right Aligned</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Line Thickness (px)</label>
                      <input
                        type="number"
                        min="0.5"
                        max="5"
                        step="0.5"
                        className="form-control"
                        value={footer.lineThickness}
                        onChange={(e) => handleFooterChange('lineThickness', parseFloat(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Content-to-footer-line spacing (mm)</label>
                      <input
                        type="number"
                        min="2"
                        max="20"
                        className="form-control"
                        value={footer.contentToLineSpacingMm}
                        onChange={(e) => handleFooterChange('contentToLineSpacingMm', parseInt(e.target.value, 10) || 8)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Footer-line-to-text spacing (mm)</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        className="form-control"
                        value={footer.lineToTextSpacingMm}
                        onChange={(e) => handleFooterChange('lineToTextSpacingMm', parseInt(e.target.value, 10) || 3)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bottom margin spacing (mm)</label>
                      <input
                        type="number"
                        min="4"
                        max="25"
                        className="form-control"
                        value={footer.bottomSpacingMm}
                        onChange={(e) => handleFooterChange('bottomSpacingMm', parseInt(e.target.value, 10) || 8)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
