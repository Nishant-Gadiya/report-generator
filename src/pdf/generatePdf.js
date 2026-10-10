/**
 * generatePdf.js
 *
 * Opens a new browser window with the Paged.js document.
 * The user then uses Ctrl+P / Cmd+P (or the browser's print dialog)
 * to save as PDF with "Background graphics" enabled.
 *
 * We also auto-trigger window.print() after Paged.js finishes rendering.
 */
import { buildPrintDocument } from './printTemplate.js';

/**
 * @param {object} report  The full report data object
 */
export function openPrintWindow(report) {
  const { settings } = report;
  const template = settings?.template || 'classic';

  const html = buildPrintDocument(report, template);

  const printWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes');
  if (!printWindow) {
    alert(
      'Pop-up blocked!\nPlease allow pop-ups for this site and try again.\n' +
        'In Chrome: address bar → Pop-ups blocked icon → Allow.'
    );
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
