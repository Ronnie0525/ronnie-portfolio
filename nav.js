/* ============================================================
   Shared navigation: theme toggle + overlay menu open/close.
   Loaded on every page (paired with the matching topbar +
   overlay-menu HTML and the styles in styles.css).
   ============================================================ */
(function() {
  // ----- Theme toggle -----
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      var html = document.documentElement;
      if (html.classList.contains('dark')) {
        html.classList.replace('dark', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.replace('light', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ----- Overlay menu -----
  var trigger = document.getElementById('menuToggle');
  var overlay = document.getElementById('overlayMenu');
  if (!trigger || !overlay) return;
  var closeBtn = overlay.querySelector('.overlay-close');
  var body = document.body;

  function openMenu() {
    body.classList.add('overlay-open');
    overlay.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Close menu');
    setTimeout(function() {
      var firstLink = overlay.querySelector('.overlay-link');
      if (firstLink) firstLink.focus();
    }, 100);
  }
  function closeMenu() {
    body.classList.remove('overlay-open');
    overlay.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Open menu');
    trigger.focus();
  }
  function toggleMenu() {
    if (body.classList.contains('overlay-open')) closeMenu();
    else openMenu();
  }

  trigger.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && body.classList.contains('overlay-open')) closeMenu();
  });

  // Close after clicking any in-overlay link with [data-overlay-link]
  overlay.querySelectorAll('[data-overlay-link]').forEach(function(a) {
    a.addEventListener('click', function() {
      setTimeout(closeMenu, 120);
    });
  });
})();

/* ============================================================
   Topbar color invert over [data-light-bg] sections.
   When the topbar's vertical band overlaps any element marked
   data-light-bg, we add `.topbar--on-light` so its colors flip
   to black (visible against white backgrounds).
   ============================================================ */
(function() {
  var topbar = document.querySelector('.topbar');
  if (!topbar) return;
  var lightSections = document.querySelectorAll('[data-light-bg]');
  if (!lightSections.length) return;

  var ticking = false;
  function update() {
    var topbarBottom = topbar.getBoundingClientRect().bottom;
    // Check if the topbar's band overlaps any light section
    var onLight = false;
    for (var i = 0; i < lightSections.length; i++) {
      var rect = lightSections[i].getBoundingClientRect();
      // Light section's top has passed the topbar AND its bottom hasn't yet exited
      if (rect.top <= topbarBottom && rect.bottom > 0) {
        onLight = true;
        break;
      }
    }
    if (onLight) topbar.classList.add('topbar--on-light');
    else topbar.classList.remove('topbar--on-light');
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', function() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  // Run once on load
  update();
})();
