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
  if ($('#weddingDateText')) $('#weddingDateText').textContent = cfg.weddingDateText || '';
  if ($('#ceremonyTime')) $('#ceremonyTime').textContent = cfg.ceremony?.time || '';
  if ($('#ceremonyPlace')) $('#ceremonyPlace').textContent = cfg.ceremony?.place || '';
  if ($('#ceremonyMap')) $('#ceremonyMap').href = cfg.ceremony?.mapUrl || '#';
  if ($('#partyTime')) $('#partyTime').textContent = cfg.party?.time || '';
  if ($('#partyPlace')) $('#partyPlace').textContent = cfg.party?.place || '';
  if ($('#partyMap')) $('#partyMap').href = cfg.party?.mapUrl || '#';
  
  // Eliminadas las líneas de dressCode y giftInfo para evitar errores fatales en consola
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
    
    if ($('#days')) $('#days').textContent = String(days).padStart(2, '0');
    if ($('#hours')) $('#hours').textContent = String(hours).padStart(2, '0');
    if ($('#minutes')) $('#minutes').textContent = String(minutes).padStart(2, '0');
    if ($('#seconds')) $('#seconds').textContent = String(seconds).padStart(2, '0');
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
  renderGallery();
}

function renderGallery() {
  if (!carouselImage || !carouselEmpty) return;
  const hasPhotos = photos.length > 0;
  carouselImage.style.display = hasPhotos ? 'block' : 'none';
  carouselEmpty.style.display = hasPhotos ? 'none' : 'grid';
  if (!hasPhotos) {
    if (thumbs) thumbs.innerHTML = '';
    if (downloadPhoto) downloadPhoto.removeAttribute('href');
    return;
  }
  currentIndex = Math.min(currentIndex, photos.length - 1);
  showPhoto(currentIndex, false);
  
  if (thumbs) {
    thumbs.innerHTML = photos.map((src, index) => `
      <button type="button" class="${index === currentIndex ? 'active' : ''}" data-index="${index}" aria-label="Ver foto ${index + 1}">
        <img src="${src}" alt="Miniatura ${index + 1}" loading="lazy">
      </button>
    `).join('');
    thumbs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => showPhoto(Number(btn.dataset.index)));
    });
  }
}

function showPhoto(index, restart = true) {
  if (!photos.length) return;
  currentIndex = (index + photos.length) % photos.length;
  const src = photos[currentIndex];
  if (carouselImage) carouselImage.src = src;
  if (downloadPhoto) downloadPhoto.href = src;
  if (lightboxImage) lightboxImage.src = src;
  if (lightboxDownload) lightboxDownload.href = src;
  
  if (thumbs) {
    thumbs.querySelectorAll('button').forEach((btn, i) => btn.classList.toggle('active', i === currentIndex));
  }
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
  $('#nextPhoto')?.addEventListener('click', nextPhoto);
  $('#prevPhoto')?.addEventListener('click', prevPhoto);
  $('#expandPhoto')?.addEventListener('click', openLightbox);
  carouselImage?.addEventListener('click', openLightbox);
  $('#closeLightbox')?.addEventListener('click', closeLightbox);
  $('#lightboxNext')?.addEventListener('click', nextPhoto);
  $('#lightboxPrev')?.addEventListener('click', prevPhoto);
  $('#refreshGallery')?.addEventListener('click', loadPhotos);
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
}

function openLightbox() {
  if (!photos.length || !lightbox) return;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  if (!lightbox) return;
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
  if (!input || !status) return;
  
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

function initRSVP() {
  const form = $('#rsvpForm');
  const status = $('#formStatus');
  if (!form || !status) return;

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
      await fetch(webAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
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
  if (!btn || !audio) return;
  
  const playlist = cfg.playlist && cfg.playlist.length ? cfg.playlist : ['assets/music/musica.mp3'];
  let currentSongIndex = 0;
  let hasStarted = false;

  audio.volume = 0.8;

  async function playSong(index) {
    currentSongIndex = index % playlist.length;
    audio.src = playlist[currentSongIndex];
    audio.load();
    try {
      await audio.play();
      btn.classList.add('playing');
      btn.textContent = 'Ⅱ'; 
    } catch (error) {
      hasStarted = false;
    }
  }

  async function startMusicOnInteraction() {
    if (hasStarted) return; 
    hasStarted = true;
    await playSong(0);
    
    ['click', 'touchstart', 'scroll', 'mousemove', 'wheel'].forEach(event => {
      document.removeEventListener(event, startMusicOnInteraction);
    });
  }

  ['click', 'touchstart', 'scroll', 'mousemove', 'wheel'].forEach(event => {
    document.addEventListener(event, startMusicOnInteraction, { passive: true });
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    
    if (!hasStarted) {
      hasStarted = true;
      playSong(0);
      return;
    }

    if (audio.muted) {
      audio.muted = false;
      btn.classList.add('playing');
      btn.textContent = 'Ⅱ';
    } else {
      audio.muted = true;
      btn.classList.remove('playing');
      btn.textContent = '♪';
    }
  });

  audio.addEventListener('ended', () => {
    playSong(currentSongIndex + 1);
  });
}

// Inicialización de la aplicación de boda
initContent();
initMenu();
initCountdown();
initGalleryControls();
initUpload();
initRSVP();
initMusic();
loadPhotos();
startCarousel();
setInterval(loadPhotos, cfg.galleryRefreshMs || 15000);
