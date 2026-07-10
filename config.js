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
    dressCode: 'Se irá actualizando con mas información',
    giftInfo: 'Tu presencia será nuestro mejor regalo.'
  },

  googleSheetWebAppUrl: 'https://script.google.com/macros/s/AKfycby-8cLr6vHtbamZ8HrTloFcpEuvwysie47QPyrHCslN2WqiAJNoFUxP395L8Qc7cpxHGg/exec',

  cloudinary: {
    enabled: true, // Cambia a true cuando lo tengas configurado
    cloudName: 'gvw5lffp',
    unsignedUploadPreset: 'boda_unsigned',
    folder: 'fotos-evento',
    tag: 'boda-angel-lorena',
    listJsonUrl: 'https://res.cloudinary.com/gvw5lffp/image/list/boda-angel-lorena.json' // Pon tu cloudName real aquí también
  },
  galleryRefreshMs: 15000,
  carouselIntervalMs: 4500

  playlist: [
    'assets/music/cancion1.mp3',
    'assets/music/cancion2.mp3',
    'assets/music/cancion3.mp3'
  ]
}; // Único cierre correcto al final de la configuración
};
