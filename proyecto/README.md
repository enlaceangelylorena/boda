# Web boda Ángel & Lorena

Proyecto Vite + React preparado para Vercel.

## Instalación local

```bash
npm install
npm run dev
```

## Variables en Vercel

Añade estas variables en **Settings > Environment Variables**:

```env
VITE_CLOUDINARY_CLOUD_NAME=gvw5lffp
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=home/fotos-evento
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycby0iX0uptXopbDu_P9VDb069Q6c9FIojEXNkcbktOXC28WOMRjyaDDR6geeJBV7-Aau/exec
```

## Carpetas incluidas

- `boda/assets/fotos`: para fotos locales si quieres añadirlas manualmente.
- `boda/assets/music`: para música local. Si añades `cancion.mp3`, puedes activarla en el código.

## Cloudinary

La subida se hace de forma firmada usando `/api/sign-cloudinary-upload`, por eso el `API_SECRET` nunca queda expuesto en el navegador.
Las fotos se guardan en la carpeta configurada: `home/fotos-evento`.

La galería lee recursos desde `/api/cloudinary-gallery`.
