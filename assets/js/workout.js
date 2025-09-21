'use strict';

// ========================================
// Workout Generator Logic
// - Configurable durations
// - Workout library
// - Plan generation
// - SVG circle timer
// - Controls: start / pause / stop
// ========================================



// =======================
// Configurable Durations
// =======================
const TIME_MULTIPLIER = 2;   // e.g., 2 = double the listed times
const MIN_TIME = 45;         // enforce at least 45s per exercise
const REST_SECONDS = 20;     // longer rest between exercises
const EXERCISES_PER_PLAN = 5; // try to give up to 5 moves per plan

// ================================
// Workout library (durations in s)
// Keys: bodyPart -> equipment -> []
// ================================
const WORKOUTS = {
  full: {
    none: [
      { name: "Jumping Jacks", time: 20 },
      { name: "Burpees", time: 30 },
      { name: "Mountain Climbers", time: 25 },
      { name: "Push-ups", time: 40 }
    ],
    dumbbells: [
      { name: "Dumbbell Squats", time: 40 },
      { name: "Shoulder Press", time: 30 },
      { name: "Bent-over Rows", time: 35 },
      { name: "Lunges", time: 45 }
    ],
    resistance: [
      { name: "Band Squats", time: 40 },
      { name: "Band Pull-aparts", time: 25 },
      { name: "Band Rows", time: 35 },
      { name: "Band Deadlifts", time: 40 }
    ],
    kettlebell: [
      { name: "Kettlebell Swings", time: 30 },
      { name: "Goblet Squats", time: 40 },
      { name: "Kettlebell Deadlifts", time: 35 }
    ],
    barbell: [
      { name: "Barbell Squats", time: 45 },
      { name: "Bench Press", time: 40 },
      { name: "Barbell Rows", time: 35 }
    ]
  },
  arms: {
    none: [
      { name: "Push-ups", time: 30 },
      { name: "Tricep Dips", time: 25 },
      { name: "Plank Shoulder Taps", time: 30 }
    ],
    dumbbells: [
      { name: "Bicep Curls", time: 25 },
      { name: "Overhead Tricep Extensions", time: 30 },
      { name: "Lateral Raises", time: 20 }
    ],
    resistance: [
      { name: "Band Bicep Curls", time: 25 },
      { name: "Band Tricep Kickbacks", time: 25 },
      { name: "Band Face Pulls", time: 30 }
    ],
    kettlebell: [
      { name: "Kettlebell Hammer Curls", time: 25 },
      { name: "Kettlebell Overhead Press", time: 30 },
      { name: "Kettlebell Upright Rows", time: 25 }
    ],
    barbell: [
      { name: "Barbell Bicep Curls", time: 25 },
      { name: "Close-grip Bench Press", time: 30 },
      { name: "Barbell Shrugs", time: 25 }
    ]
  },
  legs: {
    none: [
      { name: "Squats", time: 40 },
      { name: "Lunges", time: 40 },
      { name: "Glute Bridges", time: 35 },
      { name: "Calf Raises", time: 25 }
    ],
    dumbbells: [
      { name: "Goblet Squats", time: 40 },
      { name: "Step-ups", time: 35 },
      { name: "Deadlifts", time: 45 }
    ],
    resistance: [
      { name: "Band Squats", time: 40 },
      { name: "Monster Walks", time: 30 },
      { name: "Leg Abductions", time: 30 }
    ],
    kettlebell: [
      { name: "Kettlebell Lunges", time: 35 },
      { name: "Kettlebell Sumo Deadlifts", time: 40 },
      { name: "Kettlebell Goblet Squats", time: 35 }
    ],
    barbell: [
      { name: "Barbell Squats", time: 45 },
      { name: "Barbell Deadlifts", time: 45 },
      { name: "Barbell Hip Thrusts", time: 40 }
    ]
  },
  core: {
    none: [
      { name: "Sit-ups", time: 30 },
      { name: "Russian Twists", time: 25 },
      { name: "Plank", time: 45 },
      { name: "Bicycle Crunches", time: 30 }
    ],
    dumbbells: [
      { name: "Weighted Sit-ups", time: 30 },
      { name: "Dumbbell Side Bend", time: 25 }
    ],
    resistance: [
      { name: "Band Rotations", time: 30 },
      { name: "Band Deadbug", time: 25 },
      { name: "Band Crunches", time: 30 }
    ],
    kettlebell: [
      { name: "Kettlebell Side Bends", time: 25 },
      { name: "Kettlebell Russian Twists", time: 30 },
      { name: "Kettlebell Plank Rows", time: 30 }
    ],
    barbell: [
      { name: "Barbell Rollouts", time: 30 },
      { name: "Landmine Twists", time: 30 },
      { name: "Hanging Leg Raises", time: 25 }
    ]
  },
  back: {
    none: [
      { name: "Superman Hold", time: 30 },
      { name: "Reverse Snow Angels", time: 25 },
      { name: "Bird Dogs", time: 30 }
    ],
    dumbbells: [
      { name: "Dumbbell Deadlifts", time: 40 },
      { name: "Dumbbell Rows", time: 35 },
      { name: "Reverse Flys", time: 25 }
    ],
    barbell: [
      { name: "Barbell Deadlifts", time: 45 },
      { name: "Barbell Rows", time: 35 },
      { name: "Good Mornings", time: 30 }
    ]
  },
  chest: {
    none: [
      { name: "Push-ups", time: 30 },
      { name: "Wide-arm Push-ups", time: 25 },
      { name: "Incline Push-ups", time: 30 }
    ],
    dumbbells: [
      { name: "Dumbbell Bench Press", time: 40 },
      { name: "Dumbbell Flys", time: 30 },
      { name: "Incline Dumbbell Press", time: 35 }
    ],
    barbell: [
      { name: "Bench Press", time: 40 },
      { name: "Incline Bench Press", time: 35 },
      { name: "Barbell Pullover", time: 30 }
    ]
  },
  shoulders: {
    none: [
      { name: "Arm Circles", time: 20 },
      { name: "Pike Push-ups", time: 30 },
      { name: "Plank to Downward Dog", time: 25 }
    ],
    dumbbells: [
      { name: "Overhead Press", time: 30 },
      { name: "Front Raises", time: 25 },
      { name: "Arnold Press", time: 30 }
    ],
    kettlebell: [
      { name: "Kettlebell Press", time: 30 },
      { name: "Kettlebell High Pulls", time: 25 },
      { name: "Kettlebell Push Press", time: 30 }
    ]
  }
};

