'use strict';

// ========================================
// Recipe page logic
// - Data model
// - Card rendering
// - Filter & search
// - Modal population
// ========================================



// ===== Recipe Data =====
// Static dataset used to render recipe cards and fill modal content
const recipes = [
  {
    id: 1,
    name: "Avocado Toast",
    category: "Breakfast",
    image: "./assets/images/avacado-toast.jpg",
    shortDesc: "Crispy toast topped with creamy avocado.",
    description: "A quick and nutritious breakfast packed with healthy fats.",
    ingredients: ["2 slices bread", "1 ripe avocado", "Salt", "Pepper", "Lemon juice", "Chili flakes (optional)"],
    steps: [
      "Lightly toast the bread slices until golden and crisp.",
      "Halve the avocado, remove the pit, and scoop the flesh into a bowl.",
      "Mash the avocado with a fork; season with a pinch of salt, pepper, and a squeeze of lemon.",
      "Spread the mashed avocado evenly over the hot toast.",
      "Finish with a pinch of chili flakes or extra pepper; serve immediately."
    ],
    nutrition: { Calories: "250 kcal", Protein: "6g", Fat: "12g", Carbs: "30g" }
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    category: "Lunch",
    image: "./assets/images/chicken-salad.jpg",
    shortDesc: "Fresh greens with grilled chicken and dressing.",
    description: "A protein-packed salad perfect for a light lunch.",
    ingredients: ["1 chicken breast", "1 tbsp olive oil", "Salt & pepper", "Lettuce", "Tomatoes", "Cucumber", "Your favorite dressing"],
    steps: [
      "Pat the chicken breast dry, drizzle with olive oil, and season with salt and pepper.",
      "Grill over medium heat 5–7 minutes per side (or until juices run clear).",
      "Rest the chicken for 3 minutes, then slice thinly across the grain.",
      "Wash and chop lettuce, tomatoes, and cucumber; place in a large bowl.",
      "Top the salad with the sliced chicken and toss with dressing just before serving."
    ],
    nutrition: { Calories: "400 kcal", Protein: "35g", Fat: "18g", Carbs: "20g" }
  },
  {
    id: 3,
    name: "Oatmeal Bowl",
    category: "Breakfast",
    image: "./assets/images/oatmeal.jpg",
    shortDesc: "Warm oats with fruit and nuts.",
    description: "A filling breakfast that keeps you energized all morning.",
    ingredients: ["1/2 cup oats", "1 cup milk (or water)", "Pinch of salt", "Banana slices", "Almonds", "Honey"],
    steps: [
      "Combine oats, milk, and a small pinch of salt in a saucepan.",
      "Bring to a gentle simmer, stirring occasionally for 3–5 minutes until creamy.",
      "Remove from heat and let stand 1 minute to thicken.",
      "Spoon into a bowl; top with banana slices and chopped almonds.",
      "Drizzle with honey and serve warm."
    ],
    nutrition: { Calories: "320 kcal", Protein: "8g", Fat: "9g", Carbs: "55g" }
  },
  {
    id: 4,
    name: "Veggie Stir-Fry",
    category: "Dinner",
    image: "./assets/images/veggie-stirfry.jpg",
    shortDesc: "Colorful veggies tossed in soy sauce.",
    description: "A quick and healthy dinner option full of flavor.",
    ingredients: ["1 tbsp oil", "2 cloves garlic (minced)", "Broccoli florets", "Carrots (thinly sliced)", "Bell peppers (sliced)", "2–3 tbsp soy sauce", "Splash of water"],
    steps: [
      "Prep all vegetables into bite-size pieces so they cook evenly.",
      "Heat oil in a wok or large pan over high heat until shimmering.",
      "Add minced garlic and stir for 10–15 seconds until fragrant.",
      "Add hard veggies first (carrots, broccoli); stir-fry 2 minutes, then add peppers.",
      "Splash in soy sauce and a little water; toss for 1–2 minutes until crisp-tender and glossy.",
      "Serve immediately with rice or noodles."
    ],
    nutrition: { Calories: "280 kcal", Protein: "9g", Fat: "12g", Carbs: "35g" }
  },
  {
    id: 5,
    name: "Fruit Smoothie",
    category: "Snacks",
    image: "./assets/images/fruit-smoothie.jpg",
    shortDesc: "Refreshing blend of fruits.",
    description: "A hydrating and vitamin-rich snack for any time of day.",
    ingredients: ["1 cup yogurt", "1 banana", "1/2 cup mixed berries", "1 tsp honey", "Splash of water (if needed)"],
    steps: [
      "Peel and slice the banana; add to a blender with yogurt and berries.",
      "Add honey and a small splash of water for easier blending if needed.",
      "Pulse a few times to break up fruit, then blend until completely smooth (30–45 seconds).",
      "Taste and adjust sweetness; blend again briefly if you add more honey.",
      "Pour into a chilled glass and serve."
    ],
    nutrition: { Calories: "210 kcal", Protein: "6g", Fat: "2g", Carbs: "42g" }
  },
  {
    id: 6,
    name: "Quinoa Bowl",
    category: "Lunch",
    image: "./assets/images/quinoa-bowl.jpg",
    shortDesc: "Protein-rich quinoa with roasted veggies.",
    description: "A balanced meal with plant-based protein and fiber.",
    ingredients: ["1 cup quinoa", "2 cups water", "Zucchini (cubed)", "Sweet potato (cubed)", "Chickpeas (drained)", "Olive oil", "Salt & pepper", "Tahini sauce"],
    steps: [
      "Rinse quinoa under cold water; combine with water in a pot and bring to a boil.",
      "Reduce heat, cover, and simmer 12–15 minutes until water is absorbed; fluff with a fork.",
      "Toss zucchini, sweet potato, and chickpeas with olive oil, salt, and pepper; spread on a tray.",
      "Roast at 200°C (392°F) for 20–25 minutes, turning once, until tender and lightly browned.",
      "Assemble bowl: quinoa at the base, roasted veg and chickpeas on top.",
      "Drizzle with tahini sauce and serve warm."
    ],
    nutrition: { Calories: "450 kcal", Protein: "15g", Fat: "14g", Carbs: "60g" }
  },

  {
    id: 7,
    name: "Pasta Primavera",
    category: "Dinner",
    image: "./assets/images/pasta.jpg",
    shortDesc: "Light pasta with seasonal vegetables.",
    description: "A bright, lemony pasta tossed with crisp-tender veggies and parmesan.",
    ingredients: [
      "200g pasta (penne or spaghetti)",
      "1 tbsp olive oil",
      "2 cloves garlic (minced)",
      "1 small zucchini (half-moons)",
      "1/2 red bell pepper (strips)",
      "1/2 cup peas",
      "8–10 cherry tomatoes (halved)",
      "Zest of 1/2 lemon",
      "2 tbsp grated Parmesan",
      "Salt & pepper",
      "Fresh basil (optional)"
    ],
    steps: [
      "Boil pasta in salted water until al dente; reserve 1/2 cup pasta water and drain.",
      "Meanwhile, heat olive oil in a pan; sauté garlic for 15 seconds.",
      "Add zucchini and bell pepper; cook 3–4 minutes until just tender.",
      "Stir in peas and cherry tomatoes; cook 1–2 minutes until warmed through.",
      "Toss in the pasta, lemon zest, and a splash of reserved pasta water to loosen.",
      "Season with salt and pepper; finish with Parmesan and torn basil. Serve immediately."
    ],
    nutrition: { Calories: "520 kcal", Protein: "17g", Fat: "12g", Carbs: "86g" }
  },
  {
    id: 8,
    name: "Berry Yogurt Parfait",
    category: "Breakfast",
    image: "./assets/images/yogurt.jpg",
    shortDesc: "Creamy yogurt layered with berries and granola.",
    description: "A quick, no-cook breakfast with protein, fiber, and natural sweetness.",
    ingredients: [
      "1 cup Greek yogurt",
      "1 cup mixed berries (strawberry, blueberry, raspberry)",
      "1/3 cup granola",
      "1 tbsp honey",
      "1/2 tsp vanilla (optional)"
    ],
    steps: [
      "In a bowl, mix yogurt with vanilla (if using).",
      "Spoon a layer of yogurt into a glass or bowl.",
      "Add a layer of mixed berries followed by a sprinkle of granola.",
      "Repeat layers until ingredients are used.",
      "Drizzle honey on top just before serving to keep granola crisp."
    ],
    nutrition: { Calories: "300 kcal", Protein: "16g", Fat: "7g", Carbs: "44g" }
  },
  {
    id: 9,
    name: "Spicy Chickpea Wrap",
    category: "Lunch",
    image: "./assets/images/chickpea.jpg",
    shortDesc: "Toasted tortilla filled with spiced chickpeas and crisp veggies.",
    description: "A satisfying plant-based wrap with smoky spices and a cooling yogurt sauce.",
    ingredients: [
      "1 can chickpeas (drained & rinsed)",
      "1 tbsp olive oil",
      "1 tsp paprika",
      "1/2 tsp cumin",
      "Salt & pepper",
      "2 medium tortillas",
      "Lettuce leaves",
      "Tomato (sliced)",
      "Cucumber (sliced)",
      "2 tbsp plain yogurt",
      "1 tsp lemon juice"
    ],
    steps: [
      "Pat chickpeas dry; toss with olive oil, paprika, cumin, salt, and pepper.",
      "Pan-fry on medium heat 4–5 minutes until lightly crisp, stirring occasionally.",
      "Stir yogurt with lemon juice and a pinch of salt to make a quick sauce.",
      "Warm tortillas in a dry pan for 15–20 seconds per side.",
      "Assemble: spread yogurt sauce, add lettuce, tomato, cucumber, and chickpeas.",
      "Roll tightly into a wrap; toast seam-side down 1 minute to seal and serve."
    ],
    nutrition: { Calories: "480 kcal", Protein: "17g", Fat: "13g", Carbs: "74g" }
  }
];

