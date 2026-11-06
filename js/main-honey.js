/* =========================================================================
   SMG Property Maintenance — main-honey.js  (Editorial Luxury / Honey)
   MOTION 2 — subtle: island nav + hamburger morph, glass menu stagger,
   gentle fade-up reveal, testimonial rotation. No magnetic cursor-follow.
   transform/opacity only. IntersectionObserver (no scroll listeners).
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* =======================================================================
     FAQ ACCORDION — single-open, serif questions, +/− morph via CSS
     ======================================================================= */
  (function faq() {
    var items = document.querySelectorAll('.faq__item');
    items.forEach(function (item) {
      item.querySelector('.faq__q').addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (i) { i.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    });
  })();

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
     TESTIMONIALS — gentle rotation
     NOTE: placeholder reviews AND the 4.9★ / "500+ homes" figures are
     illustrative. MUST be replaced with genuine reviews and verified
     numbers before launch — do not publish invented social proof.
     ======================================================================= */
  (function testimonials() {
    var q = document.getElementById('tq'), n = document.getElementById('tn'),
        l = document.getElementById('tl'), a = document.getElementById('ta'),
        by = document.querySelector('.quote-h__by');
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
     TEAM CAROUSEL — cross-fade between members, prev/next/dots
     ======================================================================= */
  (function teamCarousel() {
    var members = document.querySelectorAll('.about-member');
    var dots    = document.querySelectorAll('.about-team__dot');
    var prevBtn = document.getElementById('teamPrev');
    var nextBtn = document.getElementById('teamNext');
    var currentEl = document.getElementById('teamCurrent');
    var totalEl   = document.getElementById('teamTotal');
    var stage   = document.querySelector('.about-team__stage');
    if (!members.length) return;

    var total = members.length;
    var current = 0;
    var busy = false;
    var timer = null;
    var DELAY = 4500;

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function go(index) {
      if (busy) return;
      var next = ((index % total) + total) % total;
      if (next === current) return;
      busy = true;

      members[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = next;
      members[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
      if (currentEl) currentEl.textContent = pad(current + 1);

      setTimeout(function() { busy = false; }, 600);
    }

    function startTimer() { timer = setInterval(function() { go(current + 1); }, DELAY); }
    function stopTimer()  { clearInterval(timer); timer = null; }
    function resetTimer() { stopTimer(); startTimer(); }

    if (prevBtn) prevBtn.addEventListener('click', function() { go(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { go(current + 1); resetTimer(); });
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { go(i); resetTimer(); });
    });

    if (stage) {
      stage.addEventListener('mouseenter', stopTimer);
      stage.addEventListener('mouseleave', startTimer);
      stage.addEventListener('focusin',    stopTimer);
      stage.addEventListener('focusout',   startTimer);
    }

    if (totalEl)   totalEl.textContent   = pad(total);
    if (currentEl) currentEl.textContent = pad(1);

    if (!reduceMotion) startTimer();
  })();

  /* =======================================================================
     SERVICE NAV — active section tracking (floating pill + left rail)
     ======================================================================= */
  (function serviceNav() {
    var pillLinks = document.querySelectorAll('.service-nav__pill a');
    var railLinks = document.querySelectorAll('.service-siderail__link');
    var sections  = document.querySelectorAll('.service-section[id]');
    if (!sections.length) return;

    var indicator = document.querySelector('.service-nav__indicator');

    function positionIndicator() {
      if (!indicator) return;
      var pill = indicator.parentElement;
      if (!pill || pill.offsetParent === null) return;
      var activeLink = pill.querySelector('a.active');
      if (!activeLink) return;
      var pillLeft = pill.getBoundingClientRect().left;
      var lr = activeLink.getBoundingClientRect();
      indicator.style.width = lr.width + 'px';
      indicator.style.transform = 'translateX(' + (lr.left - pillLeft) + 'px)';
    }

    function setActive(id) {
      var href = '#' + id;
      [pillLinks, railLinks].forEach(function(list) {
        list.forEach(function(l) {
          l.classList.toggle('active', l.getAttribute('href') === href);
        });
      });
      positionIndicator();
    }

    [pillLinks, railLinks].forEach(function(list) {
      list.forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          var target = document.getElementById(link.getAttribute('href').slice(1));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    });

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-15% 0px -65% 0px' });

    sections.forEach(function(s) { io.observe(s); });

    /* Position indicator on load and on resize */
    positionIndicator();
    window.addEventListener('resize', positionIndicator);
  })();

  /* =======================================================================
     REQUEST FORM — Netlify Forms AJAX + URL param pre-selection + file label
     ======================================================================= */
  (function requestForm() {
    var form = document.getElementById('requestForm');
    if (!form) return;

    /* Pre-select service dropdown from ?service=residential etc. */
    var params = new URLSearchParams(window.location.search);
    var svc = params.get('service');
    if (svc) {
      var sel = document.getElementById('fservice');
      if (sel) sel.value = svc;
    }

    /* Update file label with selected file count */
    var fileInput  = document.getElementById('fphotos');
    var fileLabel  = document.getElementById('fileSelected');
    if (fileInput && fileLabel) {
      fileInput.addEventListener('change', function () {
        var n = fileInput.files.length;
        fileLabel.textContent = n === 0 ? 'No file chosen'
          : n === 1 ? fileInput.files[0].name
          : n + ' photos selected';
      });
    }

    /* AJAX submission to Web3Forms */
    var submitBtn = form.querySelector('.form-submit');
    var successEl = document.getElementById('formSuccess');
    var errorEl   = document.getElementById('formError');
    var origLabel = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (errorEl) errorEl.hidden = true;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending… <span class="btn-pill__icon" aria-hidden="true"><svg viewBox="0 0 24 24" style="animation:spin .8s linear infinite"><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg></span>';

      fetch('/', {
        method: 'POST',
        body: new FormData(form)
      })
      .then(function (res) {
        if (res.ok) {
          form.hidden = true;
          if (successEl) successEl.hidden = false;
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        if (errorEl) errorEl.hidden = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = origLabel;
      });
    });
  })();

  /* =======================================================================
     REVEAL ON SCROLL — subtle fade-up, staggered via CSS --d
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
