// Fetch recipes from JSON
let recipes = [];

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
    img.src = r.image;
    img.alt = r.alt;
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
    card.addEventListener('click', () => openModal(r.id));
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
  modalImage.src = recipe.image;
  modalImage.alt = recipe.alt;
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
  const firstCard = document.querySelector('.card');
  if (firstCard) firstCard.focus();
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
