const spreadSheet = SpreadsheetApp.openById(env().ENV_SPREADSHEET_ID);

const doGet = (e) => {
   const { parameter } = e;
   const {action, id} = parameter;

   if (action === 'list'){
    return getList(id);
   }
}

const doPost = (e) => {
  let data = JSON.parse(e.postData.contents);

   if (data.action === 'saveList')
      return saveList(data);
}

function getList(id) {
  const resultado = findById(id);
  return outputSuccess(id, resultado)
}

function findById(id) {
  const sheet = spreadSheet.getSheetByName(env().SHEETNAME);
  const col = "A";
  const textFinder = sheet.getRange(col + ":" + col).createTextFinder(id);
  textFinder.matchEntireCell(true);
  const encontrado = textFinder.findNext();

  if (!encontrado) return { foundId: false };

  const row = encontrado.getRow();
  const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  const idEvento = values[0];         // Coluna A
  const vacinasString = values[1];    // Coluna B (JSON em string)

  let vacinas = [];

  try {
    vacinas = JSON.parse(vacinasString);
  } catch (e) {
    Logger.log("Erro ao parsear JSON: " + e);
    return { foundId: false };
  }

  return {
    vacinas: vacinas,
    positionRow: row,
    foundId: true
  };
}

function saveList(data) {
  foundData = findById(data.id);

  if (foundData.foundId) {
    return editList(data.lista, data.id, foundData.positionRow);
  } else {
    return createList(data);
  }
}

function editList(editedList, id, columnPosition ) {
  const aba = spreadSheet.getSheetByName(env().SHEETNAME)
   aba.getRange(columnPosition, 2).setValue(editedList);
  return outputSuccess(`id ${id} alterado com sucesso`, "")
}

function createList(d) {
  try {
    const aba = spreadSheet.getSheetByName(env().SHEETNAME);
    aba.appendRow([d.id, d.lista ]);
    return outputSuccess('evento criado com sucesso!', {"id": d.id});
  } catch(e) {
    return outputError('erro ao salvar na planilha', e.message );
  }
}

function outputSuccess(message, content) {
  let output = ContentService.createTextOutput(), data = {};
  data = {
    "success": true,
    "message": message,
    "content": content
  };  
  output.setContent(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  return output;
}
