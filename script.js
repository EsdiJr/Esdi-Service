/* ===========================
   ESDI SERVICE — SCRIPT PRINCIPAL
   =========================== */

/* ---- Année dynamique footer ---- */
document.getElementById('annee').textContent = new Date().getFullYear();

/* ============================================================
   NAVBAR : effet au défilement + fermeture mobile au clic
   ============================================================ */
const navbar     = document.getElementById('navbar');
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

/* Fermer le menu mobile au clic sur un lien */
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

/* ============================================================
   REVEAL au défilement (IntersectionObserver)
   ============================================================ */
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      /* Délai léger en cascade pour les grilles */
      const delay = entry.target.closest('.services-grid, .chiffres-grid, .valeurs')
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 90
        : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach(el => revealObserver.observe(el));

/* ============================================================
   COMPTEURS ANIMÉS (section chiffres)
   ============================================================ */
const compteurs = document.querySelectorAll('.nombre[data-target]');
let compteursDemarres = false;

function animerCompteur(el) {
  const cible  = parseInt(el.dataset.target, 10);
  const duree  = 1800; // ms
  const pas    = Math.ceil(duree / cible);
  let actuel   = 0;

  const interval = setInterval(() => {
    actuel += Math.max(1, Math.ceil(cible / 60));
    if (actuel >= cible) {
      actuel = cible;
      clearInterval(interval);
    }
    el.textContent = actuel + (el.dataset.suffix || '');
  }, pas);
}

const chiffresSection = document.getElementById('chiffres');

const chiffresObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !compteursDemarres) {
    compteursDemarres = true;
    compteurs.forEach(animerCompteur);
    chiffresObserver.disconnect();
  }
}, { threshold: 0.3 });

if (chiffresSection) chiffresObserver.observe(chiffresSection);

/* ============================================================
   FORMULAIRE DE CONTACT — validation & soumission simulée
   ============================================================ */
const form       = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const btnEnvoyer  = document.getElementById('btn-envoyer');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Validation manuelle */
    let valid = true;
    const champs = form.querySelectorAll('[required]');

    champs.forEach(champ => {
      champ.style.borderColor = '';
      if (!champ.value.trim() || (champ.tagName === 'SELECT' && !champ.value)) {
        champ.style.borderColor = '#E53E3E';
        champ.style.boxShadow   = '0 0 0 3px rgba(229,62,62,0.15)';
        valid = false;
        champ.addEventListener('input', () => {
          champ.style.borderColor = '';
          champ.style.boxShadow   = '';
        }, { once: true });
      }
    });

    if (!valid) {
      /* Secousse visuelle */
      form.style.animation = 'none';
      form.offsetHeight; // reflow
      form.style.animation = 'shake 0.4s ease';
      return;
    }

    /* Simulation envoi */
    btnEnvoyer.disabled     = true;
    btnEnvoyer.textContent  = '⏳  Envoi en cours…';

    setTimeout(() => {
      form.style.display       = 'none';
      formSuccess.style.display = 'block';
    }, 1400);
  });
}

/* ============================================================
   NAVIGATION ACTIVE au défilement (highlight du lien courant)
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function majNavActive() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.style.color = 'rgba(255,255,255,0.7)';
        if (link.getAttribute('href') === '#' + id) {
          link.style.color = '#fff';
        }
      });
    }
  });
}

window.addEventListener('scroll', majNavActive, { passive: true });

/* ============================================================
   ANIMATION SHAKE (validation formulaire)
   ============================================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

/* ============================================================
   SMOOTH SCROLL pour les ancres (fallback navigateurs)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const cible = document.querySelector(this.getAttribute('href'));
    if (cible) {
      e.preventDefault();
      cible.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
