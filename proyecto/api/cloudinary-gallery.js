export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'gvw5lffp';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || 'home/fotos-evento';

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(200).json({ ok: true, photos: [] });
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const expression = encodeURIComponent(`folder:${folder} AND resource_type:image`);
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search?expression=${expression}&sort_by[]=created_at:desc&max_results=60`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ ok: false, error: text });
    }

    const data = await response.json();
    const photos = (data.resources || []).map((item) => ({
      id: item.asset_id,
      publicId: item.public_id,
      url: item.secure_url,
      width: item.width,
      height: item.height,
      createdAt: item.created_at
    }));

    return res.status(200).json({ ok: true, photos });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || 'Error leyendo Cloudinary' });
  }
}
