/* =========================================================================
   SMG Property Maintenance — main.js  (v2)
   MOTION_INTENSITY 6 — Fluid CSS + light JS. transform/opacity only.
   No window scroll listeners (IntersectionObserver). No React re-renders.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Close mobile nav on link click ---------- */
  var nav = document.getElementById('nav');
  if (nav) nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* =======================================================================
     HERO — asset cross-fade carousel with progress-bar dots
     ======================================================================= */
  (function heroCarousel() {
    var frame = document.getElementById('heroFrame');
    var dotsWrap = document.getElementById('heroDots');
    if (!frame) return;
    var imgs = Array.prototype.slice.call(frame.querySelectorAll('img'));
    if (imgs.length <= 1) return;

    var current = 0, timer, INTERVAL = 5500;

    imgs.forEach(function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Show image ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function go(i) {
      imgs[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (i + imgs.length) % imgs.length;
      imgs[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function start() { timer = setInterval(function () { go(current + 1); }, INTERVAL); }
    function restart() { clearInterval(timer); start(); }
    start();
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearInterval(timer); else start();
    });
  })();

  /* =======================================================================
     KINETIC MARQUEE — duplicate the track once for a seamless -50% loop
     ======================================================================= */
  (function marquee() {
    var track = document.getElementById('marquee');
    if (!track) return;
    track.innerHTML += track.innerHTML; // duplicate so translateX(-50%) is seamless
  })();

  /* =======================================================================
     MAGNETIC BUTTONS — pull toward cursor (transform only, rAF-throttled)
     Vanilla equivalent of Framer's useMotionValue: no state, no re-render.
     ======================================================================= */
  (function magnetic() {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var raf = null;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform = 'translate(' + (mx * 0.25) + 'px,' + (my * 0.35) + 'px)';
        });
      });
      el.addEventListener('mouseleave', function () {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = 'translate(0,0)';
      });
    });
  })();

  /* =======================================================================
     BEFORE / AFTER slider (mouse + touch)
     ======================================================================= */
  (function beforeAfter() {
    var box = document.getElementById('beforeAfter');
    var handle = document.getElementById('baHandle');
    if (!box || !handle) return;
    var after = box.querySelector('.ba__after');
    var dragging = false;

    function setPos(clientX) {
      var rect = box.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
    }
    function down(e) { dragging = true; move(e); }
    function up() { dragging = false; }
    function move(e) { if (!dragging) return; setPos(e.touches ? e.touches[0].clientX : e.clientX); }

    handle.addEventListener('mousedown', down);
    box.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);
    handle.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('touchend', up);
    window.addEventListener('touchmove', move, { passive: true });
  })();

  /* =======================================================================
     TESTIMONIALS — gentle rotation (placeholder reviews; replace with real)
     ======================================================================= */
  (function testimonials() {
    var q = document.getElementById('tq'), n = document.getElementById('tn'),
        l = document.getElementById('tl'), a = document.getElementById('ta'),
        by = document.querySelector('.quote__by');
    if (!q) return;

    var items = [
      { q: 'They repainted the whole interior of our house without a single mark left behind. Tidy, punctual and the finish is flawless — genuinely couldn’t fault them.', n: 'Rhiannon Hale', l: 'Homeowner · Gloucester', a: 'RH' },
      { q: 'We use SMG across our rental portfolio. End-of-tenancy turnarounds are quick, clean and always ready for the next tenant on time.', n: 'Marcus Ellery', l: 'Lettings Manager · Cheltenham', a: 'ME' },
      { q: 'The exterior of our shopfront had been neglected for years. SMG worked evenings so we never lost a day of trade. It looks brand new.', n: 'Priya Sandhu', l: 'Business Owner · Stroud', a: 'PS' }
    ];

    var i = 0;
    setInterval(function () {
      i = (i + 1) % items.length;
      q.style.opacity = 0; by.style.opacity = 0;
      setTimeout(function () {
        q.textContent = items[i].q; n.textContent = items[i].n;
        l.textContent = items[i].l; a.textContent = items[i].a;
        q.style.opacity = 1; by.style.opacity = 1;
      }, 450);
    }, 7000);
  })();

  /* =======================================================================
     REVEAL ON SCROLL — staggered via CSS --d delays
     ======================================================================= */
  (function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

});
