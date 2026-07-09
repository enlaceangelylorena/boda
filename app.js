const cfg = window.BODA_CONFIG || {};
let photos = [];
let currentIndex = 0;
let carouselTimer = null;

const $ = (selector) => document.querySelector(selector);
const carouselImage = $('#carouselImage');
const carouselEmpty = $('#carouselEmpty');
const thumbs = $('#thumbs');
const downloadPhoto = $('#downloadPhoto');
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxDownload = $('#lightboxDownload');

function initContent() {
  $('#weddingDateText').textContent = cfg.weddingDateText
  $('#ceremonyTime').textContent = cfg.ceremony?.time || '';
  $('#ceremonyPlace').textContent = cfg.ceremony?.place || '';
  $('#ceremonyMap').href = cfg.ceremony?.mapUrl || '#';
  $('#partyTime').textContent = cfg.party?.time || '';
  $('#partyPlace').textContent = cfg.party?.place || '';
  $('#partyMap').href = cfg.party?.mapUrl || '#';
  $('#dressCode').textContent = cfg.details?.dressCode || '';
  $('#giftInfo').textContent = cfg.details?.giftInfo || '';
}

function initMenu() {
  const btn = $('.menu-toggle');
  const links = $('.nav-links');
  btn?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

function initCountdown() {
  const target = new Date(cfg.weddingDate || Date.now()).getTime();
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    $('#days').textContent = String(days).padStart(2, '0');
    $('#hours').textContent = String(hours).padStart(2, '0');
    $('#minutes').textContent = String(minutes).padStart(2, '0');
    $('#seconds').textContent = String(seconds).padStart(2, '0');
  };
  tick();
  setInterval(tick, 1000);
}

function normalizeCloudinaryResources(data) {
  const resources = data.resources || [];
  return resources.map(item => {
    if (item.secure_url) return item.secure_url;
    const cloudName = cfg.cloudinary?.cloudName;
    const type = item.type || 'upload';
    const version = item.version ? `v${item.version}/` : '';
    const format = item.format ? `.${item.format}` : '';
    return `https://res.cloudinary.com/${cloudName}/image/${type}/${version}${item.public_id}${format}`;
  });
}