// =======================
// DOM element references
// =======================
const form = document.getElementById('workout-form');
const workoutList = document.getElementById('workoutList');
const timerBox = document.getElementById('timerBox');
const exerciseName = document.getElementById('exerciseName');
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startTimer');
const pauseBtn = document.getElementById('pauseTimer');
const stopBtn = document.getElementById('stopTimer');
const timerArc = document.getElementById('timerArc');

// ===== SVG arc constants (match SVG <circle r>) =====
const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

// ===== Runtime state =====
let timer;
let currentPlan = [];
let currentIndex = 0;
let paused = false;
let timeLeftGlobal = 0;
let currentExercise = null;

// ========================================
// Utils
// ========================================

/**
 * Scale a base duration by TIME_MULTIPLIER and enforce MIN_TIME
 * @param {number} seconds
 * @returns {number}
 */
function scaledTime(seconds) {
  return Math.max(MIN_TIME, Math.round(seconds * TIME_MULTIPLIER));
}

// ========================================
// Plan generation (form submit)
// ========================================
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bodyPart = document.getElementById('bodyPart').value;
  const equipment = document.getElementById('equipment').value;

  const exercises = (WORKOUTS[bodyPart] && WORKOUTS[bodyPart][equipment]) || [];
  const plan = [];
  const targetCount = Math.min(EXERCISES_PER_PLAN, exercises.length);

  // Pick unique random exercises for this plan
  const used = new Set();
  while (plan.length < targetCount) {
    const rand = exercises[Math.floor(Math.random() * exercises.length)];
    const key = rand.name;
    if (!used.has(key)) {
      used.add(key);
      // Push scaled copy (respect MIN_TIME and TIME_MULTIPLIER)
      plan.push({ name: rand.name, time: scaledTime(rand.time) });
    }
  }

  currentPlan = plan;
  currentIndex = 0;

  // Render plan list and prep timer UI
  workoutList.innerHTML = plan.map(ex => `<li>${ex.name} - ${ex.time}s</li>`).join('');
  timerBox.classList.remove('hidden');
  exerciseName.textContent = "Ready to start!";
  timerDisplay.textContent = "--";
});

