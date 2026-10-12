/**
 * printTemplate.js
 *
 * Builds a complete self-contained HTML string that is opened in a new window
 * and processed by Paged.js to produce a properly paginated PDF.
 *
 * Architecture:
 *  - The window contains:
 *    1.  A <style> block with @page rules and all print CSS.
 *    2.  The Paged.js polyfill (loaded from CDN, so no bundler issues).
 *    3.  The rendered report HTML (front sheet + TOC placeholder + body).
 *  - Paged.js hooks (beforeParsed / afterRendered) are used to:
 *      • inject correct page numbers into the TOC after layout.
 *      • number figures sequentially.
 */

/**
 * @param {import('../data/defaultReport').Report} report
 * @param {string} template  'classic' | 'modern'
 * @returns {string} Full HTML document string
 */
export function buildPrintDocument(report, template = 'classic', customLogoUrl = '') {
  const { frontSheet, sections, settings } = report;
  const {
    fontSize,
    lineSpacing,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    showTableOfContents,
  } = settings;

  const isModern = template === 'modern';

  // ── Colour Tokens ─────────────────────────────────────────────────────────
  const accentColor = isModern ? '#1a56db' : '#000000';
  const headingColor = isModern ? '#1a56db' : '#000000';

  // ── Front Sheet HTML ──────────────────────────────────────────────────────
  const guidesHtml = frontSheet.guides
    .filter((g) => g.name || g.designation)
    .map(
      (g) => `
      <div class="guide-entry">
        <div class="guide-name">${escHtml(g.name)}</div>
        <div class="guide-desig">${escHtml(g.designation)}</div>
      </div>`
    )
    .join('');

  const rawStudents = Array.isArray(frontSheet.students) && frontSheet.students.length > 0
    ? frontSheet.students
    : [{ name: '', usn: '' }, { name: '', usn: '' }, { name: '', usn: '' }];

  const studentRowsHtml = rawStudents
    .map(
      (s) => `
      <tr>
        <td>${escHtml(s.name) || '&nbsp;'}</td>
        <td>${escHtml(s.usn) || '&nbsp;'}</td>
      </tr>`
    )
    .join('');

  const logoSrc = customLogoUrl || '/college-logo.jpg';

  const frontSheetHtml = `
<section class="front-sheet" role="region" aria-label="Front Sheet">
  <div class="fs-inner-border">

    <div class="fs-top-block">
      <div class="fs-college-name">${escHtml(frontSheet.collegeName)}</div>
      <div class="fs-academic-year">${escHtml(frontSheet.academicYear)}</div>
      <div class="fs-logo-container">
        <img src="${logoSrc}" alt="College Logo" class="fs-logo" />
      </div>
    </div>

    <hr class="fs-divider" />

    <div class="fs-dept-block">
      <div class="fs-department">${escHtml(frontSheet.departmentName)}</div>
    </div>

    <div class="fs-course-semester">
      <div class="fs-course-line">Course Name&nbsp;:&nbsp;${escHtml(frontSheet.courseName)}</div>
      <div class="fs-semester-line">Semester&nbsp;:&nbsp;${escHtml(frontSheet.semester)}</div>
    </div>

    <div class="fs-title-block">
      <div class="fs-report-type">${escHtml(frontSheet.reportType)}</div>
      <div class="fs-project-title">${escHtml(frontSheet.projectTitle)}</div>
    </div>

    <div class="fs-guidance-block">
      <div class="fs-guidance-label">Under The Guidance of</div>
      <div class="fs-guides">
        ${guidesHtml}
      </div>
    </div>

    <div class="fs-submission-block">
      <div class="fs-submitted-label">Submitted By&nbsp;:</div>
      <table class="fs-student-table">
        <thead>
          <tr>
            <th style="width: 65%;">NAME</th>
            <th style="width: 35%;">USN</th>
          </tr>
        </thead>
        <tbody>
          ${studentRowsHtml}
        </tbody>
      </table>
    </div>

    <div class="fs-signature-block">
      <div class="fs-signature">Signature of Faculty&nbsp;:&nbsp;___________________________</div>
    </div>

  </div><!-- /.fs-inner-border -->
</section>
`;

  // ── TOC Placeholder ───────────────────────────────────────────────────────
  const tocHtml = showTableOfContents
    ? `
<section class="toc-section" data-paged-break="page">
  <h2 class="toc-heading">Table of Contents</h2>
  <nav class="toc" id="toc-container">
    ${sections
      .map(
        (sec, idx) => `
    <div class="toc-entry" data-target-id="${sec.id}">
      <span class="toc-number">${idx + 1}.</span>
      <span class="toc-title">${escHtml(sec.title)}</span>
      <span class="toc-dots"></span>
      <span class="toc-page" data-ref="${sec.id}">—</span>
    </div>`
      )
      .join('')}
  </nav>
</section>`
    : '';

  // ── Report Body ───────────────────────────────────────────────────────────
  let figureCounter = 0;
  const bodySections = sections
    .map((sec, idx) => {
      const breakClass = sec.pageBreakBefore ? ' page-break-before' : '';

      const imagesHtml = sec.images
        .map((img) => {
          figureCounter++;
          const sizeClass = `img-${img.size || 'medium'}`;
          const caption = img.caption
            ? `<figcaption>Figure ${figureCounter}: ${escHtml(img.caption)}</figcaption>`
            : `<figcaption>Figure ${figureCounter}</figcaption>`;
          return `
        <figure class="report-figure ${sizeClass}" id="fig-${figureCounter}">
          <img src="${img.blobUrl || img.dataUrl || ''}" alt="${escHtml(img.caption || `Figure ${figureCounter}`)}" />
          ${caption}
        </figure>`;
        })
        .join('');

      const paragraphs = sec.content
        .split('\n')
        .map((p) => (p.trim() ? `<p>${escHtml(p)}</p>` : ''))
        .join('');

      return `
<section class="report-section${breakClass}" id="${sec.id}" data-section-index="${idx + 1}">
  <h2 class="section-heading">${idx + 1}.&nbsp;${escHtml(sec.title)}</h2>
  <div class="section-body">
    ${paragraphs}
    ${imagesHtml}
  </div>
</section>`;
    })
    .join('\n');

  // ── Header & Footer Configuration ─────────────────────────────────────────
  const hf = report.headerFooter || {};
  const headerConfig = {
    enabled: true,
    text: frontSheet.projectTitle || '',
    alignment: 'right',
    showLine: true,
    lineThickness: 1,
    lineWidth: 70,
    lineAlignment: 'center',
    headerToLineSpacingMm: 3,
    lineToContentSpacingMm: 8,
    ...hf.header,
  };
  const footerConfig = {
    enabled: true,
    layout: 'left-center-page',
    leftText: frontSheet.departmentName || '',
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
    ...hf.footer,
  };
  const pageDecoration = {
    firstPageBorder: hf.pageDecoration?.firstPageBorder || hf.pageDecoration?.border || 'double',
    otherPagesBorder: hf.pageDecoration?.otherPagesBorder || hf.pageDecoration?.border || 'double',
  };

  // ── Reserve Layout Space in @page Margins ──
  let computedMarginTop = marginTop;
  if (headerConfig.enabled) {
    const minTopReq = 10 + 4 + (headerConfig.showLine ? (headerConfig.headerToLineSpacingMm || 2.5) : 0) + (headerConfig.lineToContentSpacingMm || 7);
    computedMarginTop = Math.max(marginTop, minTopReq);
  }

  let computedMarginBottom = marginBottom;
  if (footerConfig.enabled) {
    const minBottomReq = (footerConfig.showLine ? (footerConfig.contentToLineSpacingMm || 7) : 5) + (footerConfig.showLine ? (footerConfig.lineToTextSpacingMm || 2.5) : 0) + 4 + (footerConfig.bottomSpacingMm || 8);
    computedMarginBottom = Math.max(marginBottom, minBottomReq);
  }

  // ── Build Header @page CSS ──
  let pageTopLeft = 'none';
  let pageTopCenter = 'none';
  let pageTopRight = 'none';

  if (headerConfig.enabled && headerConfig.text) {
    const hTextStr = JSON.stringify(escHtml(headerConfig.text));
    if (headerConfig.alignment === 'left') pageTopLeft = hTextStr;
    else if (headerConfig.alignment === 'center') pageTopCenter = hTextStr;
    else pageTopRight = hTextStr;
  }

  // ── Build Footer @page CSS ──
  let pageBottomLeft = 'none';
  let pageBottomCenter = 'none';
  let pageBottomRight = 'none';

  if (footerConfig.enabled) {
    const layout = footerConfig.layout || 'left-center-page';
    const leftVal = footerConfig.leftText ? JSON.stringify(escHtml(footerConfig.leftText)) : 'none';
    const centerVal = footerConfig.centerText ? JSON.stringify(escHtml(footerConfig.centerText)) : 'none';
    const rightVal = footerConfig.rightText ? JSON.stringify(escHtml(footerConfig.rightText)) : 'none';
    const pageNumVal = footerConfig.showPageNumber ? 'counter(page)' : 'none';

    if (layout === 'left-page') {
      pageBottomLeft = leftVal;
      pageBottomCenter = 'none';
      pageBottomRight = pageNumVal;
    } else if (layout === 'left-center-page') {
      pageBottomLeft = leftVal;
      pageBottomCenter = centerVal;
      pageBottomRight = pageNumVal;
    } else if (layout === 'left-right') {
      pageBottomLeft = leftVal;
      pageBottomCenter = 'none';
      pageBottomRight = rightVal;
    } else if (layout === 'left-center-right') {
      pageBottomLeft = leftVal;
      pageBottomCenter = centerVal;
      pageBottomRight = rightVal;
    }
  }

  // Helper for line horizontal positioning CSS
  function getLinePositionCss(widthPct, align) {
    const width = Math.min(100, Math.max(10, parseInt(widthPct, 10) || 70));
    if (align === 'left') {
      return `width: ${width}%; left: 0; right: auto; margin-left: 0; margin-right: auto;`;
    } else if (align === 'right') {
      return `width: ${width}%; left: auto; right: 0; margin-left: auto; margin-right: 0;`;
    } else {
      return `width: ${width}%; left: 0; right: 0; margin-left: auto; margin-right: auto;`;
    }
  }

  // ── Build Line Styles for Paged.js ──
  const headerLineCss = headerConfig.enabled && headerConfig.showLine
    ? `
.pagedjs_margin-top::after {
  content: '';
  position: absolute;
  top: calc(10mm + 4mm + ${headerConfig.headerToLineSpacingMm || 2.5}mm);
  ${getLinePositionCss(headerConfig.lineWidth, headerConfig.lineAlignment)}
  border-bottom: ${headerConfig.lineThickness}px solid #000;
  pointer-events: none;
}`
    : '';

  const footerLineCss = footerConfig.enabled && footerConfig.showLine
    ? `
.pagedjs_margin-bottom::before {
  content: '';
  position: absolute;
  bottom: calc(${footerConfig.bottomSpacingMm || 8}mm + 4mm + ${footerConfig.lineToTextSpacingMm || 2.5}mm);
  ${getLinePositionCss(footerConfig.lineWidth, footerConfig.lineAlignment)}
  border-top: ${footerConfig.lineThickness}px solid #000;
  pointer-events: none;
}`
    : '';

  // ── Build Page Border CSS (First Page & Other Pages) ──
  let firstPageBorderCss = '';
  if (pageDecoration.firstPageBorder === 'none') {
    firstPageBorderCss = `
.front-sheet .fs-inner-border { border: none !important; }
.pagedjs_page.pagedjs_first_page .pagedjs_pagebox::before { display: none !important; }`;
  } else if (pageDecoration.firstPageBorder === 'single') {
    firstPageBorderCss = `
.front-sheet .fs-inner-border { border: 1.5px solid #000 !important; }
.pagedjs_page.pagedjs_first_page .pagedjs_pagebox::before { display: none !important; }`;
  } else {
    firstPageBorderCss = `
.front-sheet .fs-inner-border { border: 1px solid #000; }
.pagedjs_page.pagedjs_first_page .pagedjs_pagebox::before {
  content: '';
  position: absolute;
  top: 9mm;
  bottom: 9mm;
  left: 11mm;
  right: 11mm;
  border: 3px double #000;
  pointer-events: none;
  z-index: 9999;
}`;
  }

  let otherPagesBorderCss = '';
  if (pageDecoration.otherPagesBorder === 'none') {
    otherPagesBorderCss = `
.pagedjs_page:not(.pagedjs_first_page) .pagedjs_pagebox::before { display: none !important; }`;
  } else if (pageDecoration.otherPagesBorder === 'single') {
    otherPagesBorderCss = `
.pagedjs_page:not(.pagedjs_first_page) .pagedjs_pagebox::before {
  content: '';
  position: absolute;
  top: 9mm;
  bottom: 9mm;
  left: 11mm;
  right: 11mm;
  border: 1.5px solid #000;
  pointer-events: none;
  z-index: 9999;
}`;
  } else {
    otherPagesBorderCss = `
.pagedjs_page:not(.pagedjs_first_page) .pagedjs_pagebox::before {
  content: '';
  position: absolute;
  top: 9mm;
  bottom: 9mm;
  left: 11mm;
  right: 11mm;
  border: 3px double #000;
  pointer-events: none;
  z-index: 9999;
}`;
  }

  // ── Full HTML ─────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<base href="${typeof window !== 'undefined' && window.location ? window.location.origin : ''}/" />
<title>${escHtml(frontSheet.projectTitle)} — Report</title>
<style>
/* ════════════════════════════════════════════════════════
   @page rules — Paged.js reads these for layout
   ════════════════════════════════════════════════════════ */
@page {
  size: A4 portrait;
  margin-top:    ${computedMarginTop}mm;
  margin-bottom: ${computedMarginBottom}mm;
  margin-left:   ${marginLeft}mm;
  margin-right:  ${marginRight}mm;

  @top-left {
    content: ${pageTopLeft};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
  @top-center {
    content: ${pageTopCenter};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
  @top-right {
    content: ${pageTopRight};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
  @bottom-left {
    content: ${pageBottomLeft};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
  @bottom-center {
    content: ${pageBottomCenter};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
  @bottom-right {
    content: ${pageBottomRight};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
}

/* Front sheet page has zero margin so inner border aligns relative to page */
@page frontpage {
  size: A4 portrait;
  margin: 0;
  @top-left { content: none; }
  @top-center { content: none; }
  @top-right { content: none; }
  @bottom-left { content: none; }
  @bottom-center { content: none; }
  @bottom-right { content: none; }
}

@page :first {
  margin: 0;
  @top-left { content: none; }
  @top-center { content: none; }
  @top-right { content: none; }
  @bottom-left { content: none; }
  @bottom-center { content: none; }
  @bottom-right { content: none; }
}

/* Front sheet overrides to hide margin lines on first page */
.pagedjs_first_page .pagedjs_margin-top::after,
.pagedjs_first_page .pagedjs_margin-bottom::before {
  display: none !important;
}

/* Header and Footer lines */
${headerLineCss}
${footerLineCss}

/* Page Borders */
${firstPageBorderCss}
${otherPagesBorderCss}

/* ════════════════════════════════════════════════════════
   Base Typography
   ════════════════════════════════════════════════════════ */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Times New Roman', Times, serif;
  font-size: ${fontSize}pt;
  line-height: ${lineSpacing};
  color: #000;
  background: #fff;
}

/* ════════════════════════════════════════════════════════
   Front Sheet Layout
   ════════════════════════════════════════════════════════ */
.front-sheet {
  page: frontpage;
  page-break-after: always;
  break-after: page;
  width: 210mm;
  height: 297mm;
  padding: 12mm 14mm;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fs-inner-border {
  border: 1px solid #000;
  padding: 6mm 8mm;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

.fs-top-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2.5mm;
}

.fs-college-name {
  font-family: 'Times New Roman', Times, serif;
  font-size: 14.5pt;
  font-weight: bold;
  font-style: normal;
  color: #b91c1c;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  line-height: 1.25;
  margin-bottom: 2mm;
  text-align: center;
}

.fs-academic-year {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11.5pt;
  font-weight: bold;
  font-style: normal;
  color: #b91c1c;
  margin-bottom: 3mm;
  text-align: center;
}

.fs-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5mm;
}

.fs-logo {
  height: 25mm;
  width: auto;
  object-fit: contain;
}

.fs-divider {
  border: none;
  border-top: 1.5px solid #000;
  margin: 2mm 0 5mm 0;
  width: 100%;
}

.fs-dept-block {
  text-align: center;
  margin-bottom: 6mm;
}

.fs-department {
  font-family: 'Times New Roman', Times, serif;
  text-align: center;
  font-size: 12pt;
  font-weight: bold;
  font-style: normal;
  color: #b91c1c;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  line-height: 1.3;
}

.fs-course-semester {
  text-align: center;
  margin-bottom: 7mm;
  font-family: 'Times New Roman', Times, serif;
}

.fs-course-line {
  font-size: 11pt;
  font-weight: bold;
  font-style: normal;
  color: #000;
  line-height: 1.3;
  margin-bottom: 2mm;
  text-align: center;
}

.fs-semester-line {
  font-size: 11pt;
  font-weight: bold;
  font-style: normal;
  color: #000;
  line-height: 1.3;
  text-align: center;
}

.fs-title-block {
  text-align: center;
  margin-bottom: 7.5mm;
}

.fs-report-type {
  font-family: 'Times New Roman', Times, serif;
  font-size: 12pt;
  font-weight: bold;
  font-style: normal;
  color: #b91c1c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2.5mm;
  text-align: center;
}

.fs-project-title {
  font-family: 'Times New Roman', Times, serif;
  font-size: 14pt;
  font-weight: bold;
  font-style: normal;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.35;
  max-width: 90%;
  margin: 0 auto;
  text-align: center;
}

.fs-guidance-block {
  text-align: center;
  margin-bottom: 7.5mm;
}

.fs-guidance-label {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  font-weight: bold;
  font-style: normal;
  color: #b91c1c;
  margin-bottom: 3mm;
  text-align: center;
}

.fs-guides {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.5mm;
}

.guide-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.guide-name {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  font-weight: bold;
  font-style: normal;
  color: #000;
  line-height: 1.25;
}

.guide-desig {
  font-family: 'Times New Roman', Times, serif;
  font-size: 10.5pt;
  font-weight: normal;
  font-style: normal;
  color: #000;
  line-height: 1.25;
}

.fs-submission-block {
  width: 100%;
  text-align: center;
  margin-bottom: 6mm;
}

.fs-submitted-label {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  font-weight: bold;
  font-style: normal;
  color: #000;
  text-align: center;
  margin-bottom: 3.5mm;
}

.fs-student-table {
  width: 82%;
  margin: 0 auto;
  border-collapse: collapse;
  font-family: 'Times New Roman', Times, serif;
  font-size: 10.5pt;
}

.fs-student-table th,
.fs-student-table td {
  border: 1px solid #000;
  padding: 2.8mm 3.5mm;
  height: 7mm;
  color: #000;
}

.fs-student-table th {
  background: #f5f5f5;
  font-weight: bold;
  font-style: normal;
  text-align: center;
}

.fs-student-table td:first-child {
  text-align: left;
  padding-left: 4mm;
}

.fs-student-table td:last-child {
  text-align: center;
}

.fs-signature-block {
  margin-top: auto;
  margin-bottom: 4mm;
  text-align: center;
  width: 100%;
}

.fs-signature {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  font-weight: bold;
  font-style: normal;
  color: #000;
  text-align: center;
}



/* ════════════════════════════════════════════════════════
   Table of Contents
   ════════════════════════════════════════════════════════ */
.toc-section {
  page-break-after: always;
  break-after: page;
  padding: 0;
}

.toc-heading {
  font-family: 'Times New Roman', Times, serif;
  font-size: 16pt;
  font-weight: bold;
  font-style: normal;
  text-align: center;
  margin-bottom: 6mm;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${headingColor};
  border-bottom: 2px solid ${headingColor};
  padding-bottom: 2mm;
}

.toc-entry {
  display: flex;
  align-items: baseline;
  gap: 2mm;
  margin-bottom: 2mm;
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  font-weight: normal;
  font-style: normal;
}

.toc-number { min-width: 6mm; font-weight: normal; }

.toc-title { flex: 1; font-weight: normal; }

.toc-dots {
  flex: 1;
  border-bottom: 1px dotted #555;
  margin: 0 2mm 2px;
  min-width: 10mm;
}

.toc-page { min-width: 8mm; text-align: right; font-weight: bold; }

/* ════════════════════════════════════════════════════════
   Report Sections
   ════════════════════════════════════════════════════════ */
.report-section {
  margin-bottom: 6mm;
}

.page-break-before {
  page-break-before: always;
  break-before: page;
}

.section-heading {
  font-family: 'Times New Roman', Times, serif;
  font-size: ${Math.round(fontSize * 1.3)}pt;
  font-weight: bold;
  font-style: normal;
  color: ${headingColor};
  margin-bottom: 3mm;
  page-break-after: avoid;
  break-after: avoid;
  ${isModern ? `border-left: 3px solid ${accentColor}; padding-left: 3mm;` : ''}
}

.section-body p {
  font-family: 'Times New Roman', Times, serif;
  font-size: ${fontSize}pt;
  font-weight: normal;
  font-style: normal;
  line-height: ${lineSpacing};
  margin-bottom: 3mm;
  text-align: justify;
  orphans: 3;
  widows: 3;
}

/* ════════════════════════════════════════════════════════
   Figures
   ════════════════════════════════════════════════════════ */
.report-figure {
  margin: 4mm auto;
  text-align: center;
  page-break-inside: avoid;
  break-inside: avoid;
}

.report-figure img {
  display: block;
  width: 100%;       /* always fill the figure wrapper, which carries the size class */
  height: auto;      /* preserve aspect ratio */
  max-width: 100%;   /* safety guard – never exceed the figure boundary */
}

.report-figure figcaption {
  font-size: 10pt;
  font-style: italic;
  margin-top: 1mm;
}

/* Image size variants
   Width is set on the <figure> wrapper so the selected percentage always
   controls the rendered column width, regardless of the image's intrinsic
   dimensions. The <img> fills its wrapper at 100% and preserves aspect ratio. */
.img-small  { width: 40%;  }
.img-medium { width: 65%;  }
.img-large  { width: 85%;  }
.img-full   { width: 100%; }

/* ════════════════════════════════════════════════════════
   Paged.js generated elements
   ════════════════════════════════════════════════════════ */
.pagedjs_page_content { overflow: hidden; }

/* Modern template accent overrides */
${
  isModern
    ? `
.toc-heading { color: #1a56db; border-color: #1a56db; }
.section-heading { color: #1a56db; }
`
    : ''
}
</style>
</head>
<body>

${frontSheetHtml}

${tocHtml}

<article class="report-body" id="report-body">
${bodySections}
</article>

<!-- Paged.js polyfill (CDN) -->
<script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>

<script>
/* ────────────────────────────────────────────────────────
   Paged.js Hooks:
   1. After rendering is complete, read the page numbers that
      Paged.js has assigned to each section and write them into
      the TOC.
   ──────────────────────────────────────────────────────── */
class TocHook extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  afterRendered(pages) {
    const tocEntries = document.querySelectorAll('.toc-page[data-ref]');
    tocEntries.forEach((el) => {
      const targetId = el.getAttribute('data-ref');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      // Walk up to find the Paged.js page wrapper that contains this element
      let pageEl = targetEl.closest('.pagedjs_page');
      if (!pageEl) return;

      const pageNum = pageEl.getAttribute('data-page-number');
      el.textContent = pageNum || '—';
    });
  }
}

Paged.registerHandlers(TocHook);
</script>

</body>
</html>`;
}

/** Escape HTML special characters */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

