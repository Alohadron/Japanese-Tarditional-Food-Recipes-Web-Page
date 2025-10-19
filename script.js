// Global variables
let recipes = [];
let lastFocusedCard = null; // store the last clicked card

// Render gallery
function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // clear existing content

  recipes.forEach((r) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.setAttribute('data-id', r.id);
    card.setAttribute('aria-label', `Open recipe for ${r.title}`);

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    const img = document.createElement('img');
    const firstImage = Array.isArray(r.images) && r.images.length ? r.images[0] : r.image;
    img.src = firstImage;
    img.alt = r.alt || r.title;
    img.loading = 'lazy'; // performance improvement
    thumb.appendChild(img);

    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `
      <div style="flex:1">
        <div class="title">${r.title}</div>
        <div class="desc">${r.description || ''}</div>
        <div class="sub">Click to view recipe</div>
      </div>`;

    card.appendChild(thumb);
    card.appendChild(info);
    card.addEventListener('click', () => {
      lastFocusedCard = card; // remember which card was clicked
      openModal(r.id);
    });
    gallery.appendChild(card);
  });
}

// Modal controls
const overlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalIngredients = document.getElementById('modalIngredients');
const modalSteps = document.getElementById('modalSteps');
const closeBtn = document.getElementById('closeBtn');

function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be'))
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.pathname.startsWith('/shorts/'))
      return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`;
    if (u.searchParams.get('v'))
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
  } catch {}
  return null;
}

function openModal(id) {
  const recipe = recipes.find(x => x.id === id);
  if (!recipe) return;

  const imgWrap = document.getElementById('modalImageWrap');
  const img = document.getElementById('modalImage'); // reuse the existing img

  // remove any old arrows
  imgWrap.querySelectorAll('.modal-arrow').forEach(el => el.remove());

  const imgs = recipe.images && recipe.images.length ? recipe.images : [recipe.image];
  let currentImageIndex = 0;

  img.src = imgs[currentImageIndex];
  img.alt = recipe.alt || recipe.title;

  // Handle YouTube video
  const videoContainer = document.getElementById('videoContainer');
  const videoFrameWrap = document.getElementById('videoFrameWrap');
  videoFrameWrap.innerHTML = '';

  if (recipe.video) {
    const embedUrl = toEmbedUrl(recipe.video);
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.width = '100%';
      iframe.height = '315';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      videoFrameWrap.appendChild(iframe);
      videoContainer.style.display = 'block';
    } else {
      videoContainer.style.display = 'none';
    }
  } else {
    videoContainer.style.display = 'none';
  }

  if (imgs.length > 1) {
    const leftArrow = document.createElement('div');
    leftArrow.className = 'modal-arrow left';
    leftArrow.textContent = '‹';

    const rightArrow = document.createElement('div');
    rightArrow.className = 'modal-arrow right';
    rightArrow.textContent = '›';

    const go = dir => {
      currentImageIndex = (currentImageIndex + dir + imgs.length) % imgs.length;
      img.src = imgs[currentImageIndex];
    };
    leftArrow.addEventListener('click', e => { e.stopPropagation(); go(-1); });
    rightArrow.addEventListener('click', e => { e.stopPropagation(); go(1); });

    imgWrap.appendChild(leftArrow);
    imgWrap.appendChild(rightArrow);

    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    }, { once: true });
  }

  modalTitle.textContent = recipe.title;

  modalIngredients.innerHTML = '';
  recipe.ingredients.forEach(ing => {
    const li = document.createElement('li');
    li.textContent = ing;
    modalIngredients.appendChild(li);
  });

  modalSteps.innerHTML = '';
  recipe.steps.forEach(st => {
    const li = document.createElement('li');
    li.textContent = st;
    modalSteps.appendChild(li);
  });

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeBtn.focus();

  const modalLocationsList = document.getElementById('modalLocationsList');
  modalLocationsList.innerHTML = '';

  if (recipe.locations && recipe.locations.length) {
    recipe.locations.forEach(place => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${place.name}</strong><br>
        <span>${place.address || 'Address not available'}</span><br>
        ${place.website ? `<a href="${place.website}" target="_blank" class="location-link">Visit Website</a><br>` : ''}
        ${place.link ? `<a href="${place.link}" target="_blank" class="location-link">View on Map</a>` : ''}
      `;
      modalLocationsList.appendChild(li);
    });
  } else {
    modalLocationsList.innerHTML = '<li>No restaurant data available.</li>';
  }
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastFocusedCard) lastFocusedCard.focus();
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});

const focusables = () => overlay.querySelectorAll(
  'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

document.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !overlay.classList.contains('open')) return;
  const list = Array.from(focusables());
  if (!list.length) return;
  const first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
});

// ✅ Final and only fetch block with error handling
fetch('data/recipes.json')
  .then(r => r.ok ? r.json() : Promise.reject(r))
  .then(data => { recipes = data; renderGallery(); })
  .catch(err => {
    console.error('Error loading recipes:', err);
    const g = document.getElementById('gallery');
    g.innerHTML = `<div style="padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:8px">
      <strong>Couldn’t load recipes.</strong><br>
      If you’re opening this file directly, start a local server. Otherwise check <code>data/recipes.json</code>.
    </div>`;
  });
