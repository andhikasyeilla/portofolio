/* ── Custom cursor ── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx - 4 + 'px';
  cursor.style.top = my - 4 + 'px';
});

function animateRing() {
  rx += (mx - rx - 16) * 0.12;
  ry += (my - ry - 16) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
});

/* ── Scroll progress bar ── */
const scrollBar = document.getElementById('scrollBar');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = pct + '%';
});

/* ── Scroll reveal ── */
const reveals = document.querySelectorAll('.reveal');
const timelineItems = document.querySelectorAll('.timeline-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));
timelineItems.forEach(el => observer.observe(el));

/* ── Skill bars animation ── */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-group').forEach(el => skillObs.observe(el));

/* ── Animated counters ── */
function animateCount(el, target, suffix) {
  let current = 0;
  const step = Math.ceil(target / 50);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(interval);
  }, 28);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.textContent.replace(/[0-9]/g, '');
        animateCount(el, target, suffix);
      });
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObs.observe(heroStats);

/* ── Tab switching ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');

    document.querySelectorAll('#tab-' + btn.dataset.tab + ' .timeline-item').forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = 'translateX(-16px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = 1;
        el.style.transform = 'translateX(0)';
      }, i * 100);
    });
  });
});

document.querySelectorAll('#tab-professional .timeline-item').forEach((el, i) => {
  setTimeout(() => {
    el.classList.add('visible');
  }, 300 + i * 120);
});

/* ══════════════════════════════════════════════
   CERTIFICATE MODAL LOGIC
══════════════════════════════════════════════ */

const certModal    = document.getElementById('certModal');
const modalTitle   = document.getElementById('modalCertTitle');
const modalSub     = document.getElementById('modalCertSubtitle');
const modalWrapper = document.getElementById('modalImgWrapper');

function openModal(title, issuer, imgSrc) {
  modalTitle.textContent = title;
  modalSub.textContent   = issuer;

  modalWrapper.innerHTML = '';

  const img = document.createElement('img');
  img.src       = imgSrc;
  img.alt       = 'Sertifikat ' + title;
  img.className = 'modal-cert-img';

  img.onerror = function () {
    this.style.display = 'none';
    const ph = document.createElement('div');
    ph.className = 'modal-img-placeholder';
    ph.innerHTML =
      '<div class="placeholder-icon">📄</div>' +
      '<p>File gambar sertifikat belum tersedia.<br>Letakkan file di folder yang sama dengan HTML ini.</p>' +
      '<code>' + imgSrc + '</code>';
    modalWrapper.appendChild(ph);
  };

  modalWrapper.appendChild(img);

  certModal.classList.add('active');
  document.body.style.overflow = 'hidden';

  certModal.querySelector('.modal-close').focus();
}

function closeModal() {
  certModal.classList.remove('active');
  document.body.style.overflow = '';
}

function handleOverlayClick(event) {
  if (event.target === certModal) {
    closeModal();
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && certModal.classList.contains('active')) {
    closeModal();
  }
});

/* Make cert-cards also respond to cursor scale */
document.querySelectorAll('.cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
});
