// Linkprice x 정명윤 매니저 PR 제안서 — 좌우 슬라이드 덱 내비게이션

document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  const counter = document.getElementById('counter');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const coverDate = document.getElementById('coverDate');

  if (coverDate) {
    const today = new Date();
    coverDate.textContent = today.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  let i = 0;

  slides.forEach((_, k) => {
    const d = document.createElement('button');
    d.className = 'dot' + (k === 0 ? ' active' : '');
    d.setAttribute('aria-label', `${k + 1}번 슬라이드로 이동`);
    d.addEventListener('click', () => go(k));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function go(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    counter.textContent = `${i + 1} / ${slides.length}`;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === slides.length - 1;
  }

  prevBtn.addEventListener('click', () => go(i - 1));
  nextBtn.addEventListener('click', () => go(i + 1));

  document.querySelectorAll('.toc-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = slides.findIndex(s => s.id === item.dataset.target);
      if (idx !== -1) go(idx);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') go(i + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
    else if (e.key === 'p' || e.key === 'P') window.print();
  });

  go(0);
});
