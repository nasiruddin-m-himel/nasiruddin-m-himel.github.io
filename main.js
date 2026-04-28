/* ============================================
   NASIRUDDIN MAHMUD HIMEL — main.js
   Public site loads normally.
   Secret 🌸 in footer opens login for Mohona.
   ============================================ */

// ============ SECRET LOGIN ============
// Add more users here as needed:
const USERS = {
  mohona: { pass: 'loveshimel', role: 'mohona' },
  // nextuser: { pass: 'theirpassword', role: 'mohona' }, // future logins
};

function openLogin() {
  document.getElementById('login-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('l-user').focus(), 50);
  document.getElementById('login-err').textContent = '';
  document.getElementById('mobile-menu').classList.remove('open');
}
function closeLogin() {
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('l-user').value = '';
  document.getElementById('l-pass').value = '';
  document.getElementById('login-err').textContent = '';
}
function doLogin() {
  const user = document.getElementById('l-user').value.trim().toLowerCase();
  const pass = document.getElementById('l-pass').value;
  const err  = document.getElementById('login-err');

  if (USERS[user] && USERS[user].pass === pass) {
    closeLogin();
    const role = USERS[user].role;
    if (role === 'mohona') {
      document.getElementById('main-site').classList.add('hidden');
      document.getElementById('mohona-page').classList.remove('hidden');
      initMohonaPage();
    }
    // Add more role handlers here in future
  } else {
    err.textContent = 'Wrong username or password.';
    document.getElementById('l-pass').value = '';
    document.getElementById('l-pass').focus();
  }
}
function doLogout() {
  document.getElementById('mohona-page').classList.add('hidden');
  document.getElementById('main-site').classList.remove('hidden');
  if (moTimer) clearInterval(moTimer);
}

// Wire up Login tab buttons (desktop + mobile)
document.getElementById('login-tab-btn').addEventListener('click', openLogin);
document.getElementById('login-tab-btn-mobile').addEventListener('click', openLogin);
document.getElementById('login-btn').addEventListener('click', doLogin);
['l-user','l-pass'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => { if (e.key==='Enter') doLogin(); });
});
document.getElementById('eye-btn').addEventListener('click', () => {
  const inp = document.getElementById('l-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLogin(); });

// ============ MOHONA PAGE ============
let moTimer = null, moIndex = 0;
const MO_TOTAL = 4;

function initMohonaPage() {
  buildMoDots();
  goToSlide(0);
  moTimer = setInterval(() => moSlide(1), 4000);
  initPetalCanvas();
}
function buildMoDots() {
  const el = document.getElementById('mo-dots');
  if (!el) return;
  el.innerHTML = '';
  for (let i = 0; i < MO_TOTAL; i++) {
    const b = document.createElement('button');
    b.className = 'mo-dot' + (i===0?' active':'');
    b.addEventListener('click', () => {
      goToSlide(i);
      clearInterval(moTimer);
      moTimer = setInterval(() => moSlide(1), 4000);
    });
    el.appendChild(b);
  }
}
function goToSlide(idx) {
  moIndex = ((idx % MO_TOTAL) + MO_TOTAL) % MO_TOTAL;
  document.querySelectorAll('.mo-slide').forEach((s,i) => s.classList.toggle('active', i===moIndex));
  document.querySelectorAll('.mo-dot').forEach((d,i)  => d.classList.toggle('active', i===moIndex));
}
function moSlide(dir) { goToSlide(moIndex + dir); }

function initPetalCanvas() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const PETALS = [];
  const SYMBOLS = ['🌸','🌺','✿','❀','🌷','💕','♡'];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function makePetal() {
    return { x:Math.random()*W, y:-40, size:14+Math.random()*18,
      speed:0.6+Math.random()*1.2, drift:(Math.random()-.5)*.8,
      rot:Math.random()*360, rotSpeed:(Math.random()-.5)*2,
      symbol:SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)],
      opacity:0.35+Math.random()*0.45 };
  }
  for (let i=0;i<18;i++) { const p=makePetal(); p.y=Math.random()*H; PETALS.push(p); }

  let frame=0;
  function draw() {
    ctx.clearRect(0,0,W,H);
    if (frame++%20===0 && PETALS.length<35) PETALS.push(makePetal());
    for (let i=PETALS.length-1;i>=0;i--) {
      const p=PETALS[i];
      p.y+=p.speed; p.x+=p.drift+Math.sin(p.y*.02)*.5; p.rot+=p.rotSpeed;
      ctx.save(); ctx.globalAlpha=p.opacity;
      ctx.font=`${p.size}px serif`;
      ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
      ctx.fillText(p.symbol,-p.size/2,p.size/2);
      ctx.restore();
      if (p.y>H+50) PETALS.splice(i,1);
    }
    requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}

// ============ MAIN SITE — TABS ============
const tabBtns = document.querySelectorAll('#main-site .tab-btn');
const tabSections = document.querySelectorAll('.tab-section');

function activateTab(name) {
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab===name));
  tabSections.forEach(s => s.classList.toggle('active', s.id===`tab-${name}`));
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('main-content').scrollIntoView({behavior:'smooth',block:'start'});
}
tabBtns.forEach(b => { if(b.dataset.tab) b.addEventListener('click', ()=>activateTab(b.dataset.tab)); });
window.scrollToSection = activateTab;

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('open');
});

// Navbar scroll tint
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(8,12,16,0.97)' : 'rgba(8,12,16,0.85)';
});

