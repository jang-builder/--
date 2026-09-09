// 모바일 메뉴 토글
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// 스크롤 시 섹션 페이드인
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));

// FAQ 아코디언
document.querySelectorAll('.acc-item').forEach(item => {
  const head = item.querySelector('.acc-head');
  const body = item.querySelector('.acc-body');

  head.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.acc-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.acc-body').style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      body.style.maxHeight = null;
    } else {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});
