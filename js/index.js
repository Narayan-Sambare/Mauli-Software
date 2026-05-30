
/* ── LOADER ──────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1900);
});

/* ── CURSOR ──────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
;(function animCursor(){
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  cursor.style.cssText = `left:${mx}px;top:${my}px`;
  ring.style.cssText   = `left:${rx}px;top:${ry}px`;
  requestAnimationFrame(animCursor);
})();

/* ── SCROLL PROGRESS ─────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
});

/* ── BACK TO TOP ─────────────────────────────────────────── */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 600);
});

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

/* ── HAMBURGER ───────────────────────────────────────────── */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
ham.addEventListener('click', () => {
  ham.classList.toggle('active');
  mob.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => { ham.classList.remove('active'); mob.classList.remove('open'); });
});

/* ── PARTICLE CANVAS ─────────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];
const COLORS = ['rgba(37,99,235,', 'rgba(6,182,212,', 'rgba(139,92,246,'];

function initCanvas(){
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener('resize', initCanvas);

class Particle {
  constructor(){
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-.5)*.4; this.vy = (Math.random()-.5)*.4;
    this.r = Math.random()*1.8 + .4;
    this.color = COLORS[Math.floor(Math.random()*3)];
    this.alpha = Math.random()*.5+.2;
  }
  update(){
    this.x += this.vx; this.y += this.vy;
    if(this.x<0||this.x>W) this.vx*=-1;
    if(this.y<0||this.y>H) this.vy*=-1;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = this.color+this.alpha+')';
    ctx.fill();
  }
}

function initParticles(){
  particles = [];
  const count = Math.min(140, Math.floor(W*H/8000));
  for(let i=0;i<count;i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

let mouseX=-9999, mouseY=-9999;
document.addEventListener('mousemove', e=>{ mouseX=e.clientX; mouseY=e.clientY; });

function drawLines(){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x;
      const dy=particles[i].y-particles[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(37,99,235,${.12*(1-d/120)})`;
        ctx.lineWidth=.5;
        ctx.stroke();
      }
    }
    // mouse connection
    const mx2=particles[i].x-mouseX, my2=particles[i].y-mouseY;
    const md=Math.sqrt(mx2*mx2+my2*my2);
    if(md<160){
      ctx.beginPath();
      ctx.moveTo(particles[i].x,particles[i].y);
      ctx.lineTo(mouseX,mouseY);
      ctx.strokeStyle=`rgba(139,92,246,${.25*(1-md/160)})`;
      ctx.lineWidth=.8;
      ctx.stroke();
    }
  }
}

;(function animParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw();});
  drawLines();
  requestAnimationFrame(animParticles);
})();

/* ── PARALLAX HERO ───────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  const scroll = window.scrollY;
  hero.querySelectorAll('.orb').forEach((o,i) => {
    o.style.transform = `translateY(${scroll * (0.1 + i*.08)}px)`;
  });
});

/* ── TYPING ANIMATION ────────────────────────────────────── */
const phrases = [
  'Professional Website Development',
  'Custom Software Solutions',
  'Mobile App Development',
  'Digital Innovation & Growth',
  'UI/UX Design Excellence',
];
let pi=0, ci=0, deleting=false, waiting=false;
const typEl = document.getElementById('typing-text');
function typeLoop(){
  if(waiting) return;
  const phrase = phrases[pi];
  if(!deleting){
    typEl.textContent = phrase.slice(0, ++ci);
    if(ci===phrase.length){ waiting=true; setTimeout(()=>{waiting=false;deleting=true;},2000); }
    else setTimeout(typeLoop, 60);
  } else {
    typEl.textContent = phrase.slice(0, --ci);
    if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; setTimeout(typeLoop,400); }
    else setTimeout(typeLoop, 35);
  }
}
setTimeout(typeLoop, 2200);

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('revealed');
      revealIO.unobserve(e.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -60px 0px'});
revealEls.forEach(el=>revealIO.observe(el));

/* Stagger children with delay */
document.querySelectorAll('.services-grid, .why-list, .portfolio-grid').forEach(grid=>{
  [...grid.children].forEach((c,i)=>{
    if(c.hasAttribute('data-reveal')) c.style.transitionDelay = (i*.08)+'s';
  });
});

/* ── COUNT UP ────────────────────────────────────────────── */
function animCount(el, target){
  let cur=0;
  const step = target/80;
  const t = setInterval(()=>{
    cur = Math.min(cur+step, target);
    el.textContent = Math.floor(cur)+(target>=100?'+':'+');
    if(cur>=target) clearInterval(t);
  },18);
}
const countIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target.querySelector('[data-count]');
      if(el) animCount(el, +el.dataset.count);
      countIO.unobserve(e.target);
    }
  });
},{threshold:.4});
document.querySelectorAll('.stat-card').forEach(c=>countIO.observe(c));

