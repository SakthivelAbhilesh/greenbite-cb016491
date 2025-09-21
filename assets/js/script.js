'use strict';



/**
 * Utility: add event on element(s)
 * - Accepts a single element or a NodeList/HTMLCollection
 * - Adds the same listener to all when multiple
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * Navbar toggle / overlay control
 * - Opens/closes mobile nav
 * - Closes nav on link click
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navLinks, "click", closeNavbar);



/**
 * Header + back-to-top activation on scroll
 * - Adds 'active' after 100px scroll
 */
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * Scroll reveal effect
 * - Adds 'active' to any [data-section] that crosses mid-viewport
 */
const sections = document.querySelectorAll("[data-section]");

const reveal = function () {
  for (let i = 0; i < sections.length; i++) {

    if (sections[i].getBoundingClientRect().top < window.innerHeight / 2) {
      sections[i].classList.add("active");
    }

  }
}

reveal();
addEventOnElem(window, "scroll", reveal);

// ===== rotating hero quotes (append to end of script.js) =====
/**
 * Rotating hero quotes
 * - Fades out, swaps text, fades in on a timer
 * - Pauses on hover
 */
(function () {
  const quotes = [
    "Eat healthy, live healthy.",
    "Your body deserves the best fuel.",
    "Fitness is not a destination, it's a lifestyle.",
    "Small steps every day lead to big results.",
    "Hydrate, nourish, and move."
  ];

  let currentIndex = 0;
  const quoteElement = document.getElementById('hero-quote');

  if (!quoteElement) {
    console.warn('hero-quote element not found. Make sure the span exists in the HTML.');
    return;
  }

  const fadeDuration = 600;      // ms — should match the CSS transition (0.6s)
  const displayDuration = 3000;  // ms — visible time between transitions
  let timeoutId;
  let paused = false;

  function scheduleNext() {
    timeoutId = setTimeout(() => {
      // fade out
      quoteElement.style.opacity = '0';

      // after fade out, swap text and fade in
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % quotes.length;
        quoteElement.textContent = quotes[currentIndex];
        quoteElement.style.opacity = '1';

        // schedule next cycle
        scheduleNext();
      }, fadeDuration);
    }, displayDuration);
  }

  // start rotation
  quoteElement.style.opacity = '1';
  scheduleNext();

  // pause rotation while user hovers over the quote
  quoteElement.addEventListener('mouseenter', () => {
    paused = true;
    clearTimeout(timeoutId);
  });

  quoteElement.addEventListener('mouseleave', () => {
    if (paused) {
      paused = false;
      scheduleNext();
    }
  });
})();


// ===== health tip of the day =====
/**
 * Health Tip of the Day
 * - Picks a tip based on today's date (rotates daily)
 * - Fills date, title, and text into the card if elements exist
 */
(function () {
  const healthTips = [
    { title: "Drink More Water", text: "Start your day with a glass of water and stay hydrated throughout the day." },
    { title: "Take Short Walks", text: "A 10-minute walk after meals improves digestion and circulation." },
    { title: "Eat More Greens", text: "Leafy vegetables provide essential vitamins and fiber." },
    { title: "Get Enough Sleep", text: "Aim for 7–8 hours of quality sleep to recharge your body." },
    { title: "Limit Processed Foods", text: "Choose whole, natural foods for better energy and long-term health." },
    { title: "Stretch Daily", text: "Gentle stretching reduces stiffness and improves flexibility." },
    { title: "Practice Deep Breathing", text: "Calm your mind and reduce stress with 5 minutes of deep breathing." }
  ];

  const today = new Date();
  const index = today.getDate() % healthTips.length; // rotate daily
  const tip = healthTips[index];

  // Fill in the HTML
  const dateElem = document.getElementById("health-tip-date");
  const titleElem = document.getElementById("health-tip-title");
  const textElem = document.getElementById("health-tip-text");

  if (dateElem && titleElem && textElem) {
    // Show today's date
    dateElem.textContent = today.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    // Fill in tip
    titleElem.textContent = tip.title;
    textElem.textContent = tip.text;
  }
})();
