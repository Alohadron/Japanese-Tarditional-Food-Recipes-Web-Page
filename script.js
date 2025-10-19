// =========================
// Food Gallery — Final JS
// =========================

// Global
let recipes = [];
let lastFocusedCard = null; // remember last clicked card to restore focus

// Render gallery cards
function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // clear

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
    img.loading = 'lazy';
    thumb.appendChild(img);

    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `
      <div style="flex:1">
        <div class="title">${r.title}</div>
        <div class="desc">${r.description || ''}</div>
        <div class="sub">Click to view recipe</div>
      </div>
    `;

    card.appendChild(thumb);
    card.appendChild(info);

    card.addEventListener('click', () => {
      lastFocusedCard = card;
      openModal(r.id);
    });

    gallery.appendChild(card);
  });
}

// ---------- Modal refs ----------
const overlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalIngredients = document.getElementById('modalIngredients');
const modalSteps = document.getElementById('modalSteps');
const closeBtn = document.getElementById('closeBtn');
const recipeContentEl = document.getElementById('recipeContent');
const modalImageWrap = document.getElementById('modalImageWrap');

// Optional sections
const videoContainer = document.getElementById('videoContainer');
const videoFrameWrap = document.getElementById('videoFrameWrap');
const modalLocationsList = document.getElementById('modalLocationsList');

// Scroll fades
const fadeTop = document.querySelector('.fade-top');
const fadeBottom = document.querySelector('.fade-bottom');

// ---------- Helpers ----------
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.pathname.startsWith('/shorts/')) {
      return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`;
    }
    if (u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
  } catch {}
  return null;
}

function updateScrollFades() {
  if (!recipeContentEl) return;
  const atTop = recipeContentEl.scrollTop <= 0;
  const atBottom =
    Math.ceil(recipeContentEl.scrollTop + recipeContentEl.clientHeight) >=
    recipeContentEl.scrollHeight;

  // Drive CSS with vars (cheap + smooth)
  document.documentElement.style.setProperty('--fade-top-opacity', atTop ? '0' : '1');
  document.documentElement.style.setProperty('--fade-bottom-opacity', atBottom ? '0' : '1');
}

function attachScrollFadeListeners() {
  if (!recipeContentEl) return;
  recipeContentEl.removeEventListener('scroll', updateScrollFades);
  recipeContentEl.addEventListener('scroll', updateScrollFades, { passive: true });
  // Initialize
  requestAnimationFrame(updateScrollFades);
}

function clearImageArrows() {
  if (!modalImageWrap) return;
  modalImageWrap.querySelectorAll('.modal-arrow').forEach((el) => el.remove());
}

// ---------- Modal open / close ----------
function openModal(id) {
  const recipe = recipes.find((x) => x.id === id);
  if (!recipe) return;

  // Reset & image handling
  clearImageArrows();

  const imgs = recipe.images && recipe.images.length ? recipe.images : [recipe.image];
  let currentImageIndex = 0;

  modalImage.src = imgs[currentImageIndex];
  modalImage.alt = recipe.alt || recipe.title;

  // Add arrows only if multiple images
  if (imgs.length > 1) {
    const leftArrow = document.createElement('div');
    leftArrow.className = 'modal-arrow left';
    leftArrow.textContent = '‹';

    const rightArrow = document.createElement('div');
    rightArrow.className = 'modal-arrow right';
    rightArrow.textContent = '›';

    const go = (dir) => {
      currentImageIndex = (currentImageIndex + dir + imgs.length) % imgs.length;
      modalImage.src = imgs[currentImageIndex];
    };

    leftArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      go(-1);
    });
    rightArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      go(1);
    });

    // Important: arrows must be children of img-wrap so they stay within image bounds
    modalImageWrap.appendChild(leftArrow);
    modalImageWrap.appendChild(rightArrow);
  }

  // Populate right column
  modalTitle.textContent = recipe.title;

  modalIngredients.innerHTML = '';
  (recipe.ingredients || []).forEach((ing) => {
    const li = document.createElement('li');
    li.textContent = ing;
    modalIngredients.appendChild(li);
  });

  modalSteps.innerHTML = '';
  (recipe.steps || []).forEach((st) => {
    const li = document.createElement('li');
    li.textContent = st;
    modalSteps.appendChild(li);
  });

  // Video (optional)
  videoFrameWrap.innerHTML = '';
  if (recipe.video) {
    const embedUrl = toEmbedUrl(recipe.video);
    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      iframe.width = '100%';
      iframe.height = '315';
      iframe.frameBorder = '0';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      videoFrameWrap.appendChild(iframe);
      videoContainer.style.display = 'block';
    } else {
      videoContainer.style.display = 'none';
    }
  } else {
    videoContainer.style.display = 'none';
  }

  // Locations (optional)
  if (modalLocationsList) {
    modalLocationsList.innerHTML = '';
    if (recipe.locations && recipe.locations.length) {
      recipe.locations.forEach((place) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${place.name}</strong><br>
          <span>${place.address || 'Address not available'}</span><br>
          ${place.website ? `<a href="${place.website}" target="_blank" class="location-link website-link">Visit Website</a><br>` : ''}
          ${place.link ? `<a href="${place.link}" target="_blank" class="location-link map-link">View on Map</a>` : ''}

        `;
        modalLocationsList.appendChild(li);
      });
    } else {
      modalLocationsList.innerHTML = '<li>No restaurant data available.</li>';
    }
  }

  // Show modal
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  // Focus management
  closeBtn?.focus();

  // Init scroll fades on right column
  attachScrollFadeListeners();
  updateScrollFades();
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  // Clean up UI bits
  clearImageArrows();

  // Restore focus
  if (lastFocusedCard) lastFocusedCard.focus();
}

// ---------- Close interactions ----------
closeBtn?.addEventListener('click', closeModal);

// Close when clicking the overlay background (but not the modal itself)
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});

// ---------- Focus trap (a11y) ----------
const focusables = () =>
  overlay.querySelectorAll('button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])');

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !overlay.classList.contains('open')) return;
  const list = Array.from(focusables());
  if (!list.length) return;
  const first = list[0],
    last = list[list.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    last.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === last) {
    first.focus();
    e.preventDefault();
  }
});

// Keep fades correct on resize/orientation change
window.addEventListener('resize', () => requestAnimationFrame(updateScrollFades));

// ---------- Load data ----------
fetch('data/recipes.json')
  .then((r) => (r.ok ? r.json() : Promise.reject(r)))
  .then((data) => {
    recipes = data;
    renderGallery();
  })
  .catch((err) => {
    console.error('Error loading recipes:', err);
    const g = document.getElementById('gallery');
    g.innerHTML = `<div style="padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:8px;background:rgba(0,0,0,0.35);color:#fff">
      <strong>Couldn’t load recipes.</strong><br>
      If you’re opening this file directly, start a local server. Otherwise check <code>data/recipes.json</code>.
    </div>`;
  });

  