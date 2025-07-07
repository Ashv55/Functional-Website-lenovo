// === CLOCK ===
// Updates the clock every second
function updateClock() {
  const now = new Date(); // current time
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000); // update every second
updateClock(); // also run immediately

// === QUOTE ===
// List of motivational quotes
const quotes = [
  "Believe in yourself!",
  "Stay positive.",
  "Keep learning every day.",
  "Dream big and dare to fail."
];
// Shows a random quote
function showQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById('quote').textContent = quotes[random];
}

// === NOTES ===
// Keeps the note in local storage so it doesn't disappear
const noteArea = document.getElementById('note');
noteArea.value = localStorage.getItem('myNote') || "";
noteArea.addEventListener('input', () => {
  localStorage.setItem('myNote', noteArea.value);
});

// === SOUND ===
// Simple sine wave tone using Web Audio API
let audioCtx, oscillator;
function toggleSound() {
  if (!audioCtx) {
    // Create audio context and oscillator the first time
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(432, audioCtx.currentTime); // 432 Hz tone
    oscillator.connect(audioCtx.destination);
    oscillator.start();
  } else if (audioCtx.state === 'running') {
    audioCtx.suspend(); // pause sound
  } else {
    audioCtx.resume(); // play sound
  }
}

// === DARK MODE ===
// Toggle between dark and light themes
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  // Save choice to local storage
  localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'true' : 'false');
}
// Apply saved mode on page load
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}

// === CANVAS BACKGROUND ANIMATION ===
// Creates small circles that float around as background effect
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let circles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  circles = Array.from({length: 50}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    dx: (Math.random()-0.5)*0.5,
    dy: (Math.random()-0.5)*0.5,
    radius: Math.random()*3+1
  }));
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
// Animation loop
function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  circles.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x,c.y,c.radius,0,Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
    // move and bounce on edge
    c.x += c.dx;
    c.y += c.dy;
    if (c.x<0||c.x>canvas.width) c.dx*=-1;
    if (c.y<0||c.y>canvas.height) c.dy*=-1;
  });
  requestAnimationFrame(animate);
}
animate();

// === INTERSECTION OBSERVER ===
// Fade in widgets as they scroll into view
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting)
      entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
document.querySelectorAll('.widget').forEach(w => observer.observe(w));

// === DIGITAL ART GALLERY AUTO-SLIDE + FULLSCREEN PREVIEW + MOUSE MOVE ===

// Auto-slide gallery left and right
let scrollPos = 0;
let direction = 1; // 1 = right, -1 = left
const gallery = document.getElementById('galleryContainer');

function autoSlideGallery() {
  scrollPos += direction * 0.3; // speed
  // reverse direction when reaching ends
  if (scrollPos <= 0 || scrollPos >= gallery.scrollWidth - gallery.clientWidth) {
    direction *= -1;
  }
  gallery.scrollLeft = scrollPos;
  requestAnimationFrame(autoSlideGallery);
}
autoSlideGallery();

// Mouse move effect: move gallery images slightly
const galleryImages = document.querySelectorAll('.gallery-container img');
document.querySelector('.gallery').addEventListener('mousemove', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width/2;
  const y = e.clientY - rect.top - rect.height/2;
  galleryImages.forEach(img => {
    img.style.transform = `translate(${x*0.02}px, ${y*0.02}px)`; // move a bit
  });
});
document.querySelector('.gallery').addEventListener('mouseleave', () => {
  galleryImages.forEach(img => img.style.transform = '');
});

// Fullscreen preview
const overlay = document.getElementById('fullscreenOverlay');
const fullscreenImg = document.getElementById('fullscreenImage');
const closeBtn = document.getElementById('closeBtn');

// On click image → show overlay
galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    fullscreenImg.src = img.src;
    overlay.style.display = 'flex';
  });
});

// Close overlay
closeBtn.addEventListener('click', () => {
  overlay.style.display = 'none';
});
