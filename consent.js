/* Consent-Manager juliandeutsch.de – selbst gehostet, keine Fremdskripte.
 * Aktivierung: GA_ID unten eintragen (z. B. 'G-XXXXXXXXXX'). Solange leer, erscheint kein Banner,
 * weil die Website ohne Analytics keine einwilligungspflichtigen Technologien einsetzt.
 * Test ohne ID: URL mit ?consent=preview aufrufen.
 */
(function () {
  'use strict';
  var GA_ID = '';                       // <- GA4 Mess-ID eintragen, um Analytics + Banner zu aktivieren
  var KEY = 'jd-consent-v1';
  var preview = /[?&]consent=preview/.test(location.search);
  if (!GA_ID && !preview) { exposeApi(); return; }

  function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }

  function loadGA() {
    if (!GA_ID || window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    // Ereignisse: Telefon-Klick, Formular-Absendung
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="tel:"]');
      if (a) gtag('event', 'phone_click', { form_location: location.pathname });
    });
    document.addEventListener('submit', function (e) {
      if (e.target && e.target.id === 'contactForm') gtag('event', 'lead_form_submit', { form_location: location.pathname });
    });
  }

  function banner() {
    if (document.getElementById('jdConsent')) return;
    var el = document.createElement('div');
    el.id = 'jdConsent'; el.className = 'consent'; el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite'); el.setAttribute('aria-label', 'Cookie-Einstellungen');
    el.innerHTML =
      '<div class="consent-box">' +
        '<p class="consent-title">Kurze Frage zu Statistik-Cookies</p>' +
        '<p class="consent-text">Ich würde gern anonymisiert messen, welche Seiten gelesen werden (Google Analytics). Technisch notwendige Funktionen laufen ohne Cookies. Details in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p>' +
        '<div class="consent-actions">' +
          '<button type="button" class="btn btn-secondary" data-consent="deny">Ablehnen</button>' +
          '<button type="button" class="btn btn-primary" data-consent="allow">Statistik erlauben</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-open'); });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]'); if (!b) return;
      var allow = b.getAttribute('data-consent') === 'allow';
      write({ analytics: allow, ts: Date.now() });
      el.classList.remove('is-open');
      setTimeout(function () { el.remove(); }, 250);
      if (allow) loadGA();
    });
  }

  function exposeApi() {
    window.jdConsent = { open: function () { banner(); }, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} banner(); } };
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-consent-open]');
      if (a) { e.preventDefault(); if (GA_ID || preview) banner(); else alert('Diese Website setzt derzeit keine Statistik-Cookies ein.'); }
    });
  }

  exposeApi();
  var c = read();
  if (c && c.analytics === true) loadGA();
  else if (!c) banner();
})();
