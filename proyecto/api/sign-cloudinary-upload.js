import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'gvw5lffp';
  const folder = process.env.CLOUDINARY_FOLDER || 'home/fotos-evento';

  if (!apiSecret || !apiKey || !cloudName) {
    return res.status(500).json({ ok: false, error: 'Faltan variables de entorno de Cloudinary en Vercel.' });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex');

  return res.status(200).json({
    ok: true,
    cloudName,
    apiKey,
    folder,
    timestamp,
    signature
  });
}
