function env() {
  return {
    ID_SPREADSHEET:'',
    SHEETNAME_VACINAS: '',
    SHEETNAME_INFORMES: '',
  }
}

function doGet(e) {
  let op = e.parameter.action;
  let ss = SpreadsheetApp.open(DriveApp.getFileById(env().ID_SPREADSHEET));
  let sn = env().SHEETNAME_VACINAS;
  let sheet = ss.getSheetByName(sn);

  let sn_i = env().SHEETNAME_INFORMES;
  let sheet_i = ss.getSheetByName(sn_i);

  if (op == "read")
    return read_value(sheet);

  if (op == "informes")
    return informes(sheet_i);
}

function read_value(request, sheet) {
  let output = ContentService.createTextOutput(), data = {};
  data.content = readData_(request, sheet);
  output.setContent(JSON.stringify(data));
  return output;
}

function readData_(sheet) {
  try {    
    properties = getHeaderRow_(sheet);
    properties = properties.map(
      function (p) { 
        return p.replace(/\s+/g, '_'); 
      });

    let rows = getDataRows_(sheet),
      data = [];
    for (let r = 0, l = rows.length; r < l; r++) {
      let row = rows[r],
        record = {};
      for (let p in properties) {
        record[properties[p]] = row[p];
      }
      data.push(record);
    }
    return data;

  } catch (error) {
    return error;
  }
}

function getDataRows_(sheet) {
  try {
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  } catch (error) {
    return error;
  }
}

function getHeaderRow_(sheet) {
  try {
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  } catch (error) {
    return error;
  }
}

function informes(request) {
  let output = ContentService.createTextOutput(), data = {};
  data.content = readData_(request);
  output.setContent(JSON.stringify(data));
  return output;
}