// ===== Render Cards =====
// Mount point for generated recipe cards
const recipeContainer = document.getElementById("recipeContainer");

/**
 * Render a list of recipe cards into the grid
 * @param {Array} list - array of recipe objects
 */
function renderRecipes(list) {
  recipeContainer.innerHTML = "";
  list.forEach(r => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `
      <img src="${r.image}" alt="${r.name}">
      <div class="card-content">
        <h3>${r.name}</h3>
        <p>${r.shortDesc}</p>
      </div>`;
    // Open modal on card click
    card.addEventListener("click", () => openModal(r));
    recipeContainer.appendChild(card);
  });
}
renderRecipes(recipes);

// ===== Filter/Search =====
// Event listeners for category dropdown and live text search
document.getElementById("categoryFilter").addEventListener("change", filterRecipes);
// Live search while typing:
document.getElementById("searchInput").addEventListener("input", filterRecipes);

/**
 * Filter recipes by category and name (case-insensitive)
 * - Matches "all" category to include everything
 * - Name-only search (fast and simple)
 */
function filterRecipes() {
  const category = document.getElementById("categoryFilter").value;
  const search = document.getElementById("searchInput").value.toLowerCase().trim();

  const filtered = recipes.filter(r => {
    const matchesCategory = (category === "all" || r.category === category);
    const matchesSearch = r.name.toLowerCase().includes(search); // ✅ only name
    return matchesCategory && matchesSearch;
  });
  renderRecipes(filtered);
}


// ===== Modal =====
// Elements for modal control and close button
const modal = document.getElementById("recipeModal");
const closeModalBtn = document.getElementById("closeModal");

/**
 * Populate and open the recipe modal
 * - Fills title, description, ingredients, steps, and nutrition table
 */
function openModal(recipe) {
  modal.style.display = "flex";
  document.getElementById("modalTitle").textContent = recipe.name;
  document.getElementById("modalDescription").textContent = recipe.description;

  // Ingredients
  const ingList = document.getElementById("modalIngredients");
  ingList.innerHTML = "";
  recipe.ingredients.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ingList.appendChild(li);
  });

  // Steps
  const stepList = document.getElementById("modalSteps");
  stepList.innerHTML = "";
  recipe.steps.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s;
    stepList.appendChild(li);
  });

  // Nutrition
  const tbody = document.querySelector("#modalNutrition tbody");
  tbody.innerHTML = "";
  for (let key in recipe.nutrition) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${key}</td><td>${recipe.nutrition[key]}</td>`;
    tbody.appendChild(row);
  }
}

// Close modal handlers (X button and outside click)
closeModalBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
