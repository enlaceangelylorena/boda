/*
  CONFIGURACIÓN PRINCIPAL
  1) GitHub Pages no necesita Vercel.
  2) Para confirmar asistencia necesitas un Google Apps Script publicado como Web App.
  3) Para subir fotos a Cloudinary desde una web estática necesitas un Upload Preset UNSIGNED.
*/

window.BODA_CONFIG = {
  weddingDate: '2026-09-12T17:30:00+02:00',
  weddingDateText: 'Sábado, 12 de septiembre de 2026',

  ceremony: {
    time: '18:30 h',
    place: 'Iglesia / lugar de la ceremonia',
    mapUrl: 'https://maps.google.com/'
  },

  party: {
    time: '21:00 h',
    place: 'Finca / salón de celebración',
    mapUrl: 'https://maps.google.com/'
  },

  details: {
    dressCode: 'Código de vestimenta: elegante',
    giftInfo: 'Tu presencia será nuestro mejor regalo.'
  },

  googleSheetWebAppUrl: 'PEGA_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT',

  cloudinary: {
    enabled: false,
    cloudName: 'gvw5lffp',
    unsignedUploadPreset: 'TU_UPLOAD_PRESET_UNSIGNED',
    folder: 'boda/invitados',
    tag: 'boda-angel-lorena',

    /*
      Para que la galería pueda leer fotos sin backend:
      - Opción recomendada: usar el JSON de lista por tag de Cloudinary.
      - En Cloudinary debes permitir/crear listados por tag o generar una lista pública.
      - La URL suele ser:
        https://res.cloudinary.com/TU_CLOUD_NAME/image/list/boda-angel-lorena.json
    */
    listJsonUrl: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/list/boda-angel-lorena.json'
  },

  // Fotos locales de respaldo. Mete archivos en assets/fotos y añádelos aquí.
  localPhotos: [
    'assets/fotos/foto-1.jpg',
    'assets/fotos/foto-2.jpg',
    'assets/fotos/foto-3.jpg'
  ],

  galleryRefreshMs: 15000,
  carouselIntervalMs: 4500
};
