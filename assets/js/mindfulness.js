'use strict';

/* ========================================
   Mindfulness: Meditation & Pomodoro logic
   - State management
   - Breathing animation sequencing
   - Pomodoro timer with sessions counter
   - Ambient sounds (toggle + selection)
   - UI bindings and initialization
   ======================================== */


/* ===== State ===== */
// Current app mode (meditation or pomodoro)
let mode = 'meditation';
// Play/pause state
let isRunning = false;

// Timer handles for intervals/timeouts
let timerInterval = null;
let breatheTimeout = null;

// Timestamps for meditation elapsed time
let startTime = 0;
let elapsedSec = 0;

// Breathing phase tracking
let currentPhase = 'inhale';
const PHASE_ORDER = ['inhale','hold','exhale','rest'];
// Phase durations (ms); sync with CSS keyframes for smoothness
// total cycle: 18s
const PHASE_MS = { inhale: 6000, hold: 3000, exhale: 6000, rest: 3000 };

// Pomodoro state
let inBreak = false;
const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;
const MEDITATION_SESSION_SECONDS = 60; // minimum runtime to count a session
let remainingSec = POMODORO_WORK;

// Persisted completed sessions (localStorage)
let sessions = parseInt(localStorage.getItem('sessionsCompleted') || '0', 10);


/* ===== DOM ===== */
// Background particle layer
const particlesLayer = document.querySelector('.bg-particles');
// Breathing circle core for CSS-driven animation
const circle = document.getElementById('breathingCircle').querySelector('.circle-core');
// Text/instruction and timer readout
const instruction = document.getElementById('instruction');
const timerEl = document.getElementById('timer');
// Session counter UI
const sessionsEl = document.getElementById('sessionsCount');
// Controls
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');
const meditationBtn = document.getElementById('meditationMode');
const pomodoroBtn = document.getElementById('pomodoroMode');
const soundToggle = document.getElementById('soundToggleSwitch');

// NEW: notes for each mode
const medNote = document.getElementById('medNote');
const pomoNote = document.getElementById('pomoNote');


/* ===== Particles ===== */
/**
 * Create soft floating particles for subtle background motion
 * @param {number} amount - number of dots
 */
function createParticles(amount = 36) {
  if (!particlesLayer) return;
  particlesLayer.innerHTML = '';
  for (let i = 0; i < amount; i++) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    const size = 4 + Math.random() * 4;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.bottom = `-${10 + Math.random() * 20}px`;
    dot.style.animationDuration = `${9 + Math.random() * 6}s`;
    dot.style.animationDelay = `${Math.random() * 4}s`;
    dot.style.opacity = `${0.25 + Math.random() * 0.6}`;
    particlesLayer.appendChild(dot);
  }
}


/* ===== Helpers ===== */
/**
 * Format seconds as MM:SS
 */
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
/**
 * Smoothly swap instruction text with a short fade
 */
function setInstruction(txt) {
  instruction.style.opacity = 0;
  setTimeout(() => {
    instruction.textContent = txt;
    instruction.style.opacity = 1;
  }, 200);
}
/**
 * Update timer display text
 */
function updateTimerDisplay(sec) { timerEl.textContent = fmt(sec); }
/**
 * Update sessions count (DOM + localStorage)
 */
function setSessions(n) {
  sessionsEl.textContent = n;
  localStorage.setItem('sessionsCompleted', String(n));
}


/* ===== Mode switching ===== */
/**
 * Switch between meditation and pomodoro modes
 * - Resets state and updates UI highlights/notes
 */
function switchMode(newMode) {
  if (mode === newMode) return;
  stopAll();
  mode = newMode;

  meditationBtn.classList.toggle('active', mode === 'meditation');
  pomodoroBtn.classList.toggle('active', mode === 'pomodoro');

  // toggle notes (white text like original pomo note)
  if (medNote && pomoNote) {
    medNote.hidden = (mode !== 'meditation');
    pomoNote.hidden = (mode !== 'pomodoro');
  }

  circle.classList.remove('breathe');
  setInstruction('Click Start');
  elapsedSec = 0;
  remainingSec = POMODORO_WORK;
  inBreak = false;
  updateTimerDisplay(mode === 'meditation' ? 0 : remainingSec);
}
meditationBtn.addEventListener('click', () => switchMode('meditation'));
pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));


/* ===== Start / Stop / Reset ===== */
// Play/Pause button toggles session
playBtn.addEventListener('click', () => {
  if (!isRunning) startSession();
  else stopSession();
});
// Hard reset button
resetBtn.addEventListener('click', resetSession);
// Allow clicking the circle to trigger play/pause
document.getElementById('breathingCircle').addEventListener('click', () => playBtn.click());

/**
 * Begin current mode session
 */
