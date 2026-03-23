/* ============================================================
   PORTFOLIO — main.js
   Funcionalidades:
   - Navegación sticky con clase scrolled
   - Menú mobile toggle
   - Active link según sección visible
   - Animaciones reveal al hacer scroll (IntersectionObserver)
   - Animación de skill bars al entrar en viewport
   - Marquee de tecnologías
   - Validación y feedback del formulario de contacto
   - Scroll suave en links internos
   ============================================================ */

'use strict';

/* ── Esperar a que el DOM esté listo ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initReveal();
  initSkillBars();
  initMarquee();
  initContactForm();
  initSmoothScroll();
});


/* ══════════════════════════════════════════════════════════
   NAV — scroll shadow + active links
══════════════════════════════════════════════════════════ */
function initNav() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  // Shadow al hacer scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id], div[id="inicio"]');

    let currentId = '';
    sections.forEach(section => {
      if (section.offsetTop <= scrollY) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === currentId);
    });
  }
}


/* ══════════════════════════════════════════════════════════
   MENÚ MOBILE
══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const linksContainer = document.getElementById('navLinks');
  const links = linksContainer.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const isOpen = linksContainer.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al hacer click en un link
  links.forEach(link => {
    link.addEventListener('click', () => {
      linksContainer.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar al hacer click afuera
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !linksContainer.contains(e.target)) {
      linksContainer.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}


/* ══════════════════════════════════════════════════════════
   REVEAL ANIMATION (IntersectionObserver)
══════════════════════════════════════════════════════════ */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo si no hay soporte
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}


/* ══════════════════════════════════════════════════════════
   SKILL BARS
══════════════════════════════════════════════════════════ */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');

  if (!('IntersectionObserver' in window)) {
    fills.forEach(fill => {
      fill.style.width = fill.dataset.width + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          // Pequeño delay escalonado según índice
          const index = [...fills].indexOf(fill);
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, index * 100);
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
}


/* ══════════════════════════════════════════════════════════
   MARQUEE — generar items dinámicamente
══════════════════════════════════════════════════════════ */
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  const technologies = [
    'React & Next.js',
    'Node.js & Express',
    'PostgreSQL',
    'TypeScript',
    'Figma & UI Design',
    'AWS & Vercel',
    'REST APIs',
    'Tailwind CSS',
    'MongoDB',
    'Git & GitHub',
    'Docker',
    'GraphQL',
  ];

  // Duplicamos dos veces para el loop infinito
  const allItems = [...technologies, ...technologies, ...technologies, ...technologies];

  track.innerHTML = allItems
    .map(tech => `<span class="marquee-item"><span class="marquee-dot">&#10022;</span>${tech}</span>`)
    .join('');
}


/* ══════════════════════════════════════════════════════════
   FORMULARIO DE CONTACTO
══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const project = form.querySelector('#cf-project').value.trim();
    const message = form.querySelector('#cf-message').value.trim();
    const submitBtn = form.querySelector('.cf-submit');

    // Limpiar feedback anterior
    feedback.textContent = '';
    feedback.className = 'form-feedback';

    // Validaciones
    if (!name) {
      showFeedback('Por favor ingresá tu nombre.', 'error');
      form.querySelector('#cf-name').focus();
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback('Por favor ingresá un email válido.', 'error');
      form.querySelector('#cf-email').focus();
      return;
    }

    // Simular envío (acá iría tu integración: Formspree, EmailJS, backend propio, etc.)
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
      await simulateSend({ name, email, project, message });
      showFeedback('¡Mensaje enviado! Te respondo en menos de 24 horas.', 'success');
      form.reset();
    } catch (err) {
      showFeedback('Hubo un error. Escribime directamente a tu@email.com', 'error');
    } finally {
      submitBtn.textContent = 'Enviar mensaje →';
      submitBtn.disabled = false;
    }
  });

  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Simulación de envío — reemplazá con tu servicio real
  // Opciones: Formspree (https://formspree.io), EmailJS, o tu propio backend
  function simulateSend(data) {
    return new Promise((resolve) => {
      console.log('Datos del formulario:', data);
      setTimeout(resolve, 1200);
    });
  }

  /*
  PARA USAR CON FORMSPREE:
  Reemplazá simulateSend con:

  async function enviarFormulario(data) {
    const response = await fetch('https://formspree.io/f/TU_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al enviar');
    return response.json();
  }
  */
}


/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL — para todos los links internos
══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
