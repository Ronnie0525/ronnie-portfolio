/* Navbar enhancements: Available badge + Search overlay
 * Injects markup into every page's .nav-right and end of body.
 * Triggered by Ctrl/Cmd+K or by the magnifier button.
 */
(function () {
  'use strict';

  var PROJECTS = [
    { title: 'Aurum Crypto',                cat: 'White-Label · Crypto',     url: 'https://ronnie0525.github.io/Crypto/',                                                          external: true,  tags: 'crypto app typescript react native web design fintech wallet' },
    { title: 'Play and Worship',            cat: 'Platform · Worship',        url: 'https://ronnie0525.github.io/Play-and-Worship/',                                                external: true,  tags: 'platform worship music ministry app live song lyrics' },
    { title: "Abby's Burger",               cat: 'White-Label · Restaurant',  url: "https://ronnie0525.github.io/Abbys-Burger/Abbys%20Hungry%20No%20More/",                          external: true,  tags: 'restaurant burger landing page food menu' },
    { title: 'Chammica Apparel',            cat: 'White-Label · Apparel',     url: "https://ronnie0525.github.io/Chammica-apparel/Chammica's%20Apparel/",                            external: true,  tags: 'apparel brand fashion clothing ecommerce' },
    { title: 'Ar-ar Coffee & Sweets',       cat: 'White-Label · Cafe',        url: 'https://ronnie0525.github.io/Ar-ar-Coffee-and-sweets/Ar-Ar%20Coffee%20and%20Sweets/',           external: true,  tags: 'cafe coffee sweets restaurant menu warm' },
    { title: 'Network Split Bill Flow',     cat: 'App & UI Design',           url: '/skill-uiux/',                                                                                  external: false, tags: 'ui ux figma payment app split bill mobile network international' },
    { title: 'University of Khorfakkan',    cat: 'Social Media · Campaign',   url: '/skill-social-media/',                                                                          external: false, tags: 'instagram university khorfakkan post campaign student promotion' },
    { title: 'UI/UX & Web Design',          cat: 'Portfolio',                 url: '/skill-uiux/',                                                                                  external: false, tags: 'uiux web design figma wireframe prototype mobile responsive' },
    { title: 'Photography',                 cat: 'Portfolio',                 url: '/skill-photography/',                                                                           external: false, tags: 'photography photo camera shoot portrait product' },
    { title: 'Video Editing',               cat: 'Portfolio',                 url: '/skill-video-editing/',                                                                         external: false, tags: 'video editing premiere reel cinematic colour grade' },
    { title: 'Artificial Intelligence',     cat: 'Portfolio',                 url: '/skill-artificial-intelligence/',                                                               external: false, tags: 'ai artificial intelligence generative midjourney workflow' },
    { title: 'Graphic Design',              cat: 'Portfolio',                 url: '/skill-graphic-design/',                                                                        external: false, tags: 'graphic design logo brand identity print poster' },
    { title: 'Social Media',                cat: 'Portfolio',                 url: '/skill-social-media/',                                                                          external: false, tags: 'social media instagram tiktok content marketing' },
    { title: 'About Me',                    cat: 'Page',                       url: '/about/',                                                                                       external: false, tags: 'about me ronnie balonon dubai bio story journey' },
    { title: 'Contact',                     cat: 'Page',                       url: '/contact/',                                                                                     external: false, tags: 'contact email phone whatsapp message hire' },
    { title: 'Resume / CV',                 cat: 'Page',                       url: '/resume/',                                                                                      external: false, tags: 'resume cv curriculum vitae experience skills' }
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function injectNavExtras() {
    var navRight = document.querySelector('.nav-right');
    if (!navRight || navRight.querySelector('.nav-available')) return;

    var contactBtn = navRight.querySelector('a.btn[href="/contact/"]') ||
                     navRight.querySelector('a[href="/contact/"].btn');
    if (!contactBtn) return;

    var badge = document.createElement('a');
    badge.href = '/contact/';
    badge.className = 'nav-available';
    badge.setAttribute('aria-label', 'Available for hire');
    badge.innerHTML = '<span class="nav-available-dot" aria-hidden="true"></span>Available';

    var search = document.createElement('button');
    search.type = 'button';
    search.className = 'nav-search-btn';
    search.id = 'navSearchTrigger';
    search.setAttribute('aria-label', 'Search (Ctrl+K)');
    search.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

    contactBtn.parentNode.insertBefore(badge, contactBtn);
    contactBtn.parentNode.insertBefore(search, contactBtn);
  }

  function injectOverlay() {
    if (document.getElementById('navSearchOverlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'navSearchOverlay';
    overlay.className = 'nav-search-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="nav-search-modal" role="dialog" aria-label="Search portfolio">' +
        '<div class="nav-search-input-wrap">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
          '<input type="search" class="nav-search-input" placeholder="Search projects, pages, skills..." autocomplete="off" spellcheck="false"/>' +
          '<button type="button" class="nav-search-close" aria-label="Close (Esc)">Esc</button>' +
        '</div>' +
        '<div class="nav-search-results" id="navSearchResults"></div>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function renderResults(query) {
    var results = document.getElementById('navSearchResults');
    if (!results) return;
    var q = (query || '').toLowerCase().trim();
    var filtered = q
      ? PROJECTS.filter(function (p) {
          return p.title.toLowerCase().indexOf(q) !== -1 ||
                 p.cat.toLowerCase().indexOf(q) !== -1 ||
                 p.tags.toLowerCase().indexOf(q) !== -1;
        })
      : PROJECTS;

    if (!filtered.length) {
      results.innerHTML = '<div class="nav-search-empty">No matches for &ldquo;' + escapeHtml(query) + '&rdquo;</div>';
      return;
    }

    results.innerHTML = filtered.map(function (p) {
      var attrs = p.external ? ' target="_blank" rel="noopener"' : '';
      return (
        '<a class="nav-search-item" href="' + escapeHtml(p.url) + '"' + attrs + '>' +
          '<div class="nav-search-item-text">' +
            '<div class="nav-search-item-title">' + escapeHtml(p.title) + '</div>' +
            '<div class="nav-search-item-cat">' + escapeHtml(p.cat) + '</div>' +
          '</div>' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>' +
        '</a>'
      );
    }).join('');
  }

  function setup() {
    injectNavExtras();
    injectOverlay();

    var trigger = document.getElementById('navSearchTrigger');
    var overlay = document.getElementById('navSearchOverlay');
    var input = overlay ? overlay.querySelector('.nav-search-input') : null;
    var closeBtn = overlay ? overlay.querySelector('.nav-search-close') : null;

    function openSearch() {
      if (!overlay) return;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      renderResults('');
      setTimeout(function () { if (input) input.focus(); }, 80);
    }
    function closeSearch() {
      if (!overlay) return;
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (input) input.value = '';
    }

    if (trigger) trigger.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    if (overlay) overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });
    if (input) input.addEventListener('input', function (e) { renderResults(e.target.value); });

    document.addEventListener('keydown', function (e) {
      var isCmdK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
      if (isCmdK) {
        e.preventDefault();
        if (overlay && overlay.classList.contains('open')) closeSearch();
        else openSearch();
      } else if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
        closeSearch();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
