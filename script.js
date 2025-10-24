/* ============================================================================
   Food Gallery — Refactored ES Module
   Architecture: Config → State → DOM → i18n → Utils → Render → Events → Init
   - Scalable, maintainable, and framework-friendly (ready for React/Vite).
   - Includes inline error UI, defensive rendering, and performance guardrails.
   ========================================================================== */

/* ============================================================================
   1) APP CONFIG & CONSTANTS
   - Centralize paths, selectors, feature flags, and translatable UI text.
   ========================================================================== */
export const APP_CONFIG = {
  dataUrl: 'data/recipes.json',
  selectors: {
    languageSelect: '#language-select',
    gallery: '.grid',
    overlay: '#modalOverlay',
    modalImage: '#modalImage',
    modalTitle: '#modalTitle',
    modalIngredients: '#modalIngredients',
    modalSteps: '#modalSteps',
    modalCloseBtn: '#closeBtn',
    recipeContent: '#recipeContent',
    modalImageWrap: '#modalImageWrap',
    videoContainer: '#videoContainer',
    videoFrameWrap: '#videoFrameWrap',
    modalLocationsList: '#modalLocationsList',
    fadeTop: '.fade-top',
    fadeBottom: '.fade-bottom',
  },
  a11y: {
    modalOpenBodyClass: 'modal-open',
    focusTrapSelectors:
      'button, [href], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])',
  },
  // Simple flags to toggle optional behaviors in the future
  features: {
    inlineErrors: true, // show user-friendly errors inside the gallery
    consoleDebug: true, // surface developer logs
  },
};

/** Centralized i18n content (easy to extend) */
export const LANGUAGE_TEXT = {
  header: {
    title: { en: '日本の味覚', ro: 'Gusturile Japoniei', ru: 'Вкусы Японии' },
    subtitle: {
      en: "Discover the art, harmony, and authentic tastes of Japanese cuisine",
      ro: "Descoperă arta, armonia și gusturile autentice ale bucătăriei japoneze",
      ru: "Откройте искусство, гармонию и подлинные вкусы японской кухни",
    },
  },
  modal: {
    close: { en: '✕', ro: '✕', ru: '✕' },
    ingredients: { en: 'Ingredients', ro: 'Ingrediente', ru: 'Ингредиенты' },
    steps: { en: 'Steps', ro: 'Pași', ru: 'Шаги' },
    watchVideo: {
      en: "Watch how it's made:",
      ro: 'Vezi cum se prepară:',
      ru: 'Смотрите, как это готовится:',
    },
    locations: {
      en: 'Where to Try It',
      ro: 'Unde Poți Gusta',
      ru: 'Где Попробовать',
    },
  },
  cards: {
    cta: {
      en: 'Click to view',
      ro: 'Apasă pentru a vedea',
      ru: 'Нажмите для просмотра',
    },
    noRestaurantData: {
      en: 'No restaurant data available.',
      ro: 'Nu sunt date disponibile.',
      ru: 'Нет данных о ресторанах.',
    },
  },
  errors: {
    loadFailedTitle: { en: "Couldn’t load recipes.", ro: 'Nu am putut încărca rețetele.', ru: 'Не удалось загрузить рецепты.' },
    loadFailedHint: {
      en: 'If you opened this file directly, start a local server. Otherwise check data/recipes.json.',
      ro: 'Dacă ai deschis fișierul direct, pornește un server local. Altfel verifică data/recipes.json.',
      ru: 'Если вы открыли файл напрямую, запустите локальный сервер. Иначе проверьте data/recipes.json.',
    },
  },
};

/* ============================================================================
   2) APP STATE (single source of truth)
   - Encapsulates mutable data and current runtime values.
   ========================================================================== */
const appState = {
  recipes: /** @type {Array<any>} */ ([]),
  lastFocusedCard: /** @type {HTMLButtonElement|null} */ (null),
  currentLang: localStorage.getItem('language') || 'en',
  currentImageIndex: 0, // local per modal session (reassigned in openModal)
};

/* ============================================================================
   3) DOM REFERENCES (resolved once)
   - Query once; store stable references to avoid repeated lookups.
   ========================================================================== */
