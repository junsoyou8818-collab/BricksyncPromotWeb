// main.js - 네비게이션, 카운터, 스크롤 애니메이션, 파티클

// ── GNB 스크롤 효과 ──────────────────────────────
function initNav() {
  const gnb = document.getElementById('gnb');
  const hamburger = document.getElementById('gnb-hamburger');
  const drawer = document.getElementById('gnb-drawer');

  window.addEventListener('scroll', () => {
    gnb?.classList.toggle('scrolled', window.scrollY > 30);
  });

  hamburger?.addEventListener('click', () => {
    drawer?.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  document.querySelectorAll('#gnb-drawer a, #gnb-nav a').forEach(link => {
    link.addEventListener('click', () => {
      drawer?.classList.remove('open');
      hamburger?.classList.remove('active');
    });
  });
}

// ── 숫자 카운터 애니메이션 ────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ── 섹션 Reveal 애니메이션 ───────────────────────
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── 파티클 캔버스 ─────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: ['#FFD700', '#00C3FF', '#8B5CF6'][Math.floor(Math.random() * 3)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ── 프로그램 탭 ───────────────────────────────────
function initProgramTabs() {
  document.querySelectorAll('.prog-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.prog-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.prog-card').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('prog-' + target)?.classList.add('active');
    });
  });
}

// ── 네비게이션 활성 섹션 하이라이트 ──────────────
function initActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#gnb-nav a[href^="#"]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
}

// ── 초기화 ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCounters();
  initReveal();
  initParticles();
  initProgramTabs();
  initActiveSection();
});
