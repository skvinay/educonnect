/**
 * EduConnect Registration Web App (Google Apps Script)
 *
 * Deploy as Web App (Anyone with link).
 * You can keep these IDs here or move them to Script Properties.
 */

const SHEET_MAP = {
  student: {
    id: "1DtzuBEDqtDHuGaov1ib8Q81Eczng4xgf76wZpZehpKs",
    sheetName: "Sheet1",
  },
  influencer: {
    id: "1tqi1J77JyHRdFL6iTyjtlttAfGsZJgPqVwYtCtUn3oA",
    sheetName: "Sheet1",
  },
  exhibitor: {
    id: "1lfdXvxS4ofbscAntWUYx7rkCjwgSkZXKBqqnkHY4mco",
    sheetName: "Sheet1",
  },
};

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: "error", message: "Missing request body" });
    }

    const data = JSON.parse(e.postData.contents);
    const formType = String(data.form_type || "").trim();

    if (!SHEET_MAP[formType]) {
      return jsonResponse({ status: "error", message: "Invalid form_type" });
    }

    if (data.honeypot && String(data.honeypot).trim()) {
      return jsonResponse({ status: "error", message: "Spam detected" });
    }

    const target = SHEET_MAP[formType];
    const sheet = SpreadsheetApp.openById(target.id).getSheetByName(target.sheetName);

    if (!sheet) {
      return jsonResponse({ status: "error", message: "Sheet not found" });
    }

    const payload = { ...data };
    delete payload.honeypot;

    const keys = Object.keys(payload);
    const values = keys.map((key) => normalizeValue(payload[key]));

    // Optional header bootstrap
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["timestamp", ...keys]);
    }

    sheet.appendRow([new Date(), ...values]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return jsonResponse({ status: "error", message: error && error.message ? error.message : "Unknown error" });
  }
}

function normalizeValue(value) {
  if (Object.prototype.toString.call(value) === "[object Array]") {
    return value.join(", ");
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  return value == null ? "" : value;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
