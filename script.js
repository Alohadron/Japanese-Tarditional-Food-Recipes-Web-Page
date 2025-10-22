// =========================
// Food Gallery — Final JS
// =========================

// Global
let recipes = [];
let lastFocusedCard = null; // remember last clicked card to restore focus

// ✅ Default language (fallback)
let currentLang = localStorage.getItem('language') || 'en';

// ✅ Get the dropdown element
const languageSelect = document.getElementById('language-select');

// ✅ Set the dropdown to the saved language when the page loads
languageSelect.value = currentLang;

// ✅ Language change event (only once!)
languageSelect.addEventListener('change', (event) => {
  currentLang = event.target.value;
  localStorage.setItem('language', currentLang);
  console.log("Language changed to:", currentLang);

  renderRecipes();  // Rerender recipe cards
  updateUI();       // Update UI sections
});


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

const modalDesc = document.getElementById('modalDesc');

const uiText = {
  header: {
    title: {
      en: "日本の味覚",
      ro: "Gusturile Japoniei",
      ru: "Вкусы Японии"
    },
    subtitle: {
      en: "Discover the art, harmony, and authentic tastes of Japanese cuisine",
      ro: "Descoperă arta, armonia și gusturile autentice ale bucătăriei japoneze",
      ru: "Откройте искусство, гармонию и подлинные вкусы японской кухни"
    }
  },
  modal: {
    close: {
      en: "✕",
      ro: "✕",
      ru: "✕"
    },
    ingredients: {
      en: "Ingredients",
      ro: "Ingrediente",
      ru: "Ингредиенты"
    },
    steps: {
      en: "Steps",
      ro: "Pași",
      ru: "Шаги"
    },
    watchVideo: {
      en: "Watch how it's made:",
      ro: "Vezi cum se prepară:",
      ru: "Смотрите, как это готовится:"
    },
    locations: {
      en: "Where to Try It",
      ro: "Unde Poți Gusta",
      ru: "Где Попробовать"
    }
  }
};


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

function openModal(id) {
  const recipe = recipes.find((x) => x.id === id);
  if (!recipe) return;

  // ✅ Get content in the current language
  const title = recipe.title?.[currentLang] || recipe.title?.en || "";
  const description = recipe.description?.[currentLang] || recipe.description?.en || "";
  const ingredients = recipe.ingredients?.[currentLang] || [];
  const steps = recipe.steps?.[currentLang] || [];
  const locations = recipe.locations || []; // locations usually language-neutral
  const altText = recipe.alt?.[currentLang] || title;



  // ---------- Image Carousel ----------
  clearImageArrows();

  const imgs = recipe.images && recipe.images.length ? recipe.images : [recipe.image];
  let currentImageIndex = 0;

  modalImage.src = imgs[currentImageIndex];
  modalImage.alt = altText;

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
      modalImage.alt = altText;
    };

    leftArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      go(-1);
    });
    rightArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      go(1);
    });

    modalImageWrap.appendChild(leftArrow);
    modalImageWrap.appendChild(rightArrow);
  }

  // ---------- Populate Right Column ----------
  // Title & description
  modalTitle.textContent = title;
  modalDesc.textContent = description;

  // Ingredients
  modalIngredients.innerHTML = '';
  ingredients.forEach((ing) => {
    const li = document.createElement('li');
    li.textContent = ing;
    modalIngredients.appendChild(li);
  });

  // Steps
  modalSteps.innerHTML = '';
  steps.forEach((st) => {
    const li = document.createElement('li');
    li.textContent = st;
    modalSteps.appendChild(li);
  });

  // ---------- Video section ----------
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

  // ---------- Locations section ----------
  if (modalLocationsList) {
    modalLocationsList.innerHTML = '';
    if (locations.length) {
      locations.forEach((place) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${place.name}</strong><br>
          <span>${place.address || 'Address not available'}</span><br>
          ${place.website ? `<a href="${place.website}" target="_blank" class="location-link website-link">${currentLang === 'en' ? 'Visit Website' : currentLang === 'ro' ? 'Vizitează site-ul' : 'Посетить сайт'}</a><br>` : ''}
          ${place.link ? `<a href="${place.link}" target="_blank" class="location-link map-link">${currentLang === 'en' ? 'View on Map' : currentLang === 'ro' ? 'Vezi pe hartă' : 'Посмотреть на карте'}</a>` : ''}
        `;
        modalLocationsList.appendChild(li);
      });
    } else {
      modalLocationsList.innerHTML = `<li>${currentLang === 'en' ? 'No restaurant data available.' : currentLang === 'ro' ? 'Nu sunt date disponibile.' : 'Нет данных о ресторанах.'}</li>`;
    }
  }

  // ---------- Show modal ----------
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  closeBtn?.focus();

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
    renderRecipes();  
    updateUI();
  })
  .catch((err) => {
    console.error('Error loading recipes:', err);
    const g = document.getElementById('gallery');
    g.innerHTML = `<div style="padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:8px;background:rgba(0,0,0,0.35);color:#fff">
      <strong>Couldn’t load recipes.</strong><br>
      If you’re opening this file directly, start a local server. Otherwise check <code>data/recipes.json</code>.
    </div>`;
  });


// ✅ Render recipe cards dynamically
function renderRecipes() {
  const container = document.querySelector('.grid');
  container.innerHTML = ''; // Clear old recipes

  recipes.forEach(recipe => {
    const card = document.createElement('button');
    card.className = 'card';
    card.setAttribute('data-id', recipe.id);
    card.setAttribute('aria-label', recipe.title[currentLang] || "");
    card.type = "button";

    card.innerHTML = `
      <div class="thumb">
        <img src="${recipe.images[0]}" 
             alt="${recipe.alt?.[currentLang] || recipe.title[currentLang]}" 
             decoding="async" 
             loading="lazy">
      </div>
      <div class="card-info">
        <div class="title">${recipe.title[currentLang]}</div>
        <div class="desc">${recipe.description[currentLang]}</div>
        <div class="sub">
          ${currentLang === 'en' ? 'Click to view' : currentLang === 'ro' ? 'Apasă pentru a vedea' : 'Нажмите для просмотра'}
        </div>
      </div>
    `;

    // ✅ Add click event for modal
    // ✅ Add click event for modal + remember last focused card
    card.addEventListener('click', () => {
      lastFocusedCard = card; // ✅ this stores which card opened the modal
      openModal(recipe.id);   // ✅ this opens the modal as before
    });

    container.appendChild(card);
  });
}

// ✅ Update non-recipe UI elements (titles, modal labels, etc.)
function updateUI() {
  document.querySelectorAll('[data-ui]').forEach(el => {
    const keyPath = el.getAttribute('data-ui').split('.');
    let textObj = uiText;

    keyPath.forEach(key => {
      if (textObj[key]) textObj = textObj[key];
    });

    if (textObj[currentLang]) {
      el.textContent = textObj[currentLang];
    }
  });
}