// Contact form
window.handleFormSubmit = function(e) {
  e.preventDefault();
  const msg = document.getElementById('form-msg');
  msg.textContent = "Thanks! I'll get back to you soon. ✓";
  e.target.reset();
  setTimeout(() => { msg.textContent = ''; }, 4000);
};

// ============ CYCLING STATS ============
const STAT_PAGES = [
  [{num:'3+',label:'Publications'},{num:'7+',label:'Projects'},{num:'IEEE',label:'Assoc. Director'}],
  [{num:'96%',label:'GestureNet Acc.'},{num:'32nm',label:'CNFET SRAM'},{num:'4',label:'SRAM Topologies'}],
  [{num:'B.Sc',label:'EECE @ MIST'},{num:'2027',label:'Graduating'},{num:'Dhaka',label:'Bangladesh'}],
  [{num:'3+',label:'Yrs Leadership'},{num:'LFR',label:'Segment Lead'},{num:'RC',label:'Robotics Coord.'}],
  [{num:'3+',label:'Yrs Freelancing'},{num:'Math',label:'Instructor'},{num:'Art',label:'Digital Artist'}],
];
let statPage=0, statTimer=null;

function renderStatPage() {
  const data = STAT_PAGES[statPage];
  [0,1,2].forEach(i => {
    const n=document.getElementById('stat-num-'+i);
    const l=document.getElementById('stat-label-'+i);
    const s=document.getElementById('stat-'+i);
    if (!n||!l||!s) return;
    n.textContent=data[i].num; l.textContent=data[i].label;
    s.classList.remove('fade-out'); s.classList.add('fade-in');
    setTimeout(()=>s.classList.remove('fade-in'),500);
  });
  document.querySelectorAll('.stat-dot-ind').forEach(d=>d.classList.toggle('active',+d.dataset.i===statPage));
}
function setStatPage(page, animate) {
  statPage = ((page%STAT_PAGES.length)+STAT_PAGES.length)%STAT_PAGES.length;
  if (animate) {
    [0,1,2].forEach(i=>{const el=document.getElementById('stat-'+i);if(el){el.classList.add('fade-out');el.classList.remove('fade-in');}});
    setTimeout(renderStatPage, 350);
  } else { renderStatPage(); }
  document.querySelectorAll('.stat-dot-ind').forEach(d=>d.classList.toggle('active',+d.dataset.i===statPage));
}
function startStatTimer() {
  if (statTimer) clearInterval(statTimer);
  statTimer = setInterval(()=>setStatPage(statPage+1,true), 3000);
}

// ============ CIRCUIT CANVAS ============
(function initCircuit() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes=[];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  function makeNode(){return{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,pulse:Math.random()*Math.PI*2,size:Math.random()*2.5+1,type:Math.random()>.5?'circle':'square'};}
  function init(){nodes=[];for(let i=0;i<36;i++)nodes.push(makeNode());}
  function drawGrid(){ctx.beginPath();ctx.strokeStyle='rgba(0,212,170,0.03)';ctx.lineWidth=1;for(let x=0;x<W;x+=60){ctx.moveTo(x,0);ctx.lineTo(x,H);}for(let y=0;y<H;y+=60){ctx.moveTo(0,y);ctx.lineTo(W,y);}ctx.stroke();}
  function drawLine(a,b,d,max){const alpha=(1-d/max)*.5;ctx.beginPath();ctx.strokeStyle=`rgba(0,212,170,${alpha*.6})`;ctx.lineWidth=.7;const mx=a.x+(b.x-a.x)*.5;ctx.moveTo(a.x,a.y);ctx.lineTo(mx,a.y);ctx.lineTo(mx,b.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle=`rgba(0,212,170,${alpha*1.2})`;ctx.beginPath();ctx.arc(mx,a.y,2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(mx,b.y,2,0,Math.PI*2);ctx.fill();}
  function draw(){ctx.clearRect(0,0,W,H);drawGrid();const maxD=220;for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<maxD)drawLine(nodes[i],nodes[j],d,maxD);}for(const n of nodes){n.pulse+=.02;const g=(Math.sin(n.pulse)+1)/2,a=.4+g*.5,sz=n.size+g*1.5;ctx.save();ctx.shadowBlur=8+g*8;ctx.shadowColor='#00d4aa';ctx.fillStyle=`rgba(0,212,170,${a})`;if(n.type==='square'){ctx.fillRect(n.x-sz/2,n.y-sz/2,sz,sz);}else{ctx.beginPath();ctx.arc(n.x,n.y,sz,0,Math.PI*2);ctx.fill();}ctx.restore();n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;}requestAnimationFrame(draw);}
  resize();init();window.addEventListener('resize',()=>{resize();init();});requestAnimationFrame(draw);
})();

// ============ INIT ON LOAD ============
window.addEventListener('DOMContentLoaded', () => {
  // Stats
  setStatPage(0, false);
  startStatTimer();
  document.querySelectorAll('.stat-dot-ind').forEach(d => {
    d.addEventListener('click', () => { setStatPage(+d.dataset.i,true); startStatTimer(); });
  });

  // Hero entry animation
  const heroEls = document.querySelectorAll('.hero-chip-label,.hero-name,.hero-tagline,.hero-cta,.hero-stats');
  heroEls.forEach((el,i) => {
    el.style.opacity='0'; el.style.transform='translateY(22px)';
    el.style.transition=`opacity .7s ease ${i*.12}s, transform .7s ease ${i*.12}s`;
    setTimeout(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; },50);
  });
});
