/* =========================================================================
   SMG Property Maintenance — main-minimal.js  (Minimalist / Editorial)
   Quiet motion: mobile nav, FAQ accordion, gentle fade-up, testimonial swap.
   transform/opacity only. IntersectionObserver (no scroll listeners).
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Mobile nav: close on link click ---------- */
  var nav = document.getElementById('nav');
  if (nav) nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* =======================================================================
     FAQ ACCORDION — single-open, + / - morph via CSS
     ======================================================================= */
  (function faq() {
    var items = document.querySelectorAll('.faq__item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq__q');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (i) { i.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    });
  })();

  /* =======================================================================
     TESTIMONIALS — gentle rotation
     NOTE: reviews AND the trust-row figures (15+ yrs, 500+ homes, 4.9)
     are illustrative placeholders. Replace with genuine, verified numbers
     and real reviews before launch — do not publish invented social proof.
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
      q.style.opacity = 0; if (by) by.style.opacity = 0;
      setTimeout(function () {
        q.textContent = items[i].q; n.textContent = items[i].n;
        l.textContent = items[i].l; a.textContent = items[i].a;
        q.style.opacity = 1; if (by) by.style.opacity = 1;
      }, 420);
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
     REVEAL ON SCROLL — quiet fade-up, staggered via CSS --index
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
