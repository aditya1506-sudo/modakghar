/* ── script.js – Modak Ghar Premium Website (Production v5 Responsive Nav) ── */
'use strict';

/* ────────────────────────────────────────────────
   1. PRELOADER FADE AWAY
   ──────────────────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('hidden');
  };

  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 400));
    setTimeout(hidePreloader, 1200);
  }
})();


/* ────────────────────────────────────────────────
   2. NAVBAR & FULL-SCREEN MOBILE MENU
   ──────────────────────────────────────────────── */
(function initNav() {
  const nav         = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const closeBtn    = document.getElementById('mobile-close');
  const menuWrapper = document.getElementById('nav-menu');
  if (!nav || !hamburger || !menuWrapper) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const openMenu = () => {
    hamburger.classList.add('open');
    menuWrapper.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    menuWrapper.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = menuWrapper.classList.contains('open');
    if (isOpen) closeMenu(); else openMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  menuWrapper.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuWrapper.classList.contains('open')) closeMenu();
  });
})();


/* ────────────────────────────────────────────────
   3. SMOOTH SCROLL for anchor links
   ──────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ────────────────────────────────────────────────
   4. SCROLL REVEAL — Single Trigger Observer
   ──────────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal-fade, .reveal-up, .reveal-left, .reveal-right, .reveal-scale'
  );
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ────────────────────────────────────────────────
   5. COLLECTION TABS
   ──────────────────────────────────────────────── */
(function initCollectionTabs() {
  const tabs   = document.querySelectorAll('.collection-tab');
  const panels = document.querySelectorAll('.collection-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => panel.classList.remove('active'));

      const activePanel = document.getElementById(`tab-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.querySelectorAll('.item-card').forEach((card, i) => {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(14px)';
          card.style.transition = `opacity 320ms ease ${i * 50}ms, transform 320ms ease ${i * 50}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity   = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        });
      }
    });
  });
})();


/* ────────────────────────────────────────────────
   6. FAQ ACCORDION — Smooth Transition
   ──────────────────────────────────────────────── */
(function initFAQ() {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answerId   = question.getAttribute('aria-controls');
      const answer     = document.getElementById(answerId);

      questions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        const aEl = document.getElementById(q.getAttribute('aria-controls'));
        if (aEl) aEl.classList.remove('open');
      });

      if (!isExpanded && answer) {
        question.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();


/* ────────────────────────────────────────────────
   7. ADVANCED GALLERY LIGHTBOX (Next/Prev & Keyboard)
   ──────────────────────────────────────────────── */
(function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  const imagesData = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-item__overlay span');
    return {
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      title: cap ? cap.textContent : 'Modak Ghar Creation'
    };
  });

  let currentIndex = 0;

  const lightbox = document.createElement('div');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image Lightbox');
  lightbox.style.cssText = `
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(18, 6, 2, 0.94);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(16px);
    padding: 24px;
  `;

  const imgWrap = document.createElement('div');
  imgWrap.style.cssText = `
    position: relative; max-width: 90vw; max-height: 75vh;
    display: flex; align-items: center; justify-content: center;
  `;

  const lbImg = document.createElement('img');
  lbImg.alt = '';
  lbImg.style.cssText = `
    max-width: 100%; max-height: 75vh;
    object-fit: contain; border-radius: 16px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.7);
    transition: opacity 220ms ease, transform 220ms ease;
  `;
  imgWrap.appendChild(lbImg);

  const captionBar = document.createElement('div');
  captionBar.style.cssText = `
    margin-top: 20px; text-align: center; color: var(--cream);
    font-family: var(--font-display); font-size: 1.1rem; letter-spacing: 0.05em;
  `;
  const captionText = document.createElement('div');
  const counterText = document.createElement('div');
  counterText.style.cssText = `font-size: 0.8rem; color: var(--gold-light); margin-top: 4px; font-family: var(--font-body);`;
  captionBar.appendChild(captionText);
  captionBar.appendChild(counterText);

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Close gallery lightbox');
  closeBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
  closeBtn.style.cssText = `
    position: absolute; top: 24px; right: 24px;
    background: rgba(255,255,255,0.12); border: none; cursor: pointer;
    width: 48px; height: 48px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: background 200ms ease; z-index: 1010;
  `;
  closeBtn.onmouseenter = () => closeBtn.style.background = 'rgba(255,255,255,0.25)';
  closeBtn.onmouseleave = () => closeBtn.style.background = 'rgba(255,255,255,0.12)';

  const prevBtn = document.createElement('button');
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`;
  prevBtn.style.cssText = `
    position: absolute; left: 24px; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.12); border: none; cursor: pointer;
    width: 52px; height: 52px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: background 200ms ease; z-index: 1010;
  `;
  prevBtn.onmouseenter = () => prevBtn.style.background = 'rgba(255,255,255,0.25)';
  prevBtn.onmouseleave = () => prevBtn.style.background = 'rgba(255,255,255,0.12)';

  const nextBtn = document.createElement('button');
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
  nextBtn.style.cssText = `
    position: absolute; right: 24px; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.12); border: none; cursor: pointer;
    width: 52px; height: 52px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: background 200ms ease; z-index: 1010;
  `;
  nextBtn.onmouseenter = () => nextBtn.style.background = 'rgba(255,255,255,0.25)';
  nextBtn.onmouseleave = () => nextBtn.style.background = 'rgba(255,255,255,0.12)';

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(prevBtn);
  lightbox.appendChild(nextBtn);
  lightbox.appendChild(imgWrap);
  lightbox.appendChild(captionBar);
  document.body.appendChild(lightbox);

  const updateImage = (index) => {
    if (index < 0) index = imagesData.length - 1;
    if (index >= imagesData.length) index = 0;
    currentIndex = index;

    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.96)';

    setTimeout(() => {
      lbImg.src = imagesData[currentIndex].src;
      lbImg.alt = imagesData[currentIndex].alt;
      captionText.textContent = imagesData[currentIndex].title;
      counterText.textContent = `${currentIndex + 1} of ${imagesData.length}`;

      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    }, 150);
  };

  const openLightbox = (index) => {
    updateImage(index);
    lightbox.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
      lightbox.style.opacity = '1';
    });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.pointerEvents = 'none';
      document.body.style.overflow = '';
    }, 300);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); updateImage(currentIndex - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); updateImage(currentIndex + 1); });
  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === imgWrap) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.style.pointerEvents === 'auto') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateImage(currentIndex - 1);
      if (e.key === 'ArrowRight') updateImage(currentIndex + 1);
    }
  });
})();


/* ────────────────────────────────────────────────
   8. ACTIVE NAV LINK HIGHLIGHT on scroll
   ──────────────────────────────────────────────── */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 130) current = section.id;
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();
