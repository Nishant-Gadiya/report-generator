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

import { renderBitCoverSheet, bitCoverSheetCss } from './bitCoverTemplate.js';

/**
 * @param {import('../data/defaultReport').Report} report
 * @param {string} template  'classic' | 'modern'
 * @param {string} [customLogoUrl]
 * @param {string} [coverTemplateOverride]
 * @returns {string} Full HTML document string
 */
export function buildPrintDocument(report, template = 'classic', customLogoUrl = '', coverTemplateOverride = '') {
  const { frontSheet, sections, settings } = report;
  const coverTemplate = coverTemplateOverride || settings?.coverTemplate || 'jssateb';
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

  const jssFrontSheetHtml = `
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

  const frontSheetHtml =
    coverTemplate === 'bit'
      ? renderBitCoverSheet(frontSheet, customLogoUrl)
      : jssFrontSheetHtml;

  const acknowledgement = report.acknowledgement;
  const abstract = report.abstract;
  const references = report.references;

  // Determine whether any prelim pages are enabled (for page-type assignments)
  const hasPrelim = !!(acknowledgement?.enabled || abstract?.enabled || showTableOfContents);

  // ── Acknowledgement HTML ──────────────────────────────────────────────────
  let acknowledgementHtml = '';
  if (acknowledgement?.enabled) {
    const ackHeading = acknowledgement.heading || 'Acknowledgement';
    const ackParas = (acknowledgement.content || '')
      .split('\n')
      .map((p) => (p.trim() ? `<p>${escHtml(p)}</p>` : ''))
      .join('');

    acknowledgementHtml = `
<section class="prelim-section" id="report-acknowledgement">
  <h2 class="prelim-heading">${escHtml(ackHeading)}</h2>
  <div class="prelim-body">
    ${ackParas}
  </div>
</section>`;
  }

  // ── Abstract HTML ─────────────────────────────────────────────────────────
  let abstractHtml = '';
  if (abstract?.enabled) {
    const absHeading = abstract.heading || 'Abstract';
    const absParas = (abstract.content || '')
      .split('\n')
      .map((p) => (p.trim() ? `<p>${escHtml(p)}</p>` : ''))
      .join('');

    abstractHtml = `
<section class="prelim-section" id="report-abstract">
  <h2 class="prelim-heading">${escHtml(absHeading)}</h2>
  <div class="prelim-body">
    ${absParas}
  </div>
</section>`;
  }

  // ── TOC Entries ───────────────────────────────────────────────────────────
  const tocEntries = [];

  if (acknowledgement?.enabled) {
    tocEntries.push({
      id: 'report-acknowledgement',
      number: '',
      title: acknowledgement.heading || 'Acknowledgement',
    });
  }

  if (abstract?.enabled) {
    tocEntries.push({
      id: 'report-abstract',
      number: '',
      title: abstract.heading || 'Abstract',
    });
  }

  sections.forEach((sec, idx) => {
    tocEntries.push({
      id: sec.id,
      number: `${idx + 1}.`,
      title: sec.title,
    });
  });

  if (references?.enabled) {
    tocEntries.push({
      id: 'report-references',
      number: '',
      title: references.heading || 'References',
    });
  }

  // ── TOC Placeholder ───────────────────────────────────────────────────────
  const tocHtml = showTableOfContents
    ? `
<section class="toc-section">
  <h2 class="toc-heading">Table of Contents</h2>
  <nav class="toc" id="toc-container">
    ${tocEntries
      .map(
        (entry) => `
    <div class="toc-entry" data-target-id="${entry.id}">
      <span class="toc-number">${entry.number || '&nbsp;'}</span>
      <span class="toc-title">${escHtml(entry.title)}</span>
      <span class="toc-dots"></span>
      <span class="toc-page" data-ref="${entry.id}">—</span>
    </div>`
      )
      .join('')}
  </nav>
</section>`
    : '';

  // ── References HTML ───────────────────────────────────────────────────────
  let referencesHtml = '';
  if (references?.enabled) {
    const refHeading = references.heading || 'References';
    const refItems = Array.isArray(references.items) ? references.items : [];
    const itemsHtml = refItems
      .map((item, idx) => {
        const itemHtml = formatReferenceHtml(item);
        return `
      <div class="reference-item">
        <span class="reference-num">[${idx + 1}]</span>
        <div class="reference-body">${itemHtml}</div>
      </div>`;
      })
      .join('\n');

    referencesHtml = `
<section class="report-section report-references" id="report-references">
  <h2 class="section-heading">${escHtml(refHeading)}</h2>
  <div class="references-list">
    ${itemsHtml || '<p style="color: #666; font-style: italic;">No references added.</p>'}
  </div>
</section>`;
  }

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
  // Prelim pages use lower-roman, main-content pages use decimal.
  // These variables hold the main-content (Arabic) page number expression.
  let pageBottomLeftPrelim = 'none';
  let pageBottomCenterPrelim = 'none';
  let pageBottomRightPrelim = 'none';

  if (footerConfig.enabled) {
    const layout = footerConfig.layout || 'left-center-page';
    const leftVal = footerConfig.leftText ? JSON.stringify(escHtml(footerConfig.leftText)) : 'none';
    const centerVal = footerConfig.centerText ? JSON.stringify(escHtml(footerConfig.centerText)) : 'none';
    const rightVal = footerConfig.rightText ? JSON.stringify(escHtml(footerConfig.rightText)) : 'none';
    const pageNumDecimal = footerConfig.showPageNumber ? 'counter(page)' : 'none';
    const pageNumRoman  = footerConfig.showPageNumber ? 'counter(page, lower-roman)' : 'none';

    if (layout === 'left-page') {
      pageBottomLeft = leftVal;
      pageBottomCenter = 'none';
      pageBottomRight = pageNumDecimal;
      pageBottomLeftPrelim = leftVal;
      pageBottomCenterPrelim = 'none';
      pageBottomRightPrelim = pageNumRoman;
    } else if (layout === 'left-center-page') {
      pageBottomLeft = leftVal;
      pageBottomCenter = centerVal;
      pageBottomRight = pageNumDecimal;
      pageBottomLeftPrelim = leftVal;
      pageBottomCenterPrelim = centerVal;
      pageBottomRightPrelim = pageNumRoman;
    } else if (layout === 'left-right') {
      pageBottomLeft = leftVal;
      pageBottomCenter = 'none';
      pageBottomRight = rightVal;
      pageBottomLeftPrelim = leftVal;
      pageBottomCenterPrelim = 'none';
      pageBottomRightPrelim = rightVal;
    } else if (layout === 'left-center-right') {
      pageBottomLeft = leftVal;
      pageBottomCenter = centerVal;
      pageBottomRight = rightVal;
      pageBottomLeftPrelim = leftVal;
      pageBottomCenterPrelim = centerVal;
      pageBottomRightPrelim = rightVal;
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

/* Preliminary pages (Acknowledgement, Abstract, TOC) use Roman numerals */
@page prelim {
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
    content: ${pageBottomLeftPrelim};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
  @bottom-center {
    content: ${pageBottomCenterPrelim};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
  @bottom-right {
    content: ${pageBottomRightPrelim};
    font-family: 'Times New Roman', Times, serif;
    font-size: 9pt;
    font-weight: normal;
    font-style: normal;
  }
}

/* Main content (report body + references) resets to Arabic page 1 */
@page main-content {
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
  page: prelim;
  page-break-before: always;
  break-before: page;
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
   Main-content wrapper: Arabic numbering restarts at 1
   ════════════════════════════════════════════════════════ */
.main-content-wrapper {
  page: main-content;
  counter-reset: page 0;
}

/* ════════════════════════════════════════════════════════
   Preliminary Sections (Acknowledgement & Abstract)
   ════════════════════════════════════════════════════════ */
.prelim-section {
  page: prelim;
  page-break-before: always;
  break-before: page;
  margin-bottom: 6mm;
}

.prelim-heading {
  font-family: 'Times New Roman', Times, serif;
  font-size: ${Math.round(fontSize * 1.35)}pt;
  font-weight: bold;
  font-style: normal;
  text-align: center;
  margin-bottom: 6mm;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${headingColor};
  page-break-after: avoid;
  break-after: avoid;
  ${isModern ? `border-bottom: 2px solid ${accentColor}; padding-bottom: 2mm;` : ''}
}

.prelim-body p {
  font-family: 'Times New Roman', Times, serif;
  font-size: ${fontSize}pt;
  font-weight: normal;
  font-style: normal;
  line-height: ${lineSpacing};
  margin-bottom: 3.5mm;
  text-align: justify;
  orphans: 3;
  widows: 3;
}

/* ════════════════════════════════════════════════════════
   References Section
   ════════════════════════════════════════════════════════ */
.report-references {
  page-break-before: always;
  break-before: page;
  margin-bottom: 6mm;
}

.references-list {
  display: flex;
  flex-direction: column;
  gap: 3.5mm;
}

.reference-item {
  display: flex;
  align-items: baseline;
  gap: 2.5mm;
  font-family: 'Times New Roman', Times, serif;
  font-size: ${fontSize}pt;
  line-height: ${lineSpacing};
  text-align: justify;
}

.reference-num {
  font-weight: bold;
  min-width: 7mm;
  flex-shrink: 0;
}

.reference-body {
  flex: 1;
}

.ref-link {
  color: #1a56db !important;
  text-decoration: underline !important;
  word-break: break-all;
}

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
.prelim-heading { color: #1a56db; border-color: #1a56db; }
`
    : ''
}