/* ── PROCESS LINE ────────────────────────────────────────── */
const processIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.getElementById('process-fill').style.width='100%';
      document.querySelectorAll('.step-circle').forEach((c,i)=>{
        setTimeout(()=>c.classList.add('active'), i*300);
      });
      processIO.disconnect();
    }
  });
},{threshold:.3});
const pt = document.getElementById('process-timeline');
if(pt) processIO.observe(pt);

/* ── PORTFOLIO FILTER ────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item=>{
      const tag = item.dataset.filterTag;
      const show = filter==='all'||tag===filter;
      item.style.transition = 'opacity .35s, transform .35s';
      item.style.opacity = show?'1':'0.2';
      item.style.transform = show?'scale(1)':'scale(.96)';
      item.style.pointerEvents = show?'auto':'none';
    });
  });
});

/* ── SERVICE CARD TILT ───────────────────────────────────── */
document.querySelectorAll('.service-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const rect=card.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width-.5)*12;
    const y=((e.clientY-rect.top)/rect.height-.5)*-12;
    card.style.transform=`perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
  });
});

/* ── TESTIMONIAL CAROUSEL ────────────────────────────────── */
const track = document.getElementById('testi-track');
const dots  = document.querySelectorAll('.testi-dot');
let current = 0;
const total = 2; // 2 "pages" of 2 cards each

function goToSlide(idx){
  current = (idx+total)%total;
  const offset = current * (100/1); // each step = 50% of track width
  track.style.transform = `translateX(-${current*52}%)`;
  dots.forEach((d,i)=>d.classList.toggle('active',i===current));
}

document.getElementById('testi-next').addEventListener('click',()=>goToSlide(current+1));
document.getElementById('testi-prev').addEventListener('click',()=>goToSlide(current-1));
dots.forEach(d=>d.addEventListener('click',()=>goToSlide(+d.dataset.idx)));

let autoPlay = setInterval(()=>goToSlide(current+1), 5000);
track.parentElement.addEventListener('mouseenter',()=>clearInterval(autoPlay));
track.parentElement.addEventListener('mouseleave',()=>{ autoPlay=setInterval(()=>goToSlide(current+1),5000); });

/* ── CONTACT FORM ────────────────────────────────────────── */
document.getElementById('contact-form').addEventListener('submit', function(e){
  e.preventDefault();
  const name  = this.querySelector('#name').value.trim();
  const email = this.querySelector('#email').value.trim();
  const msg   = this.querySelector('#message').value.trim();
  if(!name||!email||!msg) return;

  const btn = this.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(()=>{
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    this.reset();
    document.getElementById('success-msg').classList.add('show');
    setTimeout(()=>document.getElementById('success-msg').classList.remove('show'), 5000);
  }, 1400);
});

/* ── MAGNETIC BUTTONS ────────────────────────────────────── */
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const rect=btn.getBoundingClientRect();
    const x=(e.clientX-rect.left-rect.width/2)*.22;
    const y=(e.clientY-rect.top-rect.height/2)*.22;
    btn.style.transform=`translateX(${x}px) translateY(${y}px)`;
  });
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});

/* ── SMOOTH SECTION HIGHLIGHT IN NAV ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let cur='';
  sections.forEach(s=>{
    if(window.scrollY>=s.offsetTop-160) cur=s.id;
  });
  navLinks.forEach(a=>{
    a.style.color = a.getAttribute('href')==='#'+cur ? 'var(--text)' : '';
  });
},{passive:true});