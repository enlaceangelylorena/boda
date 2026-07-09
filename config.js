/* CONFIGURACIÓN PRINCIPAL */
window.BODA_CONFIG = {
  weddingDate: '2026-09-12T17:00:00+02:00', 
  weddingDateText: 'Sábado, 12 de septiembre de 2026',

  ceremony: {
    time: '17:00 h',                  
    place: 'Santuario de la Cinta',
    mapUrl: 'https://maps.app.goo.gl/RGfBprUt7WtsWrnm7'
  },

  party: {
    time: '19:30 h',                  
    place: 'Restaurante "El Bosque"',
    mapUrl: 'https://maps.app.goo.gl/1LjwntpNLyXADbha9'
  },

  details: {
    dressCode: 'Sobre minimo 4.500 € + IVA "comision... comision...',
    giftInfo: 'Tu presencia será nuestro mejor regalo.'
  },

  googleSheetWebAppUrl: 'https://script.google.com/macros/s/AKfycby-8cLr6vHtbamZ8HrTloFcpEuvwysie47QPyrHCslN2WqiAJNoFUxP395L8Qc7cpxHGg/exec',

  cloudinary: {
    enabled: false, // Cambia a true cuando lo tengas configurado
    cloudName: 'gvw5lffp',
    unsignedUploadPreset: 'TU_UPLOAD_PRESET_UNSIGNED',
    folder: 'boda/invitados',
    tag: 'boda-angel-lorena',
    listJsonUrl: 'https://res.cloudinary.com/gvw5lffp/image/list/boda-angel-lorena.json' // Pon tu cloudName real aquí también
  },

  // Fotos locales de respaldo
  localPhotos: [
    'assets/fotos/foto-1.jpeg',
    'assets/fotos/foto-2.jpg',
    'assets/fotos/foto-3.jpg'
  ],

  galleryRefreshMs: 15000,
  carouselIntervalMs: 4500
}; // Único cierre correcto al final de la configuración
