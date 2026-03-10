/**
 * Google Apps Script – Survey Response Collector
 * ================================================
 * HOW TO SET UP (one-time, ~3 minutes):
 *
 *  1. Open your Google Sheet (create a new blank one at sheets.google.com).
 *  2. Click  Extensions → Apps Script.
 *  3. Delete any default code, then paste THIS entire file.
 *  4. Click  Save  (floppy-disk icon).
 *  5. Click  Deploy → New deployment.
 *  6. Under "Select type" choose  Web app.
 *  7. Set:
 *       Description : Survey collector
 *       Execute as  : Me
 *       Who has access : Anyone
 *  8. Click  Deploy, then  Authorize access → Allow.
 *  9. Copy the  Web app URL  shown (looks like https://script.google.com/macros/s/…/exec).
 * 10. Open Graduate_Underemployment_Survey.html and replace the placeholder:
 *       const SCRIPT_URL = 'PASTE_YOUR_SCRIPT_URL_HERE';
 *     with your actual URL.
 * 11. Save the HTML and re-upload it to GitHub (or just edit it online in the repo).
 *
 * Each survey submission will appear as a new row in the sheet.
 * To get a CSV: File → Download → Comma-separated values (.csv)
 */

// ── Column order in the spreadsheet ─────────────────────────────────────────
var HEADERS = [
  'timestamp',
  // Section 1 – Screening
  'employed', 'qualified', 'grad_year',
  // Section 2 – Demographics
  'age', 'gender', 'province', 'qualification', 'field', 'institution', 'english',
  // Section 3 – Employment profile
  'sector', 'job_title', 'emp_type', 'income', 'time_to_job',
  'job_related', 'edu_required', 'hours_pw', 'more_hours',
  // Section 4 – Subjective underemployment (1–5)
  'ue1','ue2','ue3','ue4','ue5','ue6','ue7','ue8','ue9','ue10',
  // Section 5 – Psychological contract breach (1–5)
  'pcb1','pcb2','pcb3','pcb4','pcb5','pcb6',
  // Section 6 – Work engagement (1–5)
  'we1','we2','we3','we4','we5','we6','we7','we8',
  // Section 7 – Migration intention (1–5)
  'mi1','mi2','mi3','mi4','mi5','mi6',
  // Section 8 – Turnover intention (1–5, optional)
  'ti1','ti2','ti3',
  // Section 9 – Open-ended
  'oe1','oe2','oe3','oe4'
];

// ── POST handler – receives one survey submission ────────────────────────────
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    // Write header row on first submission
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      // Bold + freeze the header row
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Map data to the fixed column order
    var row = HEADERS.map(function (col) {
      return (data[col] !== undefined && data[col] !== null) ? data[col] : '';
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET handler – health-check (optional) ───────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Survey collector is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
