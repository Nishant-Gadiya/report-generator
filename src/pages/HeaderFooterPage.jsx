/**
 * HeaderFooterPage.jsx
 * Configure Header, Footer, Page Borders, Line Widths & Alignments.
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
    firstPageBorder: 'double',
    otherPagesBorder: 'double',
  };

  function handleHeaderChange(field, val) {
    updateHeaderFooter({ header: { ...header, [field]: val } });
  }

  function handleFooterChange(field, val) {
    updateHeaderFooter({ footer: { ...footer, [field]: val } });
  }

  function handleBorderChange(target, val) {
    updateHeaderFooter({ pageDecoration: { ...pageDecoration, [target]: val } });
  }

  const BORDER_OPTIONS = [
    { value: 'none',   label: 'None' },
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
  ];

  const LINE_WIDTHS = [
    { value: 50,  label: '50%' },
    { value: 65,  label: '65%' },
    { value: 70,  label: '70% (default)' },
    { value: 75,  label: '75%' },
    { value: 85,  label: '85%' },
    { value: 100, label: '100% full width' },
  ];

  const ALIGNMENTS = [
    { value: 'left',   label: 'Left' },
    { value: 'center', label: 'Centre (default)' },
    { value: 'right',  label: 'Right' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Header, Footer &amp; Border</h1>
        <p className="page-subtitle">
          Configure page borders, header/footer text, horizontal rules, widths, alignments, and spacing.
        </p>
      </div>

      {/* ── Page Border ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📐</span> Page Border</div>
        <p style={{ fontSize: '.8125rem', color: 'var(--c-text-muted)', marginBottom: '16px' }}>
          Set independent border styles for the front sheet and remaining report pages.
        </p>
        <div className="form-row">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>First Page (Front Sheet)</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {BORDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`btn btn-sm ${pageDecoration.firstPageBorder === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('firstPageBorder', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Remaining Pages (TOC, Body, References)</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
              {BORDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`btn btn-sm ${pageDecoration.otherPagesBorder === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleBorderChange('otherPagesBorder', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Header Settings ── */}
      <div className="card">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="card-icon">⬆️</span> Header
          </span>
          <label className="toggle-row" style={{ fontWeight: 500, fontSize: '.8125rem', marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={header.enabled}
              onChange={(e) => handleHeaderChange('enabled', e.target.checked)}
            />
            <span>Enable</span>
          </label>
        </div>

        {header.enabled ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="header-text">Header Text</label>
              <input
                id="header-text"
                type="text"
                value={header.text}
                placeholder="e.g. PROJECT REPORT — DEPARTMENT OF CS"
                onChange={(e) => handleHeaderChange('text', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="header-alignment">Text Alignment</label>
                <select
                  id="header-alignment"
                  value={header.alignment}
                  onChange={(e) => handleHeaderChange('alignment', e.target.value)}
                >
                  {ALIGNMENTS.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Horizontal Rule Below Header</label>
                <label className="toggle-row" style={{ marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    checked={header.showLine}
                    onChange={(e) => handleHeaderChange('showLine', e.target.checked)}
                  />
                  <span>Show line</span>
                </label>
              </div>
            </div>

            {header.showLine && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="header-line-width">Line Width</label>
                    <select
                      id="header-line-width"
                      value={header.lineWidth ?? 70}
                      onChange={(e) => handleHeaderChange('lineWidth', parseInt(e.target.value, 10))}
                    >
                      {LINE_WIDTHS.map((w) => (
                        <option key={w.value} value={w.value}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="header-line-align">Line Alignment</label>
                    <select
                      id="header-line-align"
                      value={header.lineAlignment || 'center'}
                      onChange={(e) => handleHeaderChange('lineAlignment', e.target.value)}
                    >
                      {ALIGNMENTS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="header-line-thickness">Thickness (px)</label>
                    <input
                      id="header-line-thickness"
                      type="number"
                      min={0.5}
                      max={5}
                      step={0.5}
                      value={header.lineThickness}
                      onChange={(e) => handleHeaderChange('lineThickness', parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="header-to-line-spacing">Header to line spacing (mm)</label>
                    <input
                      id="header-to-line-spacing"
                      type="number"
                      min={1}
                      max={15}
                      value={header.headerToLineSpacingMm}
                      onChange={(e) => handleHeaderChange('headerToLineSpacingMm', parseInt(e.target.value, 10) || 3)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="line-to-content-spacing">Line to content spacing (mm)</label>
                    <input
                      id="line-to-content-spacing"
                      type="number"
                      min={2}
                      max={20}
                      value={header.lineToContentSpacingMm}
                      onChange={(e) => handleHeaderChange('lineToContentSpacingMm', parseInt(e.target.value, 10) || 8)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="disabled-panel">
            Header is disabled. It will not appear on any page of the generated PDF.
          </div>
        )}
      </div>

      {/* ── Footer Settings ── */}
      <div className="card">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="card-icon">⬇️</span> Footer
          </span>
          <label className="toggle-row" style={{ fontWeight: 500, fontSize: '.8125rem', marginBottom: 0 }}>
            <input
              type="checkbox"
              checked={footer.enabled}
              onChange={(e) => handleFooterChange('enabled', e.target.checked)}
            />
            <span>Enable</span>
          </label>
        </div>

        {footer.enabled ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="footer-layout">Footer Layout</label>
              <select
                id="footer-layout"
                value={footer.layout}
                onChange={(e) => handleFooterChange('layout', e.target.value)}
              >
                <option value="left-page">A — Left text + Page number (right)</option>
                <option value="left-center-page">B — Left + Centre text + Page number (right)</option>
                <option value="left-right">C — Left text + Right text (no page number)</option>
                <option value="left-center-right">D — Left + Centre + Right text (no page number)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="footer-left-text">Left Footer Text</label>
                <input
                  id="footer-left-text"
                  type="text"
                  value={footer.leftText}
                  placeholder="e.g. Dept. of Information Science"
                  onChange={(e) => handleFooterChange('leftText', e.target.value)}
                />
              </div>

              {(footer.layout === 'left-center-page' || footer.layout === 'left-center-right') && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="footer-center-text">Centre Footer Text</label>
                  <input
                    id="footer-center-text"
                    type="text"
                    value={footer.centerText}
                    placeholder="e.g. Academic Report 2025–2026"
                    onChange={(e) => handleFooterChange('centerText', e.target.value)}
                  />
                </div>
              )}

              {(footer.layout === 'left-right' || footer.layout === 'left-center-right') && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="footer-right-text">Right Footer Text</label>
                  <input
                    id="footer-right-text"
                    type="text"
                    value={footer.rightText}
                    placeholder="e.g. Confidential"
                    onChange={(e) => handleFooterChange('rightText', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Dynamic Page Number</label>
                <label className="toggle-row" style={{ marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    checked={footer.showPageNumber}
                    onChange={(e) => handleFooterChange('showPageNumber', e.target.checked)}
                  />
                  <span>Include auto page number</span>
                </label>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Horizontal Rule Above Footer</label>
                <label className="toggle-row" style={{ marginTop: '8px' }}>
                  <input
                    type="checkbox"
                    checked={footer.showLine}
                    onChange={(e) => handleFooterChange('showLine', e.target.checked)}
                  />
                  <span>Show line</span>
                </label>
              </div>
            </div>

            {footer.showLine && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="footer-line-width">Line Width</label>
                    <select
                      id="footer-line-width"
                      value={footer.lineWidth ?? 70}
                      onChange={(e) => handleFooterChange('lineWidth', parseInt(e.target.value, 10))}
                    >
                      {LINE_WIDTHS.map((w) => (
                        <option key={w.value} value={w.value}>{w.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="footer-line-align">Line Alignment</label>
                    <select
                      id="footer-line-align"
                      value={footer.lineAlignment || 'center'}
                      onChange={(e) => handleFooterChange('lineAlignment', e.target.value)}
                    >
                      {ALIGNMENTS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="footer-line-thickness">Thickness (px)</label>
                    <input
                      id="footer-line-thickness"
                      type="number"
                      min={0.5}
                      max={5}
                      step={0.5}
                      value={footer.lineThickness}
                      onChange={(e) => handleFooterChange('lineThickness', parseFloat(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="footer-content-to-line">Content to line (mm)</label>
                    <input
                      id="footer-content-to-line"
                      type="number"
                      min={2}
                      max={20}
                      value={footer.contentToLineSpacingMm}
                      onChange={(e) => handleFooterChange('contentToLineSpacingMm', parseInt(e.target.value, 10) || 8)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="footer-line-to-text">Line to footer text (mm)</label>
                    <input
                      id="footer-line-to-text"
                      type="number"
                      min={1}
                      max={15}
                      value={footer.lineToTextSpacingMm}
                      onChange={(e) => handleFooterChange('lineToTextSpacingMm', parseInt(e.target.value, 10) || 3)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="footer-bottom-spacing">Bottom margin (mm)</label>
                    <input
                      id="footer-bottom-spacing"
                      type="number"
                      min={4}
                      max={25}
                      value={footer.bottomSpacingMm}
                      onChange={(e) => handleFooterChange('bottomSpacingMm', parseInt(e.target.value, 10) || 8)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="disabled-panel">
            Footer is disabled. It will not appear on any page of the generated PDF.
          </div>
        )}
      </div>
    </div>
  );
}
