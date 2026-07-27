// gallery.js - 갤러리 필터, 슬라이더, 라이트박스

const galleryItems = [
  { src: 'assets/images/gallery-1.jpg', category: 'camp', alt: '캠프 현장 1' },
  { src: 'assets/images/gallery-2.jpg', category: 'lego', alt: 'LEGO 제작 1' },
  { src: 'assets/images/gallery-3.jpg', category: 'fortnite', alt: '포트나이트 플레이 1' },
  { src: 'assets/images/gallery-4.jpg', category: 'cert', alt: '수료식 1' },
  { src: 'assets/images/gallery-5.jpg', category: 'camp', alt: '캠프 현장 2' },
  { src: 'assets/images/gallery-6.jpg', category: 'lego', alt: 'LEGO 제작 2' },
];

let currentLightboxIndex = 0;
let currentFilter = 'all';

function initGallery() {
  renderGallery('all');
  initFilters();
  initLightbox();
}

function renderGallery(filter) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? galleryItems
    : galleryItems.filter(i => i.category === filter);

  grid.innerHTML = filtered.map((item, idx) => `
    <div class="gallery-item reveal" data-category="${item.category}" data-index="${idx}" style="transition-delay:${idx * 0.07}s">
      <div class="gallery-img-wrap">
        <img src="${item.src}" alt="${item.alt}" onerror="this.parentElement.classList.add('placeholder-img')" loading="lazy">
        <div class="gallery-overlay">
          <span class="gallery-expand">⤢</span>
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.gallery-item').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 50 + i * 70);
    el.addEventListener('click', () => openLightbox(i, filtered));
  });
}

function initFilters() {
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderGallery(currentFilter);
    });
  });
}

function openLightbox(index, items) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  if (!lb || !img) return;

  currentLightboxIndex = index;
  img.src = items[index].src;
  img.onerror = () => { img.src = ''; img.alt = items[index].alt; };
  if (cap) cap.textContent = items[index].alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  lb._items = items;
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb._items) return;
  const items = lb._items;
  currentLightboxIndex = (currentLightboxIndex + dir + items.length) % items.length;
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  if (img) { img.src = items[currentLightboxIndex].src; }
  if (cap) cap.textContent = items[currentLightboxIndex].alt;
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

document.addEventListener('DOMContentLoaded', initGallery);
