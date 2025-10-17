// Fetch recipes from JSON
let recipes = [];

let lastFocusedCard = null; // store the last clicked card

fetch('data/recipes.json')
  .then(response => response.json())
  .then(data => {
    recipes = data;
    renderGallery();
  })
  .catch(err => console.error('Error loading recipes:', err));

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
    thumb.appendChild(img);
      

    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `<div style="flex:1">
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
const printBtn = document.getElementById('printBtn');
const saveBtn = document.getElementById('saveBtn');

function openModal(id) {
  const recipe = recipes.find(x => x.id === id);
  if (!recipe) return;

  const imgWrap = document.querySelector('.img-wrap');
  imgWrap.innerHTML = ''; // clear previous content

  const imgs = recipe.images || [recipe.image];
  let currentImageIndex = 0;

  const img = document.createElement('img');
  img.src = imgs[currentImageIndex];
  img.alt = recipe.alt || recipe.title;
  imgWrap.appendChild(img);
  
    // Handle YouTube video
  const videoContainer = document.getElementById('videoContainer');
  const videoFrameWrap = document.getElementById('videoFrameWrap');
  videoFrameWrap.innerHTML = ''; // clear previous video

  if (recipe.video) {
    // Convert normal YouTube link to embeddable form
    const videoId = recipe.video.split('v=')[1]?.split('&')[0];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.width = '100%';
    iframe.height = '315';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    videoFrameWrap.appendChild(iframe);
    videoContainer.style.display = 'block';
  } else {
    videoContainer.style.display = 'none';
  }


  // --- Add arrows only if multiple images exist ---
  if (imgs.length > 1) {
    const leftArrow = document.createElement('div');
    leftArrow.className = 'modal-arrow left';
    leftArrow.innerHTML = '‹';

    const rightArrow = document.createElement('div');
    rightArrow.className = 'modal-arrow right';
    rightArrow.innerHTML = '›';

    leftArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + imgs.length) % imgs.length;
      img.src = imgs[currentImageIndex];
    });

    rightArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % imgs.length;
      img.src = imgs[currentImageIndex];
    });

    imgWrap.appendChild(leftArrow);
    imgWrap.appendChild(rightArrow);
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
  closeBtn.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  if (lastFocusedCard) lastFocusedCard.focus(); // restore focus to the same card
}

closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

// Print current recipe view
printBtn.addEventListener('click', () => {
  const html = `
    <html><head><title>${modalTitle.textContent} — Recipe</title>
      <style>
        body{font-family:sans-serif;padding:18px;color:#111}
        img{max-width:100%;height:auto}
        h1{font-size:20px}
        ul,ol{margin-left:18px;}
      </style>
    </head>
    <body>
      <h1>${modalTitle.textContent}</h1>
      <img src="${modalImage.src}" alt="${modalImage.alt}">
      <h3>Ingredients</h3>
      ${modalIngredients.innerHTML}
      <h3>Steps</h3>
      ${modalSteps.innerHTML}
    </body></html>`;
  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.print();
});

// Save to device
saveBtn.addEventListener('click', () => {
  const title = modalTitle.textContent;
  const imgUrl = modalImage.src;
  let content = `${title}\n\nIngredients:\n`;
  Array.from(modalIngredients.querySelectorAll('li')).forEach(li => content += `- ${li.textContent}\n`);
  content += `\nSteps:\n`;
  Array.from(modalSteps.querySelectorAll('li')).forEach((li, i) => content += `${i + 1}. ${li.textContent}\n`);
  content += `\nImage: ${imgUrl}\n`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_recipe.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});