// ========================================
// Timers
// ========================================

/**
 * Run a single exercise countdown with SVG arc animation
 * @param {{name:string,time:number}} ex
 * @param {Function} callback - called when exercise completes
 */
function runExercise(ex, callback) {
  clearInterval(timer);
  let timeLeft = ex.time;
  timeLeftGlobal = timeLeft;
  currentExercise = { ex, callback };

  exerciseName.textContent = ex.name;
  timerArc.style.strokeDasharray = `${CIRC} ${CIRC}`;
  timerArc.style.strokeDashoffset = CIRC;

  timer = setInterval(() => {
    if (!paused) {
      const pct = timeLeft / ex.time;
      timerArc.style.strokeDashoffset = CIRC * (1 - pct);
      timerDisplay.textContent = timeLeft + "s";

      if (timeLeft <= 0) {
        clearInterval(timer);
        new Audio('https://www.soundjay.com/button/beep-07.wav').play();
        callback();
      }
      timeLeft--;
      timeLeftGlobal = timeLeft;
    }
  }, 1000);
}

/**
 * Run rest period between exercises
 * @param {Function} callback - called when rest completes
 */
function runRest(callback) {
  clearInterval(timer);
  let timeLeft = REST_SECONDS;
  timeLeftGlobal = timeLeft;
  currentExercise = { ex: { name: "Rest", time: REST_SECONDS }, callback };

  exerciseName.textContent = "Rest";
  timerArc.style.strokeDasharray = `${CIRC} ${CIRC}`;
  timerArc.style.strokeDashoffset = CIRC;

  timer = setInterval(() => {
    if (!paused) {
      const pct = timeLeft / REST_SECONDS;
      timerArc.style.strokeDashoffset = CIRC * (1 - pct);
      timerDisplay.textContent = timeLeft + "s";

      if (timeLeft <= 0) {
        clearInterval(timer);
        new Audio('https://www.soundjay.com/button/beep-07.wav').play();
        callback();
      }
      timeLeft--;
      timeLeftGlobal = timeLeft;
    }
  }, 1000);
}

// ========================================
// Orchestration
// ========================================

/**
 * Drive the full workout plan (exercise -> rest -> next)
 */
function runWorkout() {
  if (currentIndex >= currentPlan.length) {
    exerciseName.textContent = "Workout Complete!";
    timerDisplay.textContent = "🎉";
    return;
  }
  runExercise(currentPlan[currentIndex], () => {
    currentIndex++;
    if (currentIndex < currentPlan.length) {
      runRest(runWorkout); // rest then next
    } else {
      runWorkout();
    }
  });
}

// ========================================
// Controls
// ========================================

// Start the plan from the beginning
startBtn.addEventListener('click', () => {
  if (currentPlan.length > 0) {
    currentIndex = 0;
    paused = false;
    pauseBtn.textContent = "Pause";
    runWorkout();
  }
});

// Toggle pause/resume
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

// Stop and reset timer visuals
stopBtn.addEventListener('click', () => {
  clearInterval(timer);
  paused = false;
  pauseBtn.textContent = "Pause";
  exerciseName.textContent = "Stopped";
  timerDisplay.textContent = "--";
  timerArc.style.strokeDashoffset = CIRC;
});
