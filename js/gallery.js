/**
 * BrickSync Auto-Play Carousel Gallery & Lightbox Module
 * Features: Auto-slide (3.5s), Pause on hover, Category filters, Responsive layout, Lightbox modal
 */

const galleryItems = [];

let currentFilter = 'all';
let filteredItems = [...galleryItems];
let currentIndex = 0;
let autoSlideInterval = null;
let currentLightboxIndex = 0;

function getAltText(item) {
  if (!item) return '';
  const lang = localStorage.getItem('bricksync_lang') || 'ko';
  return lang === 'en' ? item.alt_en : item.alt_ko;
}

function initGallery() {
  renderCarousel('all');
  initFilters();
  initLightbox();
  initCarouselControls();
  startAutoSlide();
}

function renderCarousel(filter) {
  currentFilter = filter || currentFilter;
  filteredItems = currentFilter === 'all'
    ? galleryItems
    : galleryItems.filter(i => i.category === currentFilter);

  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track) return;

  currentIndex = 0;

  if (filteredItems.length === 0) {
    const lang = localStorage.getItem('bricksync_lang') || 'ko';
    const emptyMsg = lang === 'en' ? 'Gallery images coming soon.' : '갤러리 이미지가 준비 중입니다.';
    track.innerHTML = `
      <div class="gallery-empty-state" style="width:100%;text-align:center;padding:54px 20px;color:var(--t2);font-size:1.1rem;font-family:var(--fh);background:#ffffff;border:2px dashed var(--border);border-radius:var(--r2);margin:0 auto;">
        <span style="font-size:2.8rem;display:block;margin-bottom:12px;">🖼️</span>
        <span>${emptyMsg}</span>
      </div>
    `;
    if (dotsContainer) dotsContainer.innerHTML = '';
    return;
  }

  // Render slides
  track.innerHTML = filteredItems.map((item, idx) => {
    const alt = getAltText(item);
    return `
      <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="gallery-img-wrap" onclick="openLightbox(${idx})">
          <img src="${item.src}" alt="${alt}" loading="lazy">
          <div class="gallery-overlay">
            <span class="gallery-caption-title">${alt}</span>
            <span class="gallery-expand">⤢ 크게 보기</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render pagination dots
  if (dotsContainer) {
    dotsContainer.innerHTML = filteredItems.map((_, idx) => `
      <span class="dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})"></span>
    `).join('');
  }

  updateCarouselPosition();
}

function updateCarouselPosition() {
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');

  if (!slides.length) return;

  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === currentIndex);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentIndex);
  });

  if (track) {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  // 🔄 상단 카테고리 필터 버튼 자동 하이라이트 연동 (Filter Button Sync)
  if (filteredItems[currentIndex]) {
    const currentCategory = filteredItems[currentIndex].category;
    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
      if (currentFilter === 'all') {
        const isCurrentCategory = btn.dataset.filter === currentCategory || btn.dataset.filter === 'all';
        btn.classList.toggle('active-sync', btn.dataset.filter === currentCategory);
      }
    });
  }
}

function nextSlide() {
  if (!filteredItems.length) return;
  currentIndex = (currentIndex + 1) % filteredItems.length;
  updateCarouselPosition();
}

function prevSlide() {
  if (!filteredItems.length) return;
  currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
  updateCarouselPosition();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarouselPosition();
  resetAutoSlide();
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(nextSlide, 3500);
}

function stopAutoSlide() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function resetAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

function initCarouselControls() {
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const wrap = document.querySelector('.gallery-carousel-wrap');

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  // Pause on hover
  wrap?.addEventListener('mouseenter', stopAutoSlide);
  wrap?.addEventListener('mouseleave', startAutoSlide);

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  wrap?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }, { passive: true });

  wrap?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 40) {
      nextSlide();
    } else if (touchEndX - touchStartX > 40) {
      prevSlide();
    }
    startAutoSlide();
  }, { passive: true });
}

function initFilters() {
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderCarousel(currentFilter);
      resetAutoSlide();
    });
  });
}

// Lightbox Modal
function openLightbox(index) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  if (!lb || !img || !filteredItems[index]) return;

  currentLightboxIndex = index;
  const alt = getAltText(filteredItems[index]);
  img.src = filteredItems[index].src;
  if (cap) cap.textContent = alt;

  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  stopAutoSlide();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
  startAutoSlide();
}

function lightboxNav(dir) {
  if (!filteredItems.length) return;
  currentLightboxIndex = (currentLightboxIndex + dir + filteredItems.length) % filteredItems.length;
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  const alt = getAltText(filteredItems[currentLightboxIndex]);

  if (img) img.src = filteredItems[currentLightboxIndex].src;
  if (cap) cap.textContent = alt;
}

function initLightbox() {
  document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lb-prev')?.addEventListener('click', () => lightboxNav(-1));
  document.getElementById('lb-next')?.addEventListener('click', () => lightboxNav(1));
  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
}

window.renderGallery = () => {
  renderCarousel(currentFilter);
  const lb = document.getElementById('lightbox');
  if (lb && lb.classList.contains('open') && filteredItems[currentLightboxIndex]) {
    const cap = document.getElementById('lb-caption');
    if (cap) cap.textContent = getAltText(filteredItems[currentLightboxIndex]);
  }
};

document.addEventListener('DOMContentLoaded', initGallery);
