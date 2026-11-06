/* =========================================================================
   SMG Property Maintenance — main-cosy.js  (Editorial Luxury variant)
   Fluid island nav + hamburger morph, glass menu stagger, magnetic CTAs,
   heavy fade-up+blur reveal, gentle testimonial rotation.
   transform/opacity only. IntersectionObserver (no scroll listeners).
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* =======================================================================
     FLUID ISLAND NAV — hamburger morph + full-screen glass menu
     ======================================================================= */
  (function nav() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;

    function toggle(open) {
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () {
      toggle(!document.body.classList.contains('menu-open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle(false);
    });
  })();

  /* =======================================================================
     MAGNETIC CTAs — pull toward cursor (transform only, rAF-throttled)
     ======================================================================= */
  (function magnetic() {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var raf = null;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform = 'translate(' + (mx * 0.2) + 'px,' + (my * 0.3) + 'px)';
        });
      });
      el.addEventListener('mouseleave', function () {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = 'translate(0,0)';
      });
    });
  })();

  /* =======================================================================
     TESTIMONIALS — gentle rotation
     NOTE: placeholder reviews — MUST be replaced with genuine SMG reviews
     before launch. Do not publish invented testimonials for a real business.
     ======================================================================= */
  (function testimonials() {
    var q = document.getElementById('tq'), n = document.getElementById('tn'),
        l = document.getElementById('tl'), a = document.getElementById('ta'),
        by = document.querySelector('.quote-e__by');
    if (!q) return;

    var items = [
      { q: 'They repainted the whole interior of our house without a single mark left behind. Tidy, punctual and the finish is flawless — genuinely couldn’t fault them.', n: 'Rhiannon Hale', l: 'Homeowner · Gloucester', a: 'RH' },
      { q: 'We use SMG across our rental portfolio. End-of-tenancy turnarounds are quick, clean and always ready for the next tenant on time.', n: 'Marcus Ellery', l: 'Lettings Manager · Cheltenham', a: 'ME' },
      { q: 'The exterior of our shopfront had been neglected for years. SMG worked evenings so we never lost a day of trade. It looks brand new.', n: 'Priya Sandhu', l: 'Business Owner · Stroud', a: 'PS' }
    ];

    var i = 0;
    setInterval(function () {
      i = (i + 1) % items.length;
      q.style.opacity = 0; if (by) by.style.opacity = 0;
      setTimeout(function () {
        q.textContent = items[i].q; n.textContent = items[i].n;
        l.textContent = items[i].l; a.textContent = items[i].a;
        q.style.opacity = 1; if (by) by.style.opacity = 1;
      }, 480);
    }, 7000);
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
      if (after) after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
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
     REVEAL ON SCROLL — heavy fade-up + blur, staggered via CSS --d
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
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

});