const DOM = {
  languageSelect: /** @type {HTMLSelectElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.languageSelect)
  ),
  gallery: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.gallery)
  ),
  overlay: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.overlay)
  ),
  modalImage: /** @type {HTMLImageElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.modalImage)
  ),
  modalTitle: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.modalTitle)
  ),
  modalIngredients: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.modalIngredients)
  ),
  modalSteps: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.modalSteps)
  ),
  modalCloseBtn: /** @type {HTMLButtonElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.modalCloseBtn)
  ),
  recipeContentEl: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.recipeContent)
  ),
  modalImageWrap: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.modalImageWrap)
  ),
  videoContainer: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.videoContainer)
  ),
  videoFrameWrap: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.videoFrameWrap)
  ),
  modalLocationsList: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.modalLocationsList)
  ),
  fadeTop: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.fadeTop)
  ),
  fadeBottom: /** @type {HTMLElement|null} */ (
    document.querySelector(APP_CONFIG.selectors.fadeBottom)
  ),
  modalDesc: /** @type {HTMLElement|null} */ (document.getElementById('modalDesc')),
};

/* ============================================================================
   4) UTILITIES
   - Small focused helpers. Prefer pure functions; keep side effects obvious.
   ========================================================================== */

/** Tiny query helpers with typed casts (optional convenience) */
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Create element with safe defaults and a small prop shorthand */
function createEl(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'className') el.className = String(v);
    else if (k === 'dataset' && typeof v === 'object') {
      Object.entries(v).forEach(([dk, dv]) => { el.dataset[dk] = String(dv); });
    } else if (k in el) {
      // @ts-ignore - assign known DOM props (id, src, alt, type, etc.)
      el[k] = v;
    } else {
      el.setAttribute(k, String(v));
    }
  });
  [].concat(children).forEach((c) => {
    if (c == null) return;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return el;
}

/** Defensive text setter */
function setText(el, text) {
  if (!el) return;
  el.textContent = text ?? '';
}

/** Coerce a YouTube URL into an embeddable URL; return null for non-YT links */
export function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`;
    if (u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
  } catch {
    // no-op: handled by returning null
  }
  return null;
}

/** Developer logger with feature flag */
function devLog(...args) {
  if (APP_CONFIG.features.consoleDebug) console.log('[FoodGallery]', ...args);
}

/** Inline error UI renderer (friendly for end users) */
function renderInlineError(title, hint) {
  if (!APP_CONFIG.features.inlineErrors || !DOM.gallery) return;
  DOM.gallery.innerHTML = '';
  const box = createEl('div', {
    className: 'error-box',
    style:
      'padding:16px;border:1px solid rgba(255,255,255,0.08);border-radius:8px;background:rgba(0,0,0,0.35);color:#fff',
  }, [
    createEl('strong', {}, [title]),
    createEl('br'),
    createEl('span', {}, [hint]),
  ]);
  DOM.gallery.appendChild(box);
}

/** Scroll fade updater: sets CSS variables used by the fade elements */
function updateScrollFades() {
  const scroller = DOM.recipeContentEl;
  if (!scroller) return;
  const atTop = scroller.scrollTop <= 0;
  const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight;
  document.documentElement.style.setProperty('--fade-top-opacity', atTop ? '0' : '1');
  document.documentElement.style.setProperty('--fade-bottom-opacity', atBottom ? '0' : '1');
}

/** Attach (and reattach safely) the scroll listener for fades */
function attachScrollFadeListeners() {
  const scroller = DOM.recipeContentEl;
  if (!scroller) return;
  scroller.removeEventListener('scroll', updateScrollFades);
  scroller.addEventListener('scroll', updateScrollFades, { passive: true });
  requestAnimationFrame(updateScrollFades); // initialize once content is in place
}

/** Remove all carousel arrows from the modal image*/
function clearImageArrows() {
  if (!DOM.modalImageWrap) return;
  DOM.modalImageWrap.querySelectorAll('.modal-arrow').forEach((el) => el.remove());
}

/* ============================================================================
   5) RENDERING LOGIC
   - Pure-ish rendering functions. They read from `appState` and `DOM`.
   ========================================================================== */

/** Render the card grid from `appState.recipes` */
function renderRecipes() {
  if (!DOM.gallery) return;
  DOM.gallery.innerHTML = '';

  const lang = appState.currentLang;
  const frag = document.createDocumentFragment();

  appState.recipes.forEach((recipe) => {
    const title = recipe.title?.[lang] ?? recipe.title?.en ?? '';
    const desc = recipe.description?.[lang] ?? '';
    const alt = recipe.alt?.[lang] ?? title;
    const thumb = recipe.images?.[0] ?? recipe.image ?? '';

    const card = createEl('button', {
      className: 'card',
      type: 'button',
      'aria-label': title,
    }, [
      createEl('div', { className: 'thumb' }, [
        createEl('img', {
          src: thumb,
          alt,
          decoding: 'async',
          loading: 'lazy',
        }),
      ]),
      createEl('div', { className: 'card-info' }, [
        createEl('div', { className: 'title' }, [title]),
        createEl('div', { className: 'desc' }, [desc]),
        createEl('div', { className: 'sub' }, [
          LANGUAGE_TEXT.cards.cta[lang] ?? LANGUAGE_TEXT.cards.cta.en,
        ]),
      ]),
    ]);

    // Remember focus origin; open modal
    card.addEventListener('click', () => {
      appState.lastFocusedCard = card;
      openModal(recipe.id);
    });

    frag.appendChild(card);
  });

  DOM.gallery.appendChild(frag);
}

/** Update static UI elements that are not recipe-specific via [data-ui] */
function updateUIStrings() {
  const lang = appState.currentLang;
  qsa('[data-ui]').forEach((el) => {
    const path = el.getAttribute('data-ui')?.split('.') ?? [];
    // Traverse LANGUAGE_TEXT using the dot path in data-ui
    let ref = LANGUAGE_TEXT;
    for (const key of path) {
      if (ref && typeof ref === 'object' && key in ref) {
        ref = ref[key];
      } else {
        ref = null;
        break;
      }
    }
    const text = (ref && typeof ref === 'object' && ref[lang]) ? ref[lang] : null;
    if (typeof text === 'string') setText(el, text);
  });

  // Keep the dropdown in sync with state
  if (DOM.languageSelect) DOM.languageSelect.value = lang;
}

/** Build the locations list inside the modal, with null-safe fallbacks */
function renderLocations(locations = []) {
  if (!DOM.modalLocationsList) return;
  const lang = appState.currentLang;
  DOM.modalLocationsList.innerHTML = '';

  if (!locations.length) {
    DOM.modalLocationsList.appendChild(
      createEl('li', {}, [LANGUAGE_TEXT.cards.noRestaurantData[lang] ?? LANGUAGE_TEXT.cards.noRestaurantData.en])
    );
    return;
  }

  const frag = document.createDocumentFragment();
  locations.forEach((place) => {
    const websiteLabel =
      lang === 'en' ? 'Visit Website' : lang === 'ro' ? 'Vizitează site-ul' : 'Посетить сайт';
    const mapLabel =
      lang === 'en' ? 'View on Map' : lang === 'ro' ? 'Vezi pe hartă' : 'Посмотреть на карте';

    const li = createEl('li');
    li.innerHTML = `
      <strong>${place.name ?? ''}</strong><br>
      <span>${place.address ?? 'Address not available'}</span><br>
      ${place.website ? `<a href="${place.website}" target="_blank" class="location-link website-link">${websiteLabel}</a><br>` : ''}
      ${place.link ? `<a href="${place.link}" target="_blank" class="location-link map-link">${mapLabel}</a>` : ''}
    `;
    frag.appendChild(li);
  });

  DOM.modalLocationsList.appendChild(frag);
}

/** Render/refresh the modal for a given recipe ID */
function openModal(id) {
  const recipe = appState.recipes.find((x) => x.id === id);
  if (!recipe || !DOM.overlay) return;

  const lang = appState.currentLang;
  const title = recipe.title?.[lang] ?? recipe.title?.en ?? '';
  const description = recipe.description?.[lang] ?? recipe.description?.en ?? '';
  const ingredients = recipe.ingredients?.[lang] ?? [];
  const steps = recipe.steps?.[lang] ?? [];
  const locations = recipe.locations ?? [];
  const altText = recipe.alt?.[lang] ?? title;

  // Set up image(s) & minimal carousel
  clearImageArrows();
  const imgs = (recipe.images?.length ? recipe.images : [recipe.image]).filter(Boolean);
  appState.currentImageIndex = 0;

  if (DOM.modalImage) {
    DOM.modalImage.src = imgs[appState.currentImageIndex] ?? '';
    DOM.modalImage.alt = altText;
  }

  if (imgs.length > 1 && DOM.modalImageWrap && DOM.modalImage) {
    const leftArrow = createEl('div', { className: 'modal-arrow left' }, ['‹']);
    const rightArrow = createEl('div', { className: 'modal-arrow right' }, ['›']);

    const go = (dir) => {
      appState.currentImageIndex = (appState.currentImageIndex + dir + imgs.length) % imgs.length;
      DOM.modalImage.src = imgs[appState.currentImageIndex];
      DOM.modalImage.alt = altText;
    };

    leftArrow.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
    rightArrow.addEventListener('click', (e) => { e.stopPropagation(); go(1); });

    DOM.modalImageWrap.appendChild(leftArrow);
    DOM.modalImageWrap.appendChild(rightArrow);
  }

  // Populate right column
  setText(DOM.modalTitle, title);
  setText(DOM.modalDesc, description);

  if (DOM.modalIngredients) {
    DOM.modalIngredients.innerHTML = '';
    (ingredients || []).forEach((ing) => DOM.modalIngredients.appendChild(createEl('li', {}, [ing])));
  }
  if (DOM.modalSteps) {
    DOM.modalSteps.innerHTML = '';
    (steps || []).forEach((st) => DOM.modalSteps.appendChild(createEl('li', {}, [st])));
  }

  // Video section
  if (DOM.videoFrameWrap && DOM.videoContainer) {
    DOM.videoFrameWrap.innerHTML = '';
    const embedUrl = recipe.video ? toEmbedUrl(recipe.video) : null;
    if (embedUrl) {
      const iframe = createEl('iframe', {
        src: embedUrl,
        width: '100%',
        height: '315',
        frameBorder: '0',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowFullscreen: true,
      });
      DOM.videoFrameWrap.appendChild(iframe);
      DOM.videoContainer.style.display = 'block';
    } else {
      DOM.videoContainer.style.display = 'none';
    }
  }

  // Locations
  renderLocations(locations);

  // Show modal
  DOM.overlay.classList.add('open');
  DOM.overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add(APP_CONFIG.a11y.modalOpenBodyClass);
  DOM.modalCloseBtn?.focus();

  // Scroll fades
  attachScrollFadeListeners();
  updateScrollFades();
}

/** Close modal & restore state/focus */
function closeModal() {
  if (!DOM.overlay) return;
  DOM.overlay.classList.remove('open');
  DOM.overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove(APP_CONFIG.a11y.modalOpenBodyClass);

  clearImageArrows();
  appState.lastFocusedCard?.focus?.();
}

/* ============================================================================
   6) EVENT LISTENERS & INTERACTION
   - Keep listener registration central to avoid duplicates.
   ========================================================================== */
function bindGlobalEvents() {
  // Language changes update state and rerender static + dynamic UI
  DOM.languageSelect?.addEventListener('change', (event) => {
    const val = /** @type {HTMLSelectElement} */ (event.target).value;
    appState.currentLang = val;
    localStorage.setItem('language', val);
    devLog('Language changed to:', val);
    renderRecipes();
    updateUIStrings();
  });

  // Modal close button
  DOM.modalCloseBtn?.addEventListener('click', closeModal);

  // Close when clicking outside the modal (overlay only)
  DOM.overlay?.addEventListener('click', (e) => {
    if (e.target === DOM.overlay) closeModal();
  });

  // Keyboard interactions: ESC to close, TAB to trap focus
  document.addEventListener('keydown', (e) => {
    if (!DOM.overlay?.classList.contains('open')) return;

    // Escape closes modal
    if (e.key === 'Escape') closeModal();

    // Focus trap within modal
    if (e.key === 'Tab') {
      const focusables = DOM.overlay.querySelectorAll(APP_CONFIG.a11y.focusTrapSelectors);
      if (!focusables.length) return;

      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });

  // Keep fades correct on resize/orientation change
  window.addEventListener('resize', () => requestAnimationFrame(updateScrollFades));
}

/* ============================================================================
   7) INITIALIZATION & DATA LOADING
   - Single public entrypoint. Call this after DOM is ready or import in apps.
   ========================================================================== */
export async function initFoodGallery(customConfig = {}) {
  // Allow overriding config (e.g., different dataUrl in tests or deployments)
  Object.assign(APP_CONFIG, customConfig);

  // Sync dropdown with current language
  if (DOM.languageSelect) DOM.languageSelect.value = appState.currentLang;

  // Load data with graceful error UI
  try {
    const res = await fetch(APP_CONFIG.dataUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid data shape: expected an array');

    appState.recipes = data;
    renderRecipes();
    updateUIStrings();
  } catch (err) {
    console.error('Error loading recipes:', err);
    const lang = appState.currentLang;
    renderInlineError(
      LANGUAGE_TEXT.errors.loadFailedTitle[lang] ?? LANGUAGE_TEXT.errors.loadFailedTitle.en,
      LANGUAGE_TEXT.errors.loadFailedHint[lang] ?? LANGUAGE_TEXT.errors.loadFailedHint.en
    );
  }

  // Bind once
  bindGlobalEvents();
  devLog('Initialized');
  initTheme();
}

/* ============================================================================
   THEME TOGGLING LOGIC
   ========================================================================== */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeToggleButton(theme);
}

function updateThemeToggleButton(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = theme === 'light' ? '🌞 Light Mode' : '🌙 Dark Mode';
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }
}
 
/* Default export for convenience in most bundlers */
export default initFoodGallery;
