'use strict';

/**
 * Calorie & Nutrition calculator
 * - Mifflin-St Jeor BMR
 * - TDEE = BMR * activity
 * - Target: maintain / gain(+500) / lose(-500)
 * - Macros: Protein 1.8g/kg, Fat 0.8g/kg, Carbs = remainder
 */

// ===== Preset food suggestions for each goal =====
const SUGGESTIONS = {
  gain: [
    "Peanut butter sandwich",
    "Bananas & whole milk",
    "Rice with chicken",
    "Oats with honey",
    "Smoothies with nuts",
    "Trail mix"
  ],
  lose: [
    "Boiled eggs",
    "Grilled chicken & salad",
    "Steamed broccoli",
    "Oatmeal with berries",
    "Greek yogurt",
    "Apple slices with peanut butter"
  ],
  maintain: [
    "Brown rice & veggies",
    "Baked fish",
    "Seasonal fruits",
    "Whole wheat toast",
    "Vegetable soup",
    "Cottage cheese"
  ]
};

// ===== Cached DOM refs (form + inputs + outputs) =====
const form = document.getElementById('cal-form');
const ageEl = document.getElementById('cal-age');
const heightEl = document.getElementById('cal-height');
const weightEl = document.getElementById('cal-weight');
const activityEl = document.getElementById('cal-activity');

const bmrVal = document.getElementById('bmrVal');
const tdeeVal = document.getElementById('tdeeVal');
const targetVal = document.getElementById('targetVal');

const pGr = document.getElementById('pGr');
const pCal = document.getElementById('pCal');
const pPct = document.getElementById('pPct');
const fGr = document.getElementById('fGr');
const fCal = document.getElementById('fCal');
const fPct = document.getElementById('fPct');
const cGr = document.getElementById('cGr');
const cCal = document.getElementById('cCal');
const cPct = document.getElementById('cPct');

const foodList = document.getElementById('foodList');

// ==== Donut helpers (SVG) ====
// Stroke-based circular progress for BMR/TDEE/Target
const RADIUS = 52; // must match r in HTML <circle>
const CIRC = 2 * Math.PI * RADIUS;

/**
 * Animate donut progress
 * @param {string} arcId - target circle element id
 * @param {number} value - current value
 * @param {number} max - max value for full circle
 */
function setDonut(arcId, value, max) {
  const arc = document.getElementById(arcId);
  if (!arc) return;

  const pct = Math.max(0, Math.min(1, value / max));
  const filled = CIRC * pct;

  arc.style.strokeDasharray = `${CIRC} ${CIRC}`;

  // reset instantly
  arc.style.transition = 'none';
  arc.style.strokeDashoffset = `${CIRC}`;

  // animate next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      arc.style.transition = 'stroke-dashoffset 1.2s ease';
      arc.style.strokeDashoffset = `${CIRC - filled}`;
    });
  });
}

/**
 * Count-up numbers inside donut (inline "kcal")
 * @param {HTMLElement} el - element to update
 * @param {number} to - final number
 * @param {number} duration - animation time (ms)
 */
function countUp(el, to, duration = 800) {
  const startTime = performance.now();
  function tick(now) {
    const p = Math.min(1, (now - startTime) / duration);
    el.textContent = Math.round(to * p); 
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ==== Form handler ====
// Main submit: validates, calculates BMR/TDEE/target, updates UI
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Read radio selections safely (fallback to 'maintain' for goal)
  const gender = (document.querySelector('input[name="cal-gender"]:checked') || {}).value;
  const goal = (document.querySelector('input[name="cal-goal"]:checked') || {}).value || 'maintain';

  // Parse numeric inputs
  const age = Number(ageEl.value);
  const height = Number(heightEl.value);
  const weight = Number(weightEl.value);
  const activity = Number(activityEl.value);

  // Basic completeness check
  if (!gender || !age || !height || !weight || !activity) {
    alert('Please complete all fields.');
    return;
  }

  // BMR (Mifflin-St Jeor)
  const bmr = gender === 'male'
    ? (10 * weight + 6.25 * height - 5 * age + 5)
    : (10 * weight + 6.25 * height - 5 * age - 161);

  // Total Daily Energy Expenditure
  const tdee = bmr * activity;

  // Target calories by goal
  let target = tdee;
  if (goal === 'gain') target += 500;
  if (goal === 'lose') target -= 500;
  target = Math.max(1000, target); // simple floor for safety

  // === Animate Donuts ===
  const MAX = 4000; // max scale for donuts
  setDonut("bmrArc", bmr, MAX);
  setDonut("tdeeArc", tdee, MAX);
  setDonut("targetArc", target, MAX);

  // Count-up numbers
  countUp(bmrVal, Math.round(bmr));
  countUp(tdeeVal, Math.round(tdee));
  countUp(targetVal, Math.round(target));

  // === Macros ===
  // Protein/Fat by bodyweight; Carbs = remaining calories
  const proteinGr = Math.round(weight * 1.8);   // g/day
  const fatGr = Math.round(weight * 0.8);       // g/day
  const proteinCal = proteinGr * 4;
  const fatCal = fatGr * 9;
  let carbsCal = Math.max(0, Math.round(target - proteinCal - fatCal));
  let carbsGr = Math.round(carbsCal / 4);

  const pPctVal = Math.round((proteinCal / target) * 100);
  const fPctVal = Math.round((fatCal / target) * 100);
  const cPctVal = Math.max(0, 100 - pPctVal - fPctVal); // sum to ~100%

  // Update macro table cells
  pGr.textContent = `${proteinGr} g`;
  pCal.textContent = `${proteinCal} kcal`;
  pPct.textContent = `${pPctVal}%`;

  fGr.textContent = `${fatGr} g`;
  fCal.textContent = `${fatCal} kcal`;
  fPct.textContent = `${fPctVal}%`;

  cGr.textContent = `${carbsGr} g`;
  cCal.textContent = `${carbsCal} kcal`;
  cPct.textContent = `${cPctVal}%`;

  // === Food Suggestions ===
  // Replace list items based on selected goal
  const items = (SUGGESTIONS[goal] || SUGGESTIONS.maintain)
    .map(item => `<li>${item}</li>`).join('');
  foodList.innerHTML = items;
});
