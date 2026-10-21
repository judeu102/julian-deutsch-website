/* motion.js – Animationen für juliandeutsch.de
 * Scroll-Reveal (alle Browser), Zähler, Karten-Spotlight, Lese-Fortschritt, Hero-Parallax.
 * Respektiert "Bewegung reduzieren"; ohne JS bleibt alles sichtbar.
 */
(function () {
  'use strict';
  var mm = function (q) { return window.matchMedia && window.matchMedia(q).matches; };
  if (mm('(prefers-reduced-motion: reduce)')) return;
  var finePointer = mm('(hover: hover) and (pointer: fine)');
  var root = document.documentElement;
  root.classList.add('js-motion');

  /* ---------- 1. Scroll-Reveal mit Staffelung ---------- */
  var SEL = [
    '.section-header', '.service-card', '.blog-card', '.detail-card', '.target-card',
    '.insight-card', '.related-article-card', '.why-item', '.advantage-item',
    '.testimonial-card', '.faq-item', '.glossary-category', '.trust-item',
    '.process-step', '.logo-item', '.author-box', '.service-infobox', '.service-toc',
    '.article-toc', '.article-content > h2', '.article-content > .table-wrap',
    '.cta-banner .container', '.tool-preview', '.tool-form', '.glossar-aside-card',
    '.article-aside-card', '.automation-flow', '.kl-svg', '.stein-scene', '.case-chart'
  ].join(',');
  var els = Array.prototype.slice.call(document.querySelectorAll(SEL)).filter(function (el) {
    return !el.closest('.hero-visual, .page-hero, .article-hero, .logos-track');
  });
  // Staffelung: Index unter Geschwistern desselben Typs
  els.forEach(function (el) {
    var sibs = el.parentElement ? Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList && c.className === el.className; }) : [el];
    el.style.setProperty('--i', Math.min(sibs.indexOf(el), 6));
    el.classList.add('reveal');
  });
  var showAll = function () { els.forEach(function (el) { el.classList.add('is-in'); }); };
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      // Erst verstecken, wenn der Observer nachweislich arbeitet (kein „unsichtbarer“ Inhalt bei Problemen)
      root.classList.add('js-motion-ready');
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
    // Sicherheitsnetz: alles, was im Viewport oder darüber liegt, nach dem Scrollen sicher einblenden
    var sweepT = 0;
    var sweep = function () {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < vh) { el.classList.add('is-in'); io.unobserve(el); }
      });
    };
    window.addEventListener('scroll', function () { clearTimeout(sweepT); sweepT = setTimeout(sweep, 250); }, { passive: true });
    window.addEventListener('load', function () { setTimeout(sweep, 1500); });
  } else {
    showAll();
  }

  /* ---------- 2. Zähler (z. B. „1.500+“) ---------- */
  var nums = document.querySelectorAll('.trust-number');
  if (nums.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, txt = el.textContent.trim();
        var m = txt.match(/^([\d.]+)(.*)$/);
        if (!m) return;
        var target = parseInt(m[1].replace(/\./g, ''), 10), suffix = m[2];
        if (!target || target < 2) return;
        var t0 = null, dur = 1400;
        var fmt = function (n) { return n.toLocaleString('de-DE'); };
        var step = function (t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(target * eased)) + suffix;
          if (p < 1) requestAnimationFrame(step); else el.textContent = txt;
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { cio.observe(n); });
  }

  /* ---------- 3. Spotlight auf Karten (folgt der Maus) ---------- */
  if (finePointer) {
    document.querySelectorAll('.service-card, .detail-card, .target-card, .insight-card, .blog-card, .related-article-card, .testimonial-card').forEach(function (card) {
      card.classList.add('spot');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- 4. Lese-Fortschritt auf Artikeln ---------- */
  var art = document.querySelector('.article-layout .article-content');
  if (art) {
    var bar = document.createElement('div');
    bar.className = 'read-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tick = false;
    var upd = function () {
      tick = false;
      var r = art.getBoundingClientRect(), h = art.offsetHeight - window.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, -r.top / Math.max(1, h)));
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- 5. Hero-Parallax ---------- */
  if (finePointer) {
    document.querySelectorAll('.hero-visual').forEach(function (hero) {
      var raf = 0;
      hero.addEventListener('mousemove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          var r = hero.getBoundingClientRect();
          hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * -18).toFixed(1) + 'px');
          hero.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * -12).toFixed(1) + 'px');
        });
      });
      hero.addEventListener('mouseleave', function () {
        hero.style.setProperty('--mx', '0px'); hero.style.setProperty('--my', '0px');
      });
    });
  }
})();
