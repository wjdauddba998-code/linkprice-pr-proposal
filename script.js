// Linkprice x 정명윤 매니저 PR 제안서 — scroll nav, progress bar, reveal animation

document.addEventListener('DOMContentLoaded', () => {
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const navButtons = Array.from(document.querySelectorAll('.nav-dots button'));
  const progressBar = document.getElementById('progressBar');
  const coverDate = document.getElementById('coverDate');

  if (coverDate) {
    const today = new Date();
    coverDate.textContent = today.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function scrollToSlide(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => scrollToSlide(btn.dataset.target));
  });

  document.querySelectorAll('.toc-item').forEach(item => {
    item.addEventListener('click', () => scrollToSlide(item.dataset.target));
  });

  // Active nav dot + progress bar on scroll
  function updateOnScroll() {
    const scrollTop = deck.scrollTop;
    const scrollHeight = deck.scrollHeight - deck.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    let currentId = slides[0].id;
    const mid = scrollTop + deck.clientHeight / 2;
    for (const slide of slides) {
      if (slide.offsetTop <= mid) currentId = slide.id;
    }
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === currentId);
    });
  }

  deck.addEventListener('scroll', updateOnScroll, { passive: true });
  updateOnScroll();

  // Reveal-on-scroll animation
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { root: deck, threshold: 0.2 });

  revealEls.forEach((el, i) => {
    el.querySelectorAll(':scope > *').forEach((child, ci) => {
      child.style.setProperty('--i', ci);
    });
    io.observe(el);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const currentIndex = slides.findIndex(s => navButtons.find(b => b.classList.contains('active'))?.dataset.target === s.id);
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const next = slides[Math.min(currentIndex + 1, slides.length - 1)];
      if (next) scrollToSlide(next.id);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prev = slides[Math.max(currentIndex - 1, 0)];
      if (prev) scrollToSlide(prev.id);
    }
  });
});
