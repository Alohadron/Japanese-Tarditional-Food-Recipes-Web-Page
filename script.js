const recipes = [
  {
    id: 'pizza',
    title: 'Margherita Pizza',
    image: 'https://source.unsplash.com/1200x800/?pizza,margherita',
    alt: 'Margherita pizza with basil and tomato',
    ingredients: [
      'Pizza dough (store-bought or homemade)',
      '200g tomato passata or crushed tomatoes',
      '200g fresh mozzarella, torn',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      'Salt & pepper'
    ],
    steps: [
      'Preheat oven to 250°C (480°F) with a pizza stone or tray.',
      'Stretch dough thin, brush edges with olive oil.',
      'Spread passata, scatter mozzarella, season with salt & pepper.',
      'Bake 7–10 minutes until crust is golden and cheese bubbly.',
      'Finish with fresh basil leaves and a drizzle of olive oil.'
    ]
  },
  {
    id: 'sushi',
    title: 'Simple Sushi Rolls (Maki)',
    image: 'https://source.unsplash.com/1200x800/?sushi,maki',
    alt: 'Sushi rolls on a plate',
    ingredients: [
      '2 cups sushi rice (cooked & seasoned)',
      'Nori sheets',
      'Sliced cucumber, avocado, and cooked/ raw fish of choice',
      'Soy sauce, pickled ginger, wasabi'
    ],
    steps: [
      'Place nori on bamboo mat, spread an even layer of rice (leave 2cm at top).',
      'Arrange fillings along bottom third, then roll tightly.',
      'Moisten top edge and seal; slice into pieces with a wet knife.',
      'Serve with soy sauce, ginger and wasabi.'
    ]
  },
  {
    id: 'salad',
    title: 'Mediterranean Chickpea Salad',
    image: 'https://source.unsplash.com/1200x800/?salad,chickpea',
    alt: 'Colorful chickpea salad',
    ingredients: [
      '1 can chickpeas, drained & rinsed',
      'Cherry tomatoes, halved',
      'Cucumber, diced',
      'Red onion, thinly sliced',
      'Feta cheese, crumbled',
      'Olive oil, lemon juice, salt, pepper, dried oregano'
    ],
    steps: [
      'Combine chickpeas, tomatoes, cucumber, onion and feta in a bowl.',
      'Whisk olive oil, lemon juice, oregano, salt & pepper.',
      'Toss salad with dressing. Chill 10–20 minutes before serving.'
    ]
  },
  {
    id: 'pasta',
    title: 'Creamy Garlic Pasta',
    image: 'https://source.unsplash.com/1200x800/?pasta,creamy',
    alt: 'Creamy garlic pasta dish',
    ingredients: [
      '300g pasta (fettuccine or spaghetti)',
      '3 garlic cloves, minced',
      '1 cup heavy cream',
      '1/2 cup grated Parmesan',
      '2 tbsp butter, salt & pepper, parsley'
    ],
    steps: [
      'Cook pasta until al dente (reserve 1 cup pasta water).',
      'Sauté garlic in butter until fragrant, add cream and simmer.',
      'Stir in Parmesan until melted. Add pasta and toss, thin with reserved water if needed.',
      'Season and garnish with parsley.'
    ]
  },
  {
    id: 'burger',
    title: 'Classic Beef Burger',
    image: 'https://source.unsplash.com/1200x800/?burger,cheeseburger',
    alt: 'Beef burger with melted cheese',
    ingredients: [
      '500g ground beef (80/20)',
      'Salt & pepper, burger buns',
      'Lettuce, tomato, onion, cheese slices, condiments'
    ],
    steps: [
      'Form patties gently (do not overwork). Season.',
      'Grill or pan-sear to desired doneness (about 3-4 min per side for medium).',
      'Melt cheese on top, assemble on toasted buns with toppings.'
    ]
  },
  {
    id: 'pancakes',
    title: 'Fluffy Pancakes',
    image: 'https://source.unsplash.com/1200x800/?pancakes,breakfast',
    alt: 'Stack of pancakes with syrup',
    ingredients: [
      '1 1/2 cups flour',
      '3 1/2 tsp baking powder',
      '1 tsp salt, 1 tbsp sugar',
      '1 1/4 cups milk, 1 egg, 3 tbsp melted butter'
    ],
    steps: [
      'Whisk dry ingredients. Mix milk, egg and butter; combine with dry ingredients (do not overmix).',
      'Heat a skillet, pour batter for each pancake; cook until bubbles form, flip and finish.',
      'Serve with syrup, fruit or butter.'
    ]
  },
  {
    id: 'curry',
    title: 'Chicken Curry (Simple)',
    image: 'https://source.unsplash.com/1200x800/?chicken,curry',
    alt: 'Bowl of chicken curry',
    ingredients: [
      '500g chicken pieces',
      '1 onion, chopped, 2 garlic, 1 tbsp ginger',
      '2 tbsp curry powder or paste, 400ml coconut milk',
      'Salt, oil, cilantro'
    ],
    steps: [
      'Sauté onion, garlic and ginger until soft. Add curry powder/paste and cook briefly.',
      'Add chicken and brown slightly. Pour in coconut milk, simmer 15–20 minutes until cooked.',
      'Season and garnish with cilantro. Serve with rice.'
    ]
  },
  {
    id: 'tacos',
    title: 'Street Tacos',
    image: 'https://source.unsplash.com/1200x800/?tacos,street-taco',
    alt: 'Three tacos on a plate',
    ingredients: [
      'Small corn tortillas',
      'Protein: grilled steak, chicken or fish',
      'Onion, cilantro, lime, hot sauce'
    ],
    steps: [
      'Warm tortillas on a skillet.',
      'Fill tortillas with sliced protein, top with chopped onion and cilantro, squeeze lime.',
      'Serve with salsa or hot sauce.'
    ]
  },
  {
    id: 'steak',
    title: 'Pan-Seared Steak',
    image: 'https://source.unsplash.com/1200x800/?steak,grill',
    alt: 'Sliced pan-seared steak',
    ingredients: [
      'Ribeye or sirloin steaks',
      'Salt, pepper, butter, garlic, fresh thyme'
    ],
    steps: [
      'Pat steaks dry and season heavily.',
      'Sear in hot pan with oil 2–4 min per side, add butter and aromatics and baste.',
      'Rest 5–10 minutes before slicing.'
    ]
  },
  {
    id: 'ramen',
    title: 'Simple Ramen Bowl',
    image: 'images/ramen.jpg',
    alt: 'Bowl of ramen with egg',
    ingredients: [
      'Ramen noodles (fresh or instant)',
      'Broth (chicken or vegetable), soy sauce, miso (optional)',
      'Soft-boiled egg, scallions, corn, nori'
    ],
    steps: [
      'Heat broth, season with soy sauce/miso to taste.',
      'Cook noodles, place in bowl and pour hot broth over.',
      'Top with soft-boiled egg, scallions, corn and nori.'
    ]
  }
];

// Render gallery
const gallery = document.getElementById('gallery');
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
                      <div class="sub">Click to view recipe</div>
                    </div>`;

  card.appendChild(thumb);
  card.appendChild(info);
  card.addEventListener('click', () => openModal(r.id));
  gallery.appendChild(card);
});

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
