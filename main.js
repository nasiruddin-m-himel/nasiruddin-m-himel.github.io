/* ============================================
   NASIRUDDIN MAHMUD HIMEL — Portfolio JS
   ============================================ */

// ============ TAB NAVIGATION ============
const tabBtns = document.querySelectorAll('.tab-btn');
const tabSections = document.querySelectorAll('.tab-section');

function activateTab(tabName) {
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  tabSections.forEach(sec => {
    sec.classList.toggle('active', sec.id === `tab-${tabName}`);
  });
  // Close mobile menu
  document.getElementById('mobile-menu').classList.remove('open');
  // Scroll to top of content smoothly
  document.getElementById('main-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

function scrollToSection(tab) {
  activateTab(tab);
}

// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// ============ CIRCUIT CANVAS BACKGROUND ============
(function initCircuit() {
  const canvas = document.getElementById('circuit-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], lines = [];
  const NODE_COUNT = 36;
  const ACCENT = '#00d4aa';
  const ACCENT2 = '#0099ff';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2,
      size: Math.random() * 2.5 + 1,
      type: Math.random() > 0.5 ? 'circle' : 'square',
      color: Math.random() > 0.6 ? ACCENT2 : ACCENT,
    };
  }

  function init() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());
  }

  function drawGrid(t) {
    const spacing = 60;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,212,170,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += spacing) {
      ctx.moveTo(x, 0); ctx.lineTo(x, H);
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.moveTo(0, y); ctx.lineTo(W, y);
    }
    ctx.stroke();
  }

  function drawLine(a, b, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.5;
    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, a.color.replace(')', `,${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace('00d4aa', '0,212,170,').replace('0099ff', '0,153,255,'));

    // Simplified: use a fixed rgba
    ctx.beginPath();
    ctx.strokeStyle = `rgba(0,212,170,${alpha * 0.6})`;
    ctx.lineWidth = 0.7;
    ctx.moveTo(a.x, a.y);

    // L-shaped circuit routing
    const mx = a.x + (b.x - a.x) * 0.5;
    ctx.lineTo(mx, a.y);
    ctx.lineTo(mx, b.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    // Corner dots
    ctx.beginPath();
    ctx.fillStyle = `rgba(0,212,170,${alpha * 1.2})`;
    ctx.arc(mx, a.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(mx, b.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    drawGrid(t);

    const maxDist = 220;

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) drawLine(nodes[i], nodes[j], dist, maxDist);
      }
    }

    // Draw nodes
    for (const n of nodes) {
      n.pulse += 0.02;
      const glow = (Math.sin(n.pulse) + 1) / 2;
      const alpha = 0.4 + glow * 0.5;
      const sz = n.size + glow * 1.5;

      ctx.save();
      ctx.shadowBlur = 8 + glow * 8;
      ctx.shadowColor = n.color;
      ctx.fillStyle = n.color.replace(')', `,${alpha})`).replace('#00d4aa', 'rgba(0,212,170,').replace('#0099ff', 'rgba(0,153,255,') + (n.color.startsWith('#') ? alpha + ')' : '');
      // Simplified fill
      ctx.fillStyle = `rgba(0,212,170,${alpha})`;

      if (n.type === 'square') {
        ctx.fillRect(n.x - sz / 2, n.y - sz / 2, sz, sz);
      } else {
        ctx.beginPath();
        ctx.arc(n.x, n.y, sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Update position
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  resize();
  init();
  window.addEventListener('resize', () => { resize(); init(); });
  requestAnimationFrame(draw);
})();

// ============ NAVBAR SCROLL BEHAVIOR ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(8,12,16,0.97)';
  } else {
    navbar.style.background = 'rgba(8,12,16,0.85)';
  }
});

// ============ CONTACT FORM ============
function handleFormSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('form-msg');
  msg.textContent = 'Thanks! I\'ll get back to you soon. ✓';
  e.target.reset();
  setTimeout(() => { msg.textContent = ''; }, 4000);
}

// ============ CYCLING STATS ============
const STAT_PAGES = [
  [
    { num: '3+',   label: 'Publications' },
    { num: '7+',   label: 'Projects' },
    { num: 'IEEE', label: 'Associate Director' },
  ],
  [
    { num: '96%',  label: 'GestureNet Accuracy' },
    { num: '32nm', label: 'CNFET SRAM' },
    { num: '4',    label: 'SRAM Topologies' },
  ],
  [
    { num: 'B.Sc', label: 'EECE @ MIST' },
    { num: '2027', label: 'Graduation Year' },
    { num: 'Dhaka', label: 'Bangladesh' },
  ],
  [
    { num: '3+',   label: 'Yrs Leadership' },
    { num: 'LFR',  label: 'Segment Lead' },
    { num: 'Club', label: 'Robotics Coord.' },
  ],
  [
    { num: '3+',   label: 'Yrs Freelancing' },
    { num: 'Math', label: 'Instructor' },
    { num: 'Art',  label: 'Digital Artist' },
  ],
];

let statPage = 0;

function setStatPage(page, animate = true) {
  statPage = (page + STAT_PAGES.length) % STAT_PAGES.length;
  const slots = [0, 1, 2];

  if (animate) {
    slots.forEach(i => {
      const el = document.getElementById(`stat-${i}`);
      if (el) { el.classList.add('fade-out'); el.classList.remove('fade-in'); }
    });
    setTimeout(() => renderStatPage(), 350);
  } else {
    renderStatPage();
  }

  // Update dots
  document.querySelectorAll('.stat-dot-ind').forEach(d => {
    d.classList.toggle('active', +d.dataset.i === statPage);
  });
}

function renderStatPage() {
  const data = STAT_PAGES[statPage];
  [0, 1, 2].forEach(i => {
    const numEl = document.getElementById(`stat-num-${i}`);
    const lblEl = document.getElementById(`stat-label-${i}`);
    const slot  = document.getElementById(`stat-${i}`);
    if (!numEl) return;
    numEl.textContent = data[i].num;
    lblEl.textContent = data[i].label;
    slot.classList.remove('fade-out');
    slot.classList.add('fade-in');
    // Remove class after animation
    setTimeout(() => slot.classList.remove('fade-in'), 500);
  });
  // Update dots
  document.querySelectorAll('.stat-dot-ind').forEach(d => {
    d.classList.toggle('active', +d.dataset.i === statPage);
  });
}

// Auto-cycle every 3s
let statTimer = setInterval(() => setStatPage(statPage + 1), 3000);

// Dot click navigation
window.addEventListener('DOMContentLoaded', () => {
  // Init first page without animation
  setStatPage(0, false);

  document.querySelectorAll('.stat-dot-ind').forEach(d => {
    d.addEventListener('click', () => {
      clearInterval(statTimer);
      setStatPage(+d.dataset.i);
      statTimer = setInterval(() => setStatPage(statPage + 1), 3000);
    });
  });
});

// ============ HERO ENTRY ANIMATION ============
window.addEventListener('DOMContentLoaded', () => {
  const heroEls = document.querySelectorAll('.hero-chip-label, .hero-name, .hero-tagline, .hero-cta, .hero-stats');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });
});