function startSession() {
  isRunning = true;
  playBtn.textContent = 'Pause';
  playBtn.classList.add('active');
  if (mode === 'meditation') startMeditation();
  else startPomodoro();
}
/**
 * Pause current session
 * - In meditation, count session if threshold met
 */
function stopSession() {
  isRunning = false;
  playBtn.textContent = 'Start';
  playBtn.classList.remove('active');
  if (mode === 'meditation' && elapsedSec >= MEDITATION_SESSION_SECONDS) setSessions(++sessions);
  stopAll();
}
/**
 * Full reset to initial UI and counters
 */
function resetSession() {
  stopAll();
  isRunning = false;
  playBtn.textContent = 'Start';
  playBtn.classList.remove('active');
  elapsedSec = 0;
  remainingSec = POMODORO_WORK;
  inBreak = false;
  circle.classList.remove('breathe');
  setInstruction('Click Start');
  updateTimerDisplay(mode === 'meditation' ? 0 : remainingSec);
}
/**
 * Clear timers and remove breathing class
 */
function stopAll() {
  clearInterval(timerInterval);
  clearTimeout(breatheTimeout);
  timerInterval = null;
  breatheTimeout = null;
  circle.classList.remove('breathe');
}


/* ===== Meditation ===== */
/**
 * Start meditation mode
 * - Adds breathing class for CSS animation
 * - Starts elapsed time counter
 * - Kicks off breathing phase loop
 */
function startMeditation() {
  circle.classList.add('breathe');
  startTime = Date.now() - elapsedSec * 1000;
  timerInterval = setInterval(() => {
    elapsedSec = Math.floor((Date.now() - startTime) / 1000);
    updateTimerDisplay(elapsedSec);
  }, 1000);
  currentPhase = 'inhale';
  runBreathingCycle();
}
/**
 * Recursive breathing phase sequencer
 * - inhale -> hold -> exhale -> rest -> repeat
 */
function runBreathingCycle() {
  if (!isRunning || mode !== 'meditation') return;
  const textMap = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Rest'
  };
  setInstruction(textMap[currentPhase]);
  const duration = PHASE_MS[currentPhase];
  breatheTimeout = setTimeout(() => {
    const idx = PHASE_ORDER.indexOf(currentPhase);
    currentPhase = PHASE_ORDER[(idx + 1) % PHASE_ORDER.length];
    runBreathingCycle();
  }, duration);
}


/* ===== Pomodoro ===== */
/**
 * Start a Pomodoro work/break segment
 * - Counts down remainingSec
 * - Flips between work and break on zero
 * - Increments sessions on work completion
 */
function startPomodoro() {
  setInstruction(inBreak ? 'Break' : 'Focus!');
  updateTimerDisplay(remainingSec);
  timerInterval = setInterval(() => {
    if (remainingSec <= 0) {
      clearInterval(timerInterval);
      if (!inBreak) {
        setSessions(++sessions);
        inBreak = true;
        remainingSec = POMODORO_BREAK;
        setInstruction('Break');
      } else {
        inBreak = false;
        remainingSec = POMODORO_WORK;
        setInstruction('Focus!');
      }
      if (isRunning) startPomodoro();
      return;
    }
    remainingSec -= 1;
    updateTimerDisplay(remainingSec);
  }, 1000);
}


/* ===== Ambient Sounds (using audio files) ===== */
// Current <audio> instance + state
let currentAudio = null;
let activeSound = null;
let soundEnabled = false;

/**
 * Stop and reset current sound
 */
function stopSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Play selected ambient loop if enabled
 * @param {string} type - filename base within ./assets/sounds/
 */
function playAmbient(type) {
  stopSound();
  if (!soundEnabled) return;

  // Load audio file from assets/sounds/
  currentAudio = new Audio(`./assets/sounds/${type}.mp3`);
  currentAudio.loop = true;
  currentAudio.volume = 0.5; // adjust volume here
  currentAudio.play();
}

// Sound selection buttons (set active and play/stop accordingly)
document.querySelectorAll('.sound-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSound = btn.dataset.sound;
    if (soundEnabled) {
      playAmbient(activeSound);
    } else {
      stopSound();
    }
  }, { passive: true });
});

// Global ON/OFF switch for ambient sound
soundToggle.addEventListener('change', (e) => {
  soundEnabled = e.target.checked;
  if (soundEnabled && activeSound) {
    playAmbient(activeSound);
  } else {
    stopSound();
  }
});


/* ===== Init ===== */
/**
 * Initial UI setup on DOM ready
 * - Show med note by default
 * - Load sessions count
 * - Reset display labels
 * - Spawn particles
 */
document.addEventListener("DOMContentLoaded", () => {
  // ensure the correct note is visible for default mode
  if (medNote && pomoNote) {
    medNote.hidden = false;
    pomoNote.hidden = true;
  }
  setSessions(sessions);
  updateTimerDisplay(0);
  setInstruction('Click Start');
  createParticles();
});