async function loadCloudinaryPhotos() {
  const c = cfg.cloudinary || {};
  if (!c.enabled || !c.listJsonUrl || c.listJsonUrl.includes('TU_CLOUD_NAME')) return [];
  const url = `${c.listJsonUrl}${c.listJsonUrl.includes('?') ? '&' : '?'}_=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo leer la galería de Cloudinary');
  const data = await res.json();
  return normalizeCloudinaryResources(data);
}

async function loadPhotos() {
  try {
    const cloudPhotos = await loadCloudinaryPhotos();
    photos = cloudPhotos.length ? cloudPhotos : (cfg.localPhotos || []);
  } catch (error) {
    console.warn(error);
    photos = cfg.localPhotos || [];
  }

  // Evita mostrar rutas locales que aún no existan visualmente como error crítico.
  renderGallery();
}

function renderGallery() {
  const hasPhotos = photos.length > 0;
  carouselImage.style.display = hasPhotos ? 'block' : 'none';
  carouselEmpty.style.display = hasPhotos ? 'none' : 'grid';
  if (!hasPhotos) {
    thumbs.innerHTML = '';
    downloadPhoto.removeAttribute('href');
    return;
  }
  currentIndex = Math.min(currentIndex, photos.length - 1);
  showPhoto(currentIndex, false);
  thumbs.innerHTML = photos.map((src, index) => `
    <button type="button" class="${index === currentIndex ? 'active' : ''}" data-index="${index}" aria-label="Ver foto ${index + 1}">
      <img src="${src}" alt="Miniatura ${index + 1}" loading="lazy">
    </button>
  `).join('');
  thumbs.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => showPhoto(Number(btn.dataset.index)));
  });
}

function showPhoto(index, restart = true) {
  if (!photos.length) return;
  currentIndex = (index + photos.length) % photos.length;
  const src = photos[currentIndex];
  carouselImage.src = src;
  downloadPhoto.href = src;
  lightboxImage.src = src;
  lightboxDownload.href = src;
  thumbs.querySelectorAll('button').forEach((btn, i) => btn.classList.toggle('active', i === currentIndex));
  if (restart) startCarousel();
}

function nextPhoto() { showPhoto(currentIndex + 1); }
function prevPhoto() { showPhoto(currentIndex - 1); }

function startCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    if (photos.length > 1) showPhoto(currentIndex + 1, false);
  }, cfg.carouselIntervalMs || 4500);
}

function initGalleryControls() {
  $('#nextPhoto').addEventListener('click', nextPhoto);
  $('#prevPhoto').addEventListener('click', prevPhoto);
  $('#expandPhoto').addEventListener('click', openLightbox);
  carouselImage.addEventListener('click', openLightbox);
  $('#closeLightbox').addEventListener('click', closeLightbox);
  $('#lightboxNext').addEventListener('click', nextPhoto);
  $('#lightboxPrev').addEventListener('click', prevPhoto);
  $('#refreshGallery').addEventListener('click', loadPhotos);
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
}

function openLightbox() {
  if (!photos.length) return;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

async function uploadToCloudinary(file) {
  const c = cfg.cloudinary || {};
  if (!c.enabled || !c.cloudName || !c.unsignedUploadPreset || c.cloudName.includes('TU_')) {
    throw new Error('Cloudinary no está configurado. Activa cloudinary.enabled y rellena cloudName/uploadPreset en config.js');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', c.unsignedUploadPreset);
  if (c.folder) formData.append('folder', c.folder);
  if (c.tag) formData.append('tags', c.tag);

  const endpoint = `https://api.cloudinary.com/v1_1/${c.cloudName}/image/upload`;
  const res = await fetch(endpoint, { method: 'POST', body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Error subiendo la foto');
  return data.secure_url;
}

function initUpload() {
  const input = $('#photoInput');
  const status = $('#uploadStatus');
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    status.textContent = 'Subiendo foto...';
    try {
      const url = await uploadToCloudinary(file);
      photos.unshift(url);
      currentIndex = 0;
      renderGallery();
      status.textContent = 'Foto subida correctamente.';
      setTimeout(loadPhotos, 2000);
    } catch (error) {
      status.textContent = error.message;
    } finally {
      input.value = '';
    }
  });
}

function initQR() {
  const canvas = $('#qrCanvas');
  const uploadUrl = `${location.origin}${location.pathname}#subir-foto`;
  if (window.QRCode) {
    QRCode.toCanvas(canvas, uploadUrl, {
      width: 220,
      margin: 1,
      color: { dark: '#3f5948', light: '#fffdf8' }
    });
  }
}

function initRSVP() {
  const form = $('#rsvpForm');
  const status = $('#formStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const webAppUrl = cfg.googleSheetWebAppUrl;
    if (!webAppUrl || webAppUrl.includes('PEGA_AQUI')) {
      status.textContent = 'Falta configurar la URL de Google Apps Script en config.js';
      return;
    }

    const fd = new FormData(form);
    const payload = {
      fecha: new Date().toLocaleString('es-ES'),
      nombre: fd.get('nombre')?.toString().trim(),
      apellidos: fd.get('apellidos')?.toString().trim(),
      telefono: fd.get('telefono')?.toString().trim(),
      asistire: fd.get('asistire'),
      alergias: fd.get('alergias')?.toString().trim()
    };

    status.textContent = 'Enviando confirmación...';
    try {
      const res = await fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      // no-cors no permite leer respuesta, pero evita bloqueos CORS en Apps Script.
      form.reset();
      status.textContent = 'Confirmación enviada correctamente. ¡Gracias!';
    } catch (error) {
      status.textContent = 'No se pudo enviar. Revisa la URL del Apps Script.';
    }
  });
}

function initMusic() {
  const btn = $('#musicBtn');
  const audio = $('#bgMusic');
  btn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        btn.classList.add('playing');
        btn.textContent = 'Ⅱ';
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.textContent = '♪';
      }
    } catch (_) {
      btn.textContent = '♪';
    }
  });
}

initContent();
initMenu();
initCountdown();
initGalleryControls();
initUpload();
initQR();
initRSVP();
initMusic();
loadPhotos();
startCarousel();
setInterval(loadPhotos, cfg.galleryRefreshMs || 15000);
