/* === Dark Mode === */
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
});

/* === Site Data === */
let siteData = null;

async function loadSiteData() {
  if (siteData) return siteData;
  const res = await fetch('photos.json');
  siteData = await res.json();
  initSiteLinks();
  return siteData;
}

function initSiteLinks() {
  if (!siteData) return;

  const igLink = document.getElementById('instagramLink');
  const footerIg = document.getElementById('footerInstagram');
  const contactIg = document.getElementById('contactInstagram');

  if (igLink) igLink.href = siteData.site.instagram;
  if (footerIg) footerIg.href = siteData.site.instagram;
  if (contactIg) contactIg.href = siteData.site.instagram;

  const contactEmail = document.getElementById('contactEmail');
  if (contactEmail) contactEmail.textContent = siteData.site.email;

  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* === Mobile Menu === */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }
});

/* === Transparent Header on Hero === */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const hero = document.getElementById('hero');

  if (!header || !hero) return;

  header.classList.add('header-transparent');

  const updateHeader = () => {
    const heroBottom = hero.offsetHeight - 100;
    if (window.scrollY > heroBottom) {
      header.classList.remove('header-transparent');
    } else {
      header.classList.add('header-transparent');
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
});

/* === Scroll Reveal === */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all reveal elements, photo-cards, and gallery-cards
  document.querySelectorAll('.reveal, .photo-card, .gallery-card').forEach(el => {
    observer.observe(el);
  });

  // Re-observe dynamically added cards via MutationObserver
  const grids = document.querySelectorAll('.photo-grid, .galleries-grid');
  grids.forEach(grid => {
    const mutObs = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && (node.classList.contains('photo-card') || node.classList.contains('gallery-card'))) {
            observer.observe(node);
          }
        });
      });
    });
    mutObs.observe(grid, { childList: true });
  });
});

/* === Photo Grid Builder === */
function createPhotoCard(photo, index, photos) {
  const card = document.createElement('div');
  card.className = 'photo-card';
  card.innerHTML = `
    <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
    <div class="photo-overlay">
      <div class="photo-view">
        <svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <span class="photo-location">${photo.location || ''}</span>
    </div>
  `;
  card.addEventListener('click', () => openLightbox(photos, index));
  return card;
}

/* === Lightbox === */
let lightboxPhotos = [];
let lightboxIndex = 0;

function openLightbox(photos, index) {
  lightboxPhotos = photos;
  lightboxIndex = index;

  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  if (!lightbox || !img) return;

  const photo = photos[index];
  img.src = photo.src;
  img.alt = photo.alt;
  caption.textContent = [photo.alt, photo.location].filter(Boolean).join(' \u2014 ');

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(direction) {
  lightboxIndex = (lightboxIndex + direction + lightboxPhotos.length) % lightboxPhotos.length;
  const photo = lightboxPhotos[lightboxIndex];

  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  if (img) {
    img.src = photo.src;
    img.alt = photo.alt;
  }
  if (caption) {
    caption.textContent = [photo.alt, photo.location].filter(Boolean).join(' \u2014 ');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
});

/* === Page Loaders === */

async function loadFeaturedPhotos() {
  const data = await loadSiteData();
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  // Hero slideshow
  const slides = document.querySelectorAll('.hero-slideshow .hero-bg');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  data.featured.forEach((photo, i) => {
    grid.appendChild(createPhotoCard(photo, i, data.featured));
  });
}

async function loadGalleries() {
  const data = await loadSiteData();
  const grid = document.getElementById('galleriesGrid');
  if (!grid) return;

  data.galleries.forEach(gallery => {
    const card = document.createElement('a');
    card.href = `gallery.html?id=${gallery.id}`;
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${gallery.cover}" alt="${gallery.title}" loading="lazy">
      <div class="gallery-card-overlay">
        <h3>${gallery.title}</h3>
        <p>${gallery.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function loadGalleryPage() {
  const params = new URLSearchParams(window.location.search);
  const galleryId = params.get('id');
  if (!galleryId) {
    window.location.href = 'galleries.html';
    return;
  }

  const data = await loadSiteData();
  const gallery = data.galleries.find(g => g.id === galleryId);
  if (!gallery) {
    window.location.href = 'galleries.html';
    return;
  }

  document.title = `${gallery.title} - Andy Prosserman Photography`;

  const title = document.getElementById('galleryTitle');
  const desc = document.getElementById('galleryDescription');
  const grid = document.getElementById('galleryPhotos');

  if (title) title.textContent = gallery.title;
  if (desc) desc.textContent = gallery.description;

  if (grid) {
    gallery.photos.forEach((photo, i) => {
      grid.appendChild(createPhotoCard(photo, i, gallery.photos));
    });
  }
}

async function loadPrintsPreview() {
  const data = await loadSiteData();
  const grid = document.getElementById('printsGrid');
  if (!grid) return;

  const preview = data.featured.slice(0, 6);
  preview.forEach((photo, i) => {
    grid.appendChild(createPhotoCard(photo, i, preview));
  });

  const form = document.getElementById('notifyForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input) {
        input.value = '';
        input.placeholder = 'Thanks! We\'ll be in touch.';
        input.disabled = true;
        form.querySelector('button').disabled = true;
        form.querySelector('button').textContent = 'Subscribed';
      }
    });
  }
}

/* === Contact Form === */
function initContactForm() {
  loadSiteData();

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('https://formspree.io/f/mvzvzpbl', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        if (status) {
          status.className = 'form-status success';
          status.textContent = 'Message sent! I\'ll get back to you soon.';
        }
      } else {
        throw new Error('Server error');
      }
    } catch {
      if (status) {
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please email me directly at andy.pross@gmail.com';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
