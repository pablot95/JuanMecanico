(function () {

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const heroContent = document.querySelector('.hero-content');
  const heroOverlay = document.querySelector('.hero-overlay');
  const heroSection = document.getElementById('inicio');

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  var heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateNavbar();
        handleHeroParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  function handleHeroParallax() {
    if (!heroContent || !heroOverlay) return;
    var scrollY = window.scrollY;
    var progress = Math.min(scrollY / heroHeight, 1);

    heroContent.style.opacity = 1 - progress * 1.6;
    heroContent.style.transform = 'translateY(calc(-50% + ' + (scrollY * 0.35) + 'px))';

    heroOverlay.style.opacity = 1 - progress * 0.8;

    if (progress >= 0.65) {
      heroContent.classList.add('hero-hidden');
      heroOverlay.style.display = 'none';
    } else {
      heroContent.classList.remove('hero-hidden');
      heroOverlay.style.display = '';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
  });
  updateNavbar();
  handleHeroParallax();

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  const heroElements = document.querySelectorAll('.hero-content .reveal-up');
  heroElements.forEach(function (el, i) {
    setTimeout(function () {
      el.style.transition = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      el.style.transitionDelay = (i * 0.12) + 's';
      el.classList.add('visible');
    }, 300);
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-right-delay, .reveal-rotate, .reveal-blur, .reveal-clip, .stagger-children').forEach(function (el) {
    if (!el.closest('#inicio')) {
      revealObserver.observe(el);
    }
  });

  const storeProgress = document.querySelector('.sp-fill');
  const storeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          storeProgress.classList.add('animated');
        }, 400);
        storeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  if (storeProgress) {
    storeObserver.observe(document.querySelector('#tienda'));
  }

  const navAnchors = document.querySelectorAll('a[href^="#"]');
  navAnchors.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nombre = contactForm.querySelector('#nombre').value.trim();
      const telefono = contactForm.querySelector('#telefono').value.trim();
      const servicio = contactForm.querySelector('#servicio').value;
      const mensaje = contactForm.querySelector('#mensaje').value.trim();

      if (!nombre || !servicio) {
        const firstInvalid = !nombre
          ? contactForm.querySelector('#nombre')
          : contactForm.querySelector('#servicio');
        firstInvalid.focus();
        firstInvalid.style.borderColor = '#e53935';
        setTimeout(function () {
          firstInvalid.style.borderColor = '';
        }, 2000);
        return;
      }

      const servicioLabels = {
        mantenimiento: 'Mantenimiento Motor',
        refrigerante: 'Cambio Líquido Refrigerante',
        electrico: 'Reparaciones Eléctricas',
        personalizado: 'Atención Personalizada',
        otro: 'Otro'
      };

      const servicioNombre = servicioLabels[servicio] || servicio;
      let text = 'Hola RIVAS, me gustaría solicitar un presupuesto.';
      text += '%0ANombre: ' + encodeURIComponent(nombre);
      if (telefono) text += '%0ATeléfono: ' + encodeURIComponent(telefono);
      text += '%0AServicio: ' + encodeURIComponent(servicioNombre);
      if (mensaje) text += '%0ADetalle: ' + encodeURIComponent(mensaje);

      window.open('https://wa.me/5491100000000?text=' + text, '_blank', 'noopener,noreferrer');
    });

    contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('focus', function () {
        this.style.borderColor = '';
      });
    });
  }

  const activeNavObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.querySelectorAll('a').forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) {
            a.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-80px 0px -55% 0px'
  });

  document.querySelectorAll('section[id]').forEach(function (section) {
    activeNavObserver.observe(section);
  });

}());
