/**
 * Web‑app entry point
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Program Selection')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** =====  CONFIG  ===== */
const SPREADSHEET_ID = '1BP16GCFseVXYhnklxwJWKgKpcXhYdvmaqMC3OxSf8-s';

/** =====  READ HELPERS  ===== */

/**
 * Return program list with capacities/reservations/availability
 * rows 2‑13  (A‑D)
 */
function getProgramData() {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('program');
  const raw = sh.getRange(2, 1, 12, 4).getValues();      // A2:D13
  return raw.map(r => ({
    program:   r[0],
    capacity:  r[1],
    reserved:  r[2],
    available: r[3]
  }));
}

/**
 * Look up a student by ID (column B of sheet “name”)
 */
function getStudentInfo(studentId) {
  const sh  = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('name');
  const rng = sh.getDataRange().getValues();              // assume header row 1
  const row = rng.find(r => String(r[1]).trim() === String(studentId).trim());

  if (!row) return { found: false };

  return {
    found  : true,
    title  : row[2],
    name   : row[3],
    surname: row[4]
  };
}

/**
 * Return all submitted rows from sheet “input” (skip header)
 */
function getInputData() {
  const sh   = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('input');
  const last = sh.getLastRow();
  if (last < 2) return [];                                 // no data yet
  const raw  = sh.getRange(2, 1, last - 1, 6).getValues(); // start row 2

  return raw.map(r => ({
   
    studentId: r[1],
    title    : r[2],
    name     : r[3],
    surname  : r[4],
    program  : r[5]
  }));
}

/** =====  WRITE HELPER  ===== */

/**
 * Append a submission to sheet “input”
 */
function submitData(studentId, title, name, surname, program) {
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('input');
  sh.appendRow([new Date(), studentId, title, name, surname, program]);
  return { success: true };
}