/* BIT Cover Sheet Template CSS */
${coverTemplate === 'bit' ? bitCoverSheetCss : ''}
</style>
</head>
<body>

${frontSheetHtml}

${acknowledgementHtml}

${abstractHtml}

${tocHtml}

<div class="main-content-wrapper">
<article class="report-body" id="report-body">
${bodySections}
</article>

${referencesHtml}
</div>

<!-- Paged.js polyfill (CDN) -->
<script src="https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js"></script>

<script>
/* ────────────────────────────────────────────────────────
   Prelim section IDs (Acknowledgement, Abstract, TOC itself)
   These pages display Roman-numeral page numbers in the TOC.
   ──────────────────────────────────────────────────────── */
const PRELIM_IDS = new Set(${JSON.stringify(
  [
    acknowledgement?.enabled ? 'report-acknowledgement' : null,
    abstract?.enabled        ? 'report-abstract'        : null,
  ].filter(Boolean)
)});

/* ────────────────────────────────────────────────────────
   Convert an integer to a lowercase Roman numeral string.
   ──────────────────────────────────────────────────────── */
function toRoman(n) {
  if (!n || n < 1) return '—';
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['m','cm','d','cd','c','xc','l','xl','x','ix','v','iv','i'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

/* ────────────────────────────────────────────────────────
   Paged.js hook: after layout, fill TOC page numbers.
   - Prelim entries (Ack, Abs): Roman numeral from the
     named-page counter on that Paged.js page.
   - Body / References entries: Arabic numeral.
   Paged.js resets its per-named-page counter independently,
   so we read data-page-number which tracks the page counter
   for the current named page context.
   ──────────────────────────────────────────────────────── */
class TocHook extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
  }

  afterRendered(pages) {
    // Build a map: element id -> Paged.js data-page-number (integer)
    const tocEls = document.querySelectorAll('.toc-page[data-ref]');
    tocEls.forEach((el) => {
      const targetId = el.getAttribute('data-ref');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const pageEl = targetEl.closest('.pagedjs_page');
      if (!pageEl) return;

      const rawNum = parseInt(pageEl.getAttribute('data-page-number'), 10);
      if (!rawNum) { el.textContent = '—'; return; }

      if (PRELIM_IDS.has(targetId)) {
        // Acknowledgement or Abstract: Roman
        el.textContent = toRoman(rawNum);
      } else {
        // TOC page itself is also prelim but points to body sections;
        // body sections and references show Arabic numbers.
        el.textContent = String(rawNum);
      }
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

/**
 * Format a reference item into an HTML citation string.
 * Supports 'book', 'paper', and 'website'.
 * URLs are rendered in blue with underline.
 */
export function formatReferenceHtml(ref) {
  if (!ref) return '';
  const parts = [];

  const author = ref.author ? ref.author.trim() : '';
  const year = ref.year ? String(ref.year).trim() : '';
  const title = ref.title ? ref.title.trim() : '';
  const publisher = ref.publisher ? ref.publisher.trim() : '';
  const url = ref.url ? ref.url.trim() : '';

  if (author) {
    parts.push(escHtml(author));
  }

  if (year) {
    parts.push(`(${escHtml(year)})`);
  }

  if (title) {
    if (ref.type === 'paper') {
      parts.push(`"${escHtml(title)}"`);
    } else {
      parts.push(`<i>${escHtml(title)}</i>`);
    }
  }

  if (publisher) {
    parts.push(escHtml(publisher));
  }

  let text = parts.join(' ');
  if (text && !text.endsWith('.')) {
    text += '.';
  }

  if (url) {
    const hrefUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const urlHtml = `<a href="${escHtml(hrefUrl)}" class="ref-link" style="color: #1a56db; text-decoration: underline;" target="_blank" rel="noopener noreferrer">${escHtml(url)}</a>`;
    text = text ? `${text} ${urlHtml}` : urlHtml;
  }

  return text;
}

