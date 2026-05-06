/* Navbar enhancements: Hire-Me dropdown injection.
 * (Filename kept for cache-busting parity; this no longer ships search.) */
(function () {
  'use strict';

  function injectNavExtras() {
    var navRight = document.querySelector('.nav-right');
    if (!navRight || navRight.querySelector('.nav-hire')) return;

    var contactBtn = navRight.querySelector('a.btn[href="/contact/"]') ||
                     navRight.querySelector('a[href="/contact/"].btn');
    if (!contactBtn) return;
    var navLinks = navRight.querySelector('.nav-links');

    var hire = document.createElement('div');
    hire.className = 'nav-hire';
    hire.innerHTML =
      '<button type="button" class="nav-hire-trigger" aria-haspopup="true" aria-expanded="false">' +
        '<span class="nav-hire-dot" aria-hidden="true"></span>' +
        'Hire Me' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
      '</button>' +
      '<div class="nav-hire-menu" role="menu">' +
        '<a href="/contact/?type=freelance" role="menuitem"><div class="nav-hire-title">Freelance</div><div class="nav-hire-sub">One-off projects, fixed scope</div></a>' +
        '<a href="/contact/?type=fulltime" role="menuitem"><div class="nav-hire-title">Full-time</div><div class="nav-hire-sub">Permanent role</div></a>' +
        '<a href="/contact/?type=retainer" role="menuitem"><div class="nav-hire-title">Retainer</div><div class="nav-hire-sub">Ongoing monthly hours</div></a>' +
        '<a href="/contact/?type=collaboration" role="menuitem"><div class="nav-hire-title">Collaboration</div><div class="nav-hire-sub">Agency / studio partnership</div></a>' +
      '</div>';

    // Insert Hire Me ahead of the nav links so the order reads:
    // [Logo] [Hire Me ▾] Home Portfolio About Me [Contact] [theme] [☰]
    if (navLinks) {
      navLinks.parentNode.insertBefore(hire, navLinks);
    } else {
      contactBtn.parentNode.insertBefore(hire, contactBtn);
    }

    var trigger = hire.querySelector('.nav-hire-trigger');
    var closeTimer = null;
    function openDropdown() {
      clearTimeout(closeTimer);
      hire.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function startCloseTimer() {
      closeTimer = setTimeout(function () {
        hire.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 500);
    }
    hire.addEventListener('mouseenter', openDropdown);
    hire.addEventListener('mouseleave', startCloseTimer);
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (hire.classList.contains('open')) {
        hire.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        openDropdown();
      }
    });
    document.addEventListener('click', function (e) {
      if (!hire.contains(e.target)) {
        hire.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- See-more toggle for .portfolio-grid sections ----
  // Any grid with more than 8 .fw-card items shows only the first 8 + a
  // "See more (N)" button that expands the rest. Works automatically when
  // new images are added to a section.
  function setupSeeMore() {
    document.querySelectorAll('.portfolio-grid').forEach(function (grid) {
      if (grid.dataset.seeMoreInited === 'true') return;
      var cards = grid.querySelectorAll('.fw-card');
      if (cards.length <= 8) return;
      grid.dataset.seeMoreInited = 'true';

      var hidden = cards.length - 8;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'portfolio-see-more';
      btn.textContent = 'See more (' + hidden + ')';

      btn.addEventListener('click', function () {
        var nowExpanded = grid.classList.toggle('expanded');
        btn.textContent = nowExpanded ? 'See less' : 'See more (' + hidden + ')';
        if (!nowExpanded) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      grid.parentNode.insertBefore(btn, grid.nextSibling);
    });
  }

  function init() {
    injectNavExtras();
    setupSeeMore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
