import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Camera, CheckCircle2, Heart, ImagePlus, Mail, MapPin, Music2, PartyPopper, UploadCloud, UsersRound } from 'lucide-react';
import './styles.css';

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycby0iX0uptXopbDu_P9VDb069Q6c9FIojEXNkcbktOXC28WOMRjyaDDR6geeJBV7-Aau/exec';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'gvw5lffp';

const fallbackPhotos = [
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=80'
];

function App() {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState(0);
  const [uploadState, setUploadState] = useState('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [formState, setFormState] = useState('idle');
  const [formMessage, setFormMessage] = useState('');
  const fileRef = useRef(null);

  const gallery = useMemo(() => (photos.length ? photos.map(p => p.url) : fallbackPhotos), [photos]);

  useEffect(() => {
    fetch('/api/cloudinary-gallery')
      .then(r => r.json())
      .then(data => {
        if (data.ok && Array.isArray(data.photos)) setPhotos(data.photos);
      })
      .catch(() => setPhotos([]));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActive(prev => (prev + 1) % gallery.length), 4200);
    return () => clearInterval(timer);
  }, [gallery.length]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormState('loading');
    setFormMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.fecha_envio = new Date().toISOString();

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      form.reset();
      setFormState('success');
      setFormMessage('Confirmación enviada correctamente. ¡Gracias por acompañarnos!');
    } catch (error) {
      setFormState('error');
      setFormMessage('No se ha podido enviar. Revisa la URL del Apps Script o inténtalo de nuevo.');
    }
  }

  async function uploadPhoto(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadState('error');
      setUploadMessage('Selecciona una imagen válida.');
      return;
    }

    setUploadState('loading');
    setUploadMessage('Subiendo foto...');

    try {
      const signResponse = await fetch('/api/sign-cloudinary-upload', { method: 'POST' });
      const signData = await signResponse.json();
      if (!signData.ok) throw new Error(signData.error || 'No se pudo firmar la subida');

      const data = new FormData();
      data.append('file', file);
      data.append('api_key', signData.apiKey);
      data.append('timestamp', signData.timestamp);
      data.append('signature', signData.signature);
      data.append('folder', signData.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName || CLOUD_NAME}/image/upload`;
      const uploadResponse = await fetch(uploadUrl, { method: 'POST', body: data });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.error?.message || 'Cloudinary rechazó la foto');

      setPhotos(prev => [{ id: uploadData.asset_id, url: uploadData.secure_url }, ...prev]);
      setActive(0);
      setUploadState('success');
      setUploadMessage('Foto subida correctamente. Ya aparece en la galería.');
      if (fileRef.current) fileRef.current.value = '';
    } catch (error) {
      setUploadState('error');
      setUploadMessage(error.message || 'No se pudo subir la foto.');
    }
  }

  return (
    <main>
      <nav className="navbar">
        <a href="#inicio">Inicio</a>
        <a href="#galeria">Galería</a>
        <a href="#subir">Subir foto</a>
        <a href="#confirmacion">Confirmación</a>
      </nav>

      <section id="inicio" className="hero section-shell">
        <div className="watercolor one" />
        <div className="watercolor two" />
        <p className="eyebrow">Nos casamos</p>
        <h1>Ángel <span>&</span> Lorena</h1>
        <p className="subtitle">Una celebración llena de amor, familia, amigos y momentos para recordar siempre.</p>
        <div className="hero-actions">
          <a href="#confirmacion" className="btn primary"><CheckCircle2 size={18}/> Confirmar asistencia</a>
          <a href="#subir" className="btn ghost"><Camera size={18}/> Subir fotos</a>
        </div>
      </section>

      <section className="details section-shell">
        <article><Heart/><h3>Con mucho cariño</h3><p>Queremos que esta web sea un pequeño rincón para compartir nuestra historia y vuestros recuerdos.</p></article>
        <article><MapPin/><h3>El gran día</h3><p>Añade aquí la fecha, hora, ceremonia, convite y ubicación exacta cuando lo tengas cerrado.</p></article>
        <article><Music2/><h3>Música y ambiente</h3><p>La carpeta <strong>boda/assets/music</strong> queda preparada para añadir una canción de fondo.</p></article>
      </section>

      <section id="galeria" className="gallery section-shell">
        <div className="section-title">
          <p className="eyebrow">Galería compartida</p>
          <h2>Nuestros recuerdos</h2>
          <p>Las fotos subidas por los invitados aparecerán aquí automáticamente al estar conectadas con Cloudinary.</p>
        </div>

        <div className="carousel-card">
          <button aria-label="Foto anterior" onClick={() => setActive((active - 1 + gallery.length) % gallery.length)}>‹</button>
          <img src={gallery[active]} alt="Foto de la boda" />
          <button aria-label="Foto siguiente" onClick={() => setActive((active + 1) % gallery.length)}>›</button>
          <div className="dots">
            {gallery.map((_, index) => <span key={index} className={index === active ? 'dot active' : 'dot'} />)}
          </div>
        </div>
      </section>

      <section id="subir" className="upload section-shell">
        <div>
          <p className="eyebrow">Participa</p>
          <h2>Sube tus fotos</h2>
          <p>Comparte tus mejores momentos de la boda. Las imágenes se guardarán en Cloudinary dentro de <strong>home/fotos-evento</strong>.</p>
        </div>
        <div className="upload-box" onClick={() => fileRef.current?.click()}>
          <UploadCloud size={42}/>
          <h3>Haz click para seleccionar una foto</h3>
          <p>JPG, PNG o WEBP. Se subirá directamente a Cloudinary.</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={e => uploadPhoto(e.target.files?.[0])} hidden />
          <button className="btn primary" type="button"><ImagePlus size={18}/> Subir foto</button>
          {uploadMessage && <p className={`message ${uploadState}`}>{uploadMessage}</p>}
        </div>
      </section>

      <section id="confirmacion" className="rsvp section-shell">
        <div className="section-title">
          <p className="eyebrow">RSVP</p>
          <h2>Confirmación de asistencia</h2>
          <p>Rellena el formulario para confirmar si podrás acompañarnos.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Nombre y apellidos<input name="nombre" required placeholder="Tu nombre completo" /></label>
          <label>Teléfono<input name="telefono" type="tel" placeholder="Tu teléfono" /></label>
          <label>Correo electrónico<input name="email" type="email" placeholder="tu@email.com" /></label>
          <label>¿Asistirás?
            <select name="asistencia" required defaultValue="">
              <option value="" disabled>Selecciona una opción</option>
              <option>Sí, asistiré</option>
              <option>No podré asistir</option>
            </select>
          </label>
          <label>Número de acompañantes<input name="acompanantes" type="number" min="0" defaultValue="0" /></label>
          <label>Menú especial / alergias<textarea name="alergias" placeholder="Indica alergias, intolerancias o menú infantil" /></label>
          <label>Mensaje para los novios<textarea name="mensaje" placeholder="Déjales unas palabras bonitas" /></label>
          <button className="btn primary" disabled={formState === 'loading'} type="submit"><Mail size={18}/> {formState === 'loading' ? 'Enviando...' : 'Enviar confirmación'}</button>
          {formMessage && <p className={`message ${formState}`}>{formMessage}</p>}
        </form>
      </section>

      <footer>
        <UsersRound size={18}/>
        <span>Ángel & Lorena · Gracias por formar parte de nuestra historia</span>
        <PartyPopper size={18}/>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
