/**
 * ZUMA Store Map - Google Apps Script API
 *
 * CARA SETUP:
 * 1. Buka Google Sheets baru
 * 2. Buat 3 sheet dengan nama: "Toko", "Warehouse", "Bandara"
 * 3. Buka Extensions > Apps Script
 * 4. Copy-paste semua kode ini
 * 5. Klik Deploy > New deployment > Web app
 * 6. Execute as: Me, Who has access: Anyone
 * 7. Copy URL deployment, paste di website
 */

// Main handler
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();

  const data = {
    stores: getSheetData(sheet, 'Toko'),
    warehouses: getSheetData(sheet, 'Warehouse'),
    airports: getAirportData(sheet, 'Bandara')
  };

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Get data from sheet
function getSheetData(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.filter(row => row[0]).map((row, index) => {
    const obj = { id: index + 1 };
    headers.forEach((header, i) => {
      const key = header.toLowerCase().replace(/\s+/g, '_');
      let value = row[i];

      // Convert lat/lng to numbers
      if (key === 'latitude' || key === 'longitude') {
        value = parseFloat(value) || 0;
      }

      // Map to expected keys
      if (key === 'latitude') obj.lat = value;
      else if (key === 'longitude') obj.lng = value;
      else if (key === 'nama') obj.name = value;
      else if (key === 'cabang') obj.branch = value;
      else if (key === 'alamat') obj.address = value;
      else if (key === 'kota') obj.city = value;
      else if (key === 'area') obj.area = value;
      else if (key === 'tipe') obj.type = value;
      else obj[key] = value;
    });
    return obj;
  });
}

// Get airport/reference data
function getAirportData(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) return {};

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return {};

  const rows = data.slice(1);
  const refs = {};

  rows.forEach(row => {
    const branch = row[0];
    if (branch) {
      refs[branch] = {
        name: row[1] || '',
        lat: parseFloat(row[2]) || 0,
        lng: parseFloat(row[3]) || 0
      };
    }
  });

  return refs;
}

// Test function
function testAPI() {
  const result = doGet();
  Logger.log(result.getContent());
}
