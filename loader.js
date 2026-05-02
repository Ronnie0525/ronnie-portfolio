// Site splash — long (~2.5s) on first entry, short (~1s) on subsequent navigations
(function() {
  var KEY = 'splashShown_v3';
  var firstVisit = !sessionStorage.getItem(KEY);
  sessionStorage.setItem(KEY, '1');

  var holdMs = firstVisit ? 2500 : 1000;
  var fillMs = firstVisit ? 2.3 : 0.9;

  document.documentElement.classList.add('splash-active');

  var style = document.createElement('style');
  style.textContent = [
    'html.splash-active { overflow: hidden; }',
    '.site-splash {',
    '  position: fixed; inset: 0; z-index: 99999;',
    '  display: flex; flex-direction: column; align-items: center; justify-content: center;',
    '  gap: 1.75rem;',
    '  background: hsl(var(--background, 227 45% 8%));',
    '  transition: opacity 0.5s ease, visibility 0s 0.5s;',
    '}',
    'html.light .site-splash { background: #fff; }',
    '.site-splash.hide { opacity: 0; visibility: hidden; }',
    '.site-splash-logo {',
    '  width: 80px; height: 80px; border-radius: 1.1rem;',
    '  background: var(--gradient-neon, linear-gradient(135deg, hsl(220 100% 50%) 0%, hsl(244 90% 58%) 50%, hsl(268 82% 63%) 100%));',
    '  display: flex; align-items: center; justify-content: center;',
    '  box-shadow: 0 0 40px hsl(var(--primary, 220 100% 50%) / 0.45);',
    '  animation: splashPulse 1.4s ease-in-out infinite;',
    '}',
    '.site-splash-logo img { width: 60%; height: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)); }',
    '@keyframes splashPulse {',
    '  0%, 100% { transform: scale(1); box-shadow: 0 0 40px hsl(var(--primary, 220 100% 50%) / 0.45); }',
    '  50% { transform: scale(1.08); box-shadow: 0 0 70px hsl(var(--primary, 220 100% 50%) / 0.8); }',
    '}',
    '.site-splash-bar {',
    '  width: 200px; height: 3px;',
    '  background: hsl(var(--border, 227 30% 18%));',
    '  border-radius: 4px; overflow: hidden;',
    '}',
    '.site-splash-bar::before {',
    '  content: ""; display: block; height: 100%; width: 0%;',
    '  background: var(--gradient-neon, linear-gradient(90deg, hsl(220 100% 50%), hsl(268 82% 63%)));',
    '  animation: splashFill ' + fillMs + 's cubic-bezier(0.4, 0, 0.2, 1) forwards;',
    '}',
    '@keyframes splashFill { to { width: 100%; } }',
    '.site-splash-name {',
    '  font-family: "Plus Jakarta Sans", system-ui, sans-serif;',
    '  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em;',
    '  text-transform: uppercase;',
    '  color: hsl(var(--muted-foreground, 0 0% 70%));',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  function showSplash() {
    var splash = document.createElement('div');
    splash.className = 'site-splash';
    splash.innerHTML =
      '<div class="site-splash-logo"><img src="/logo.svg" alt="" aria-hidden="true" /></div>' +
      '<div class="site-splash-bar"></div>' +
      '<div class="site-splash-name">Ronnie Balonon</div>';
    document.body.insertBefore(splash, document.body.firstChild);

    setTimeout(function() {
      splash.classList.add('hide');
      document.documentElement.classList.remove('splash-active');
      setTimeout(function() { splash.remove(); }, 400);
    }, holdMs);
  }

  if (document.body) {
    showSplash();
  } else {
    document.addEventListener('DOMContentLoaded', showSplash);
  }
})();
