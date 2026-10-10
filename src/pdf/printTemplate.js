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
export function buildPrintDocument(report, template = 'classic') {
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
    .map(
      (g) => `
      <div class="guide-entry">
        <span class="guide-name">${escHtml(g.name)}</span>
        <span class="guide-desig">${escHtml(g.designation)}</span>
      </div>`
    )
    .join('');

  const studentRowsHtml = frontSheet.students
    .filter((s) => s.name || s.usn)
    .map(
      (s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escHtml(s.name)}</td>
        <td>${escHtml(s.usn)}</td>
      </tr>`
    )
    .join('');

  const frontSheetHtml = `
<section class="front-sheet" role="region" aria-label="Front Sheet">
  <div class="fs-outer-border">
    <div class="fs-inner-border">

      <div class="fs-header">
        <img src="/college-logo.png" alt="College Logo" class="fs-logo" />
        <div class="fs-college-name">${escHtml(frontSheet.collegeName)}</div>
        <div class="fs-academic-year">Academic Year: ${escHtml(frontSheet.academicYear)}</div>
      </div>

      <hr class="fs-divider" />

      <div class="fs-department">${escHtml(frontSheet.departmentName)}</div>

      <div class="fs-course-row">
        <span><strong>Course Name&nbsp;:</strong> ${escHtml(frontSheet.courseName)}</span>
        <span><strong>Semester&nbsp;:</strong> ${escHtml(frontSheet.semester)}</span>
      </div>

      <div class="fs-report-type">${escHtml(frontSheet.reportType)}</div>
      <div class="fs-project-title">${escHtml(frontSheet.projectTitle)}</div>

      <div class="fs-guidance-label">Under The Guidance of</div>
      <div class="fs-guides">
        ${guidesHtml}
      </div>

      <div class="fs-submitted-label">Submitted By&nbsp;:</div>
      <table class="fs-student-table">
        <thead>
          <tr>
            <th>Sl. No.</th>
            <th>Name</th>
            <th>USN</th>
          </tr>
        </thead>
        <tbody>
          ${studentRowsHtml || '<tr><td colspan="3">—</td></tr>'}
        </tbody>
      </table>

      <div class="fs-signature">Signature of Faculty&nbsp;: ___________________________</div>

    </div><!-- /.fs-inner-border -->
  </div><!-- /.fs-outer-border -->
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

  // ── Full HTML ─────────────────────────────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escHtml(frontSheet.projectTitle)} — Report</title>
<style>
/* ════════════════════════════════════════════════════════
   @page rules — Paged.js reads these for layout
   ════════════════════════════════════════════════════════ */
@page {
  size: A4 portrait;
  margin-top:    ${marginTop}mm;
  margin-bottom: ${marginBottom}mm;
  margin-left:   ${marginLeft}mm;
  margin-right:  ${marginRight}mm;

  @bottom-center {
    content: counter(page);
    font-family: 'Times New Roman', Times, serif;
    font-size: 10pt;
  }
}

/* First page (front sheet) — no page number */
@page :first {
  @bottom-center { content: none; }
}

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
   Front Sheet
   ════════════════════════════════════════════════════════ */
.front-sheet {
  page-break-after: always;
  break-after: page;
  height: 100vh;          /* fill one A4 page */
  display: flex;
  align-items: stretch;
}

.fs-outer-border {
  border: 4px double #000;
  margin: 8mm;
  flex: 1;
  display: flex;
  align-items: stretch;
}

.fs-inner-border {
  border: 1.5px solid #000;
  margin: 3mm;
  flex: 1;
  padding: 6mm 8mm;
  display: flex;
  flex-direction: column;
  gap: 4mm;
}

.fs-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2mm;
  text-align: center;
}

.fs-logo {
  height: 20mm;
  width: auto;
  object-fit: contain;
}

.fs-college-name {
  font-size: 13pt;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.fs-academic-year {
  font-size: 11pt;
  font-weight: bold;
}

.fs-divider {
  border: none;
  border-top: 1px solid #000;
  margin: 1mm 0;
}

.fs-department {
  text-align: center;
  font-size: 12pt;
  font-weight: bold;
  text-transform: uppercase;
}

.fs-course-row {
  display: flex;
  justify-content: space-between;
  font-size: 11pt;
  gap: 4mm;
}

.fs-report-type {
  text-align: center;
  font-size: 12pt;
  font-weight: bold;
  margin-top: 2mm;
}

.fs-project-title {
  text-align: center;
  font-size: 13pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.fs-guidance-label {
  text-align: center;
  font-size: 11pt;
  font-weight: bold;
  margin-top: 2mm;
}

.fs-guides {
  display: flex;
  justify-content: center;
  gap: 12mm;
  flex-wrap: wrap;
}

.guide-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11pt;
}

.guide-name { font-weight: bold; }
.guide-desig { font-style: italic; }

.fs-submitted-label {
  font-size: 11pt;
  font-weight: bold;
  margin-top: 2mm;
}

.fs-student-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11pt;
}

.fs-student-table th,
.fs-student-table td {
  border: 1px solid #000;
  padding: 1.5mm 3mm;
  text-align: left;
}

.fs-student-table th {
  background: #f0f0f0;
  font-weight: bold;
  text-align: center;
}

.fs-signature {
  font-size: 11pt;
  font-weight: bold;
  margin-top: auto;
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
  font-size: 16pt;
  font-weight: bold;
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
  font-size: 11pt;
}

.toc-number { min-width: 6mm; }

.toc-title { flex: 1; }

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
  font-size: ${Math.round(fontSize * 1.3)}pt;
  font-weight: bold;
  color: ${headingColor};
  margin-bottom: 3mm;
  page-break-after: avoid;
  break-after: avoid;
  ${isModern ? `border-left: 3px solid ${accentColor}; padding-left: 3mm;` : ''}
}

.section-body p {
  margin-bottom: 2mm;
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
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

.report-figure figcaption {
  font-size: 10pt;
  font-style: italic;
  margin-top: 1mm;
}

/* Image size variants */
.img-small  img { max-width: 40%; }
.img-medium img { max-width: 65%; }
.img-large  img { max-width: 85%; }
.img-full   img { max-width: 100%; }

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
