/**
 * Comportamiento interactivo y accesibilidad — Instituto Leibnitz
 * Navegación adaptable por teclado y marcador de sección activa (WAI-ARIA).
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. MENÚ DE NAVEGACIÓN MÓVIL ACCESIBLE
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  function setMenuState(isOpen) {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
    mainNav.classList.toggle('is-open', isOpen);
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isExpanded);
    });

    // Cerrar menú al seleccionar un enlace interno
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 820) {
          setMenuState(false);
        }
      });
    });

    // Cerrar con tecla Escape y devolver el foco al botón
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        setMenuState(false);
        menuToggle.focus();
      }
    });

    // Cerrar al hacer clic fuera del encabezado en pantallas móviles
    document.addEventListener('click', (event) => {
      if (
        mainNav.classList.contains('is-open') &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setMenuState(false);
      }
    });
  }

  /* ==========================================================================
     2. MARCADOR DE SECCIÓN ACTIVA EN EL MENÚ
     ========================================================================== */
  const trackedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }
});
