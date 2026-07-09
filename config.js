/*
  CONFIGURACIÓN PRINCIPAL
  1) GitHub Pages no necesita Vercel.
  2) Para confirmar asistencia necesitas un Google Apps Script publicado como Web App.
  3) Para subir fotos a Cloudinary desde una web estática necesitas un Upload Preset UNSIGNED.
*/

window.BODA_CONFIG = {
  weddingDate: '2026-09-12T17:30:00+02:00', // Modifica aquí la fecha del contador
  weddingDateText: 'Sábado, 12 de septiembre de 2026',

  ceremony: {
    time: '17:30 h',                  // <--- Cambia aquí la hora de la ceremonia
    place: 'Tu iglesia o lugar',
    mapUrl: 'https://maps.google.com/...'
  },

  party: {
    time: '20:00 h',                  // <--- Cambia aquí la hora del banquete/fiesta
    place: 'Tu finca o salón',
    mapUrl: 'https://maps.google.com/...'
  },
  // ... resto de tu configuración
};

  details: {
    dressCode: 'Código de vestimenta: elegante',
    giftInfo: 'Tu presencia será nuestro mejor regalo.'
  },

  googleSheetWebAppUrl: 'https://script.google.com/macros/s/AKfycby-8cLr6vHtbamZ8HrTloFcpEuvwysie47QPyrHCslN2WqiAJNoFUxP395L8Qc7cpxHGg/exec',

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
