/* Tóth Dezső EV – oldal interakciók */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EMAIL = 'tothdedi76@gmail.com';

  /* ---------- Téglafal felépítése (hero) ---------- */
  function buildWall() {
    var wall = document.getElementById('wall');
    if (!wall) return;

    var rows = 9;
    var perRow = 4;
    var palette = ['#b5472a', '#a63f24', '#c2553a', '#9c3a22', '#b84d2f', '#ad4428'];
    var frag = document.createDocumentFragment();
    var n = 0;

    for (var r = 0; r < rows; r++) {
      var row = document.createElement('div');
      row.className = 'wall__row';
      var offset = r % 2 === 1;
      var count = offset ? perRow + 1 : perRow;

      for (var b = 0; b < count; b++) {
        var brick = document.createElement('span');
        brick.className = 'brick';
        if (offset && (b === 0 || b === count - 1)) brick.className += ' brick--half';
        brick.style.setProperty('--c', palette[Math.floor(Math.random() * palette.length)]);
        brick.style.setProperty('--r', (Math.random() * 16 - 8).toFixed(1) + 'deg');
        // soronként alulról felfelé, a sorban balról jobbra rakjuk a téglákat
        brick.style.setProperty('--delay', (0.35 + n * 0.045).toFixed(3) + 's');
        row.appendChild(brick);
        n++;
      }
      frag.appendChild(row);
    }
    wall.appendChild(frag);
  }

  /* ---------- Fejléc: görgetés állapot + elrejtés lefelé görgetéskor ---------- */
  function initHeader() {
    var header = document.querySelector('.header');
    var fab = document.querySelector('.fab');
    var lastY = window.scrollY;
    var ticking = false;
    var contactInView = false;

    // a kapcsolat résznél és a láblécnél nincs szükség a lebegő hívás gombra
    var contact = document.getElementById('kapcsolat');
    if (contact && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        contactInView = entries[0].isIntersecting;
        update();
      }, { rootMargin: '0px 0px -25% 0px' }).observe(contact);
    }

    function update() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 20);

      var menuOpen = document.body.classList.contains('menu-open');
      var goingDown = y > lastY && y > 400;
      header.classList.toggle('is-hidden', goingDown && !menuOpen);

      if (fab) fab.classList.toggle('is-visible', y > window.innerHeight * 0.6 && !contactInView);

      // az oldal tetején egyik menüpont sem aktív
      if (y < window.innerHeight * 0.5) {
        document.querySelectorAll('.nav__link.is-active').forEach(function (l) { l.classList.remove('is-active'); });
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Mobil menü ---------- */
  function initMenu() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (!burger || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
      document.body.classList.toggle('menu-open', open);
    }

    burger.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && nav.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ---------- Görgetésre megjelenés ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Aktív menüpont ---------- */
  function initActiveLink() {
    var links = document.querySelectorAll('.nav__link');
    if (!('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  /* ---------- Folyamat: görgetéshez kötött vonal ---------- */
  function initSteps() {
    var steps = document.getElementById('steps');
    if (!steps) return;
    var items = steps.querySelectorAll('.step');
    var ticking = false;

    function update() {
      var rect = steps.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0, amikor a lista teteje a képernyő 75%-ánál van; 1, amikor az alja a 55%-nál
      var start = vh * 0.75;
      var end = vh * 0.55;
      var total = rect.height + (start - end);
      var p = (start - rect.top) / total;
      p = Math.max(0, Math.min(1, p));
      if (reduceMotion) p = rect.top < vh ? 1 : 0;

      steps.style.setProperty('--progress', p.toFixed(3));
      var active = Math.round(p * (items.length - 1) + 0.0001);
      items.forEach(function (el, i) {
        el.classList.toggle('is-done', p > 0 && i <= active);
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Másolás gomb ---------- */
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var done = function () { toast('E-mail cím vágólapra másolva'); };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text); done();
        }
      });
    });
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* nincs teendő */ }
    document.body.removeChild(ta);
  }

  /* ---------- Űrlap: levelezőprogram megnyitása kitöltött üzenettel ---------- */
  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var service = form.service.value;
      var message = form.message.value.trim();

      var invalid = [];
      if (!name) invalid.push(form.name);
      if (!message) invalid.push(form.message);

      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('is-invalid'); });
      if (invalid.length) {
        invalid.forEach(function (input) {
          var field = input.closest('.field');
          void field.offsetWidth; // animáció újraindítása
          field.classList.add('is-invalid');
        });
        invalid[0].focus();
        status.textContent = 'Kérem, adja meg a nevét és röviden a munka leírását.';
        return;
      }

      var subject = 'Árajánlatkérés – ' + service;
      var body = [
        'Név: ' + name,
        phone ? 'Telefon: ' + phone : null,
        'Munka típusa: ' + service,
        '',
        message
      ].filter(function (x) { return x !== null; }).join('\n');

      status.textContent = 'Megnyitjuk a levelezőprogramot… Ha nem nyílik meg, írjon közvetlenül: ' + EMAIL;
      window.location.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field) field.classList.remove('is-invalid');
    });
  }

  /* ---------- Év a láblécben ---------- */
  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  buildWall();
  initHeader();
  initMenu();
  initReveal();
  initActiveLink();
  initSteps();
  initCopy();
  initForm();
  initYear();
})();
