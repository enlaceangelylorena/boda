# Web de boda - GitHub Pages

Web estática para boda de Ángel y Lorena, preparada para GitHub Pages.

## Estructura

```txt
boda-github-pages/
├── index.html
├── styles.css
├── app.js
├── config.js
├── apps-script-google-sheet.js
└── assets/
    ├── fotos/
    ├── img/
    └── music/
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `boda`.
2. Sube todos los archivos del ZIP a la raíz del repositorio.
3. En GitHub entra en `Settings > Pages`.
4. En `Build and deployment`, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guarda.
6. Tu web saldrá en una URL tipo:
   `https://TU_USUARIO.github.io/boda/`

## Configurar datos de la boda

Edita `config.js`:

```js
weddingDate: '2026-09-20T18:30:00+02:00',
weddingDateText: 'Sábado, 20 de septiembre de 2026'
```

También puedes cambiar lugares, horarios y enlaces de Google Maps.

## Confirmaciones en Google Sheets

La hoja debe tener estas cabeceras:

- A1: Fecha
- B1: Nombre
- C1: Apellidos
- D1: Telefono
- E1: Asistire
- F1: Alergias

Pasos:

1. Abre tu Google Sheet.
2. Ve a `Extensiones > Apps Script`.
3. Pega el contenido de `apps-script-google-sheet.js`.
4. Cambia `SHEET_NAME` si tu pestaña no se llama `Hoja 1`.
5. Pulsa `Implementar > Nueva implementación`.
6. Tipo: `Aplicación web`.
7. Ejecutar como: `Tú`.
8. Acceso: `Cualquiera`.
9. Copia la URL que termina en `/exec`.
10. Pégala en `config.js` aquí:

```js
googleSheetWebAppUrl: 'TU_URL_EXEC'
```

## Cloudinary para galería y subida de fotos

GitHub Pages no tiene backend. Para subir fotos desde la web directamente a Cloudinary necesitas un `Upload Preset` sin firma.

En `config.js` cambia:

```js
cloudinary: {
  enabled: true,
  cloudName: 'tu_cloud_name',
  unsignedUploadPreset: 'tu_upload_preset_unsigned',
  folder: 'boda/invitados',
  tag: 'boda-angel-lorena',
  listJsonUrl: 'https://res.cloudinary.com/tu_cloud_name/image/list/boda-angel-lorena.json'
}
```

Importante: para que la galería lea fotos automáticamente en una web estática, Cloudinary debe permitir una lista pública por tag o debes generar una lista pública equivalente. Si no se habilita esa lista, la subida puede funcionar, pero la lectura automática del álbum no.

## Fotos locales de respaldo

Puedes meter fotos manualmente en:

```txt
assets/fotos/
```

Y añadirlas en `config.js`:

```js
localPhotos: [
  'assets/fotos/foto-1.jpg',
  'assets/fotos/foto-2.jpg'
]
```

## Música

Mete tu música como:

```txt
assets/music/musica.mp3
```

El botón musical aparece abajo a la derecha. Por política de navegadores, la música no puede reproducirse sola hasta que el visitante pulse el botón.
