/* ==========================================
   SS Artistry - Main JavaScript
   ========================================== */

/* ---- Sticky Header ---- */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ---- Mobile Menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavClose = document.getElementById('mobile-nav-close');
const mobileLinks = document.querySelectorAll('.nav-mobile-link');

function openMenu() {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', openMenu);
hamburger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openMenu(); });
mobileNavClose.addEventListener('click', closeMenu);
mobileNavClose.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') closeMenu(); });
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

/* ---- Smooth Scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Lightbox ---- */
function openLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  img.alt = alt || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ---- Gallery Tabs ---- */
const tabBtns = document.querySelectorAll('.tab-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = '';
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ---- Scroll Animations (Intersection Observer) ---- */
const animTargets = document.querySelectorAll(
  '.service-card, .why-card, .testi-card, .package-card, .process-step, .contact-card, .highlight-card, .gallery-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s, transform 0.55s cubic-bezier(0.4,0,0.2,1) ${i * 0.07}s`;
  observer.observe(el);
});

// When visible class added, trigger animation
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

/* ---- Counter Animation ---- */
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.hero-stat .num');
      nums.forEach(num => {
        const text = num.textContent;
        if (text.includes('500')) animateCount(num, 500, '+');
        else if (text.includes('8')) animateCount(num, 8, '+');
        else if (text.includes('4.9')) { num.textContent = '4.9★'; }
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

/* ---- Hero Enquiry Form ---- */
function handleEnquiry(e) {
  e.preventDefault();
  const name = document.getElementById('hero-name').value.trim();
  const phone = document.getElementById('hero-phone').value.trim();
  const date = document.getElementById('hero-date').value;
  const service = document.getElementById('hero-service').value;

  if (!name || !phone) {
    showToast('Please fill in your name and phone number.', 'error');
    return false;
  }
  if (phone.replace(/\D/g,'').length < 10) {
    showToast('Please enter a valid 10-digit phone number.', 'error');
    return false;
  }

  const msg = encodeURIComponent(
    `Hi! I'd like to enquire about SS Artistry's services.\n\nName: ${name}\nPhone: ${phone}\nEvent Date: ${date || 'TBD'}\nService: ${service || 'Not specified'}\n\nPlease get in touch!`
  );
  window.open(`https://api.whatsapp.com/send?phone=919958050893&text=${msg}`, '_blank');
  showToast('Opening WhatsApp... We\'ll get back to you soon! 🌸', 'success');
  e.target.reset();
  return false;
}

/* ---- Booking Form ---- */
function handleBooking(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date = document.getElementById('wedding-date').value;
  const service = document.getElementById('service-type').value;
  const venue = document.getElementById('venue').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !phone || !date || !service) {
    showToast('Please fill in all required fields.', 'error');
    return false;
  }

  const msg = encodeURIComponent(
    `Hi SS Artistry! I'd like to book an appointment.\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Event Date: ${date}\n` +
    `Service: ${service}\n` +
    `Venue: ${venue || 'TBD'}\n` +
    `Details: ${message || 'None'}\n\n` +
    `Please confirm my booking!`
  );
  window.open(`https://api.whatsapp.com/send?phone=919958050893&text=${msg}`, '_blank');
  showToast('🌸 Booking request sent via WhatsApp! We\'ll confirm shortly.', 'success');
  e.target.reset();
  return false;
}

/* ---- Toast Notification ---- */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notif');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notif';
  toast.setAttribute('role', 'alert');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '100px', right: '28px', zIndex: '10000',
    padding: '16px 24px', borderRadius: '12px',
    fontFamily: "'Montserrat', sans-serif", fontSize: '14px', fontWeight: '600',
    color: '#fff', maxWidth: '340px', lineHeight: '1.5',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    background: type === 'success'
      ? 'linear-gradient(135deg, #8B1A4A, #C2185B)'
      : 'linear-gradient(135deg, #b71c1c, #e53935)',
    animation: 'toastIn 0.4s cubic-bezier(0.4,0,0.2,1)',
    opacity: '1', transform: 'translateY(0)',
  });

  const toastAnim = document.createElement('style');
  toastAnim.textContent = `
    @keyframes toastIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  `;
  document.head.appendChild(toastAnim);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ---- Parallax Hero Bg (subtle) ---- */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });
}

/* ---- Active Nav Highlight on Scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionH = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionH) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { passive: true });

console.log('%c✦ SS Artistry ✦', 'color:#C9A84C;font-size:20px;font-weight:bold');
console.log('%cDelhi\'s Luxury Bridal Makeup Studio', 'color:#8B1A4A;font-size:14px');
