/**
 * GOOGLE APPS SCRIPT PARA CONFIRMACIONES
 *
 * Cabeceras esperadas en Google Sheet:
 * A1 Fecha
 * B1 Nombre
 * C1 Apellidos
 * D1 Telefono
 * E1 Asistire
 * F1 Alergias
 *
 * Cómo usar:
 * 1. Abre tu Google Sheet.
 * 2. Extensiones > Apps Script.
 * 3. Pega este código.
 * 4. Implementar > Nueva implementación > Aplicación web.
 * 5. Ejecutar como: Tú.
 * 6. Quién tiene acceso: Cualquiera.
 * 7. Copia la URL /exec y pégala en config.js en googleSheetWebAppUrl.
 */

const SHEET_NAME = 'Hoja 1'; // Cambia esto si tu pestaña tiene otro nombre.

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    const data = JSON.parse(e.postData.contents || '{}');

    if (sheet.getRange('A1').getValue() !== 'Fecha') {
      sheet.getRange('A1:F1').setValues([['Fecha', 'Nombre', 'Apellidos', 'Telefono', 'Asistire', 'Alergias']]);
    }

    sheet.appendRow([
      data.fecha || new Date(),
      data.nombre || '',
      data.apellidos || '',
      data.telefono || '',
      data.asistire || '',
      data.alergias || ''
    ]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

function doGet() {
  return jsonResponse({ ok: true, message: 'Web App activa' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
