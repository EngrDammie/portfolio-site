/* ============================================================
   DAMMIE OPTIMUS SOLUTIONS — DOCUMENT BEHAVIOUR
   Shared by every guide: theme toggle, reading progress,
   scroll-spy contents, copy-to-clipboard, toast, print.
   Requires the matching IDs from the shell in docs.html.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var btn = document.getElementById('themeBtn');
  var icon = document.getElementById('themeIcon');
  var label = document.getElementById('themeLabel');
  var stored = null;
  try { stored = localStorage.getItem('dos-guide-theme'); } catch (e) {}
  apply(stored || 'dark');

  function apply(t) {
    root.setAttribute('data-theme', t);
    if (icon) icon.textContent = t === 'dark' ? '◐' : '◑';
    if (label) label.textContent = t === 'dark' ? 'Light' : 'Dark';
  }
  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('dos-guide-theme', next); } catch (e) {}
    });
  }

  /* ---------- Print / save as PDF ---------- */
  var printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  /* ---------- Reading progress ---------- */
  var bar = document.getElementById('progress');
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-spy for the contents list ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var sections = Object.keys(map)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('active'); });
          var a = map[e.target.id];
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-88px 0px -70% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Copy to clipboard ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1900);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.copy'), function (b) {
    b.addEventListener('click', function () {
      var pre = b.parentNode.querySelector('pre');
      if (!pre) return;
      var text = pre.innerText;
      var done = function () {
        b.textContent = 'Copied';
        b.classList.add('done');
        showToast('Copied to clipboard');
        setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('done'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallback(text, done); });
      } else {
        fallback(text, done);
      }
    });
  });
  function fallback(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) { showToast('Press Ctrl+C to copy'); }
    document.body.removeChild(ta);
  }
})();
