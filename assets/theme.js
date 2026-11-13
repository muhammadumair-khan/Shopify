(function () {
  // ---- Real countdowns: end time comes from the store setting (epoch seconds), same for every visitor
  var timers = document.querySelectorAll('[data-countdown]');
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    var now = Date.now() / 1000;
    timers.forEach(function (el) {
      var left = Math.floor(+el.dataset.countdown - now);
      if (left <= 0) { var w = el.closest('[data-countdown-wrap]'); if (w) w.hidden = true; var o = el.closest('[data-countdown-wrap-outer]'); if (o) o.hidden = true; return; }
      var v = { d: Math.floor(left / 86400), h: Math.floor(left % 86400 / 3600), m: Math.floor(left % 3600 / 60), s: left % 60 };
      Object.keys(v).forEach(function (k) { var b = el.querySelector('[data-u=' + k + ']'); if (b) b.textContent = pad(v[k]); });
    });
  }
  if (timers.length) { tick(); setInterval(tick, 1000); }

  // ---- Daily dispatch cut-off (UK time, Mon-Fri)
  var cut = document.querySelector('[data-cutoff]');
  function london() {
    var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { wd: p.weekday, h: +p.hour % 24, m: +p.minute };
  }
  function cutoff() {
    if (!cut || !window.Intl) return;
    var t = london(), hour = +cut.dataset.cutoff, weekday = ['Sat', 'Sun'].indexOf(t.wd) < 0;
    if (weekday && t.h < hour) {
      var mins = (hour - t.h) * 60 - t.m;
      cut.textContent = 'Order within ' + Math.floor(mins / 60) + ' hrs ' + (mins % 60) + ' mins for same-day dispatch';
    } else { cut.textContent = 'Order now for dispatch on the next working day'; }
  }
  if (cut) { cutoff(); setInterval(cutoff, 30000); }

  var t = document.querySelector('.menu-toggle'), n = document.querySelector('.nav');
  if (t && n) t.addEventListener('click', function () {
    var o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o);
  });

  // ---- Size guide popup
  var sg = document.querySelector('[data-sg]');
  if (sg && sg.showModal) {
    document.querySelectorAll('[data-sg-open]').forEach(function (b) { b.addEventListener('click', function () { sg.showModal(); }); });
    sg.querySelector('[data-sg-close]').addEventListener('click', function () { sg.close(); });
    sg.addEventListener('click', function (e) { if (e.target === sg) sg.close(); });
  } else {
    document.querySelectorAll('[data-sg-open]').forEach(function (b) { b.hidden = true; });
  }

  // ---- Product gallery: swipe (scroll-snap), arrows, thumbnails, tap-to-zoom, jump to variant photo
  var galApi = null, gal = document.querySelector('[data-gallery]');
  if (gal) {
    var track = gal.querySelector('[data-gal-track]'), slides = [].slice.call(track.children),
        thumbs = [].slice.call(gal.querySelectorAll('[data-gal-thumb]')), thumbBox = gal.querySelector('[data-gal-thumbs]'),
        count = gal.querySelector('[data-gal-count]'), cur = 0, tmr;
    var setActive = function (i) {
      cur = i;
      thumbs.forEach(function (t, k) { t.classList.toggle('is-active', k === i); if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
      if (count) count.textContent = (i + 1) + ' / ' + slides.length;
      if (thumbBox && thumbs[i]) thumbBox.scrollTo({ left: thumbs[i].offsetLeft - 8, behavior: 'smooth' });
    };
    var go = function (i) { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }); setActive(i); };
    track.addEventListener('scroll', function () {
      clearTimeout(tmr); tmr = setTimeout(function () { var i = Math.round(track.scrollLeft / (track.clientWidth || 1)); if (i !== cur) setActive(i); }, 80);
    }, { passive: true });
    thumbs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    var pv = gal.querySelector('[data-gal-prev]'), nx = gal.querySelector('[data-gal-next]');
    if (pv) pv.addEventListener('click', function () { go(cur - 1); });
    if (nx) nx.addEventListener('click', function () { go(cur + 1); });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); } });
    galApi = { toImage: function (id) { for (var k = 0; k < slides.length; k++) { if (String(slides[k].dataset.imageId) === String(id)) { go(k); return; } } } };
    // Tap or click a photo to zoom
    var lb = gal.querySelector('[data-lightbox]'), lbImg = gal.querySelector('[data-lb-img]');
    if (lb && lb.showModal) {
      slides.forEach(function (sl) { sl.addEventListener('click', function () {
        if (!sl.dataset.full) return; lbImg.src = sl.dataset.full; lbImg.classList.remove('zoomed'); lbImg.style.transformOrigin = ''; lb.showModal();
      }); });
      lb.querySelector('[data-lb-close]').addEventListener('click', function () { lb.close(); });
      lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
      lbImg.addEventListener('click', function (e) {
        var r = lbImg.getBoundingClientRect();
        lbImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
        lbImg.classList.toggle('zoomed');
      });
    }
  }

  // ---- Delivery estimate (UK time, working days, bank holidays skipped)
  var dl = document.querySelector('[data-delivery]');
  if (dl && window.Intl) {
    var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var hol = {}; (dl.dataset.holidays || '').split(/[\s,]+/).forEach(function (h) { if (h) hol[h] = 1; });
    var iso = function (d) { return d.toISOString().slice(0, 10); };
    var isWork = function (d) { var w = d.getUTCDay(); return w > 0 && w < 6 && !hol[iso(d)]; };
    var addDay = function (d) { return new Date(d.getTime() + 86400000); };
    var nextWork = function (d) { do { d = addDay(d); } while (!isWork(d)); return d; };
    var addWork = function (d, n) { for (var k = 0; k < n; k++) d = nextWork(d); return d; };
    var fmt = function (d) { return DAYS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
    var estimate = function () {
      var p = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var today = new Date(Date.UTC(+p.year, +p.month - 1, +p.day)), hour = +p.hour % 24, cut = +dl.dataset.dlCutoff;
      var before = isWork(today) && hour < cut, dispatch = before ? today : nextWork(today);
      var lo = addWork(dispatch, +dl.dataset.min), hi = addWork(dispatch, +dl.dataset.max);
      var range = iso(lo) === iso(hi) ? '<b>' + fmt(lo) + '</b>' : '<b>' + fmt(lo) + ' – ' + fmt(hi) + '</b>';
      var note = '';
      if (before) { var m = (cut - hour) * 60 - (+p.minute); note = ' <small>Order within ' + Math.floor(m / 60) + ' hrs ' + (m % 60) + ' mins</small>'; }
      dl.querySelector('[data-delivery-text]').innerHTML = range + note;
    };
    estimate(); setInterval(estimate, 60000);
  }

  // ---- "You may also like": Shopify's product recommendations, loaded after the page
  var rc = document.querySelector('[data-recs]');
  if (rc && rc.dataset.url && window.fetch && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en, ob) {
      if (!en[0].isIntersecting) return; ob.disconnect();
      fetch(rc.dataset.url).then(function (r) { return r.text(); }).then(function (html) {
        var el = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-recs]');
        if (el && el.innerHTML.trim()) rc.innerHTML = el.innerHTML;
      }).catch(function () {});
    }, { rootMargin: '300px' }).observe(rc);
  }

  var f = document.querySelector('[data-product-form]');
  if (!f) return;
  var data = JSON.parse(f.querySelector('[data-variants]').textContent);
  var idInput = f.querySelector('[name=id]'), btn = f.querySelector('[data-add]'),
      price = document.querySelector('[data-price]'),
      bar = document.querySelector('[data-atc-bar]'),
      barBtn = document.querySelector('[data-bar-btn]'),
      barPrice = document.querySelector('[data-bar-price]');

  // Variant change: price, VAT, savings, stock and URL follow the chosen size
  f.addEventListener('change', function (e) {
    if (e.target === idInput) return; // our own id update (see below)
    var chosen = Array.from(f.querySelectorAll('.opt')).map(function (g) {
      var c = g.querySelector('input:checked'); return c && c.value;
    });
    var v = data.find(function (x) { return x.options.every(function (o, i) { return o === chosen[i]; }); });
    showMsg('');
    if (!v) { idInput.value = ''; setLabel('Unavailable', true); stock(null); return; } // this combination does not exist: never add a wrong item
    idInput.value = v.id;
    idInput.dispatchEvent(new Event('change', { bubbles: true })); // lets Shopify's express checkout buttons follow the size
    if (galApi && v.image) galApi.toImage(v.image);
    setLabel(v.available ? btn.dataset.labelAdd : btn.dataset.labelSold, !v.available);
    stock(v);
    if (price) price.innerHTML = v.price_html;
    if (barPrice) barPrice.innerHTML = v.price_html;
    try { var u = new URL(location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u); } catch (e) {}
  });

  var low = document.querySelector('[data-lowstock]');
  function stock(v) {
    if (!low) return;
    var t = +low.dataset.threshold;
    var show = t > 0 && v && v.managed && v.available && v.qty > 0 && v.qty <= t;
    low.hidden = !show;
    if (show) low.textContent = v.qty === 1 ? 'Only 1 left in stock' : 'Only ' + v.qty + ' left in stock';
  }
  stock(data.find(function (x) { return String(x.id) === idInput.value; }));

  function setLabel(text, disabled) {
    [btn, barBtn].forEach(function (b) { if (b) { b.textContent = text; b.disabled = !!disabled; } });
  }

  var msg = document.querySelector('[data-atc-msg]');
  function showMsg(t) { if (msg) { msg.textContent = t; msg.hidden = !t; } }

  // Confirmation toast with links, so the shopper sees that the item was added
  var toast;
  function showToast(text) {
    if (!toast) {
      toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
    }
    toast.innerHTML = '<span></span> <a href="' + window.shopRoutes.cart + '">View cart</a> <a href="/checkout">Checkout</a>';
    toast.firstChild.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { toast.classList.remove('show'); }, 5000);
  }

  // Add to cart without a page reload. Network failures fall back to a normal form submit;
  // stock errors (e.g. "only 2 available") are shown next to the button instead.
  var busy = false;
  f.addEventListener('submit', function (e) {
    if (!window.fetch || !window.shopRoutes) return;
    if (e.submitter && e.submitter.name === 'checkout') return; // express checkout / Buy it now goes straight to checkout
    e.preventDefault();
    if (busy || !idInput.value) return;
    busy = true; showMsg('');
    var original = btn.textContent;
    setLabel('Adding…', true);
    var failedWith = null;
    fetch(window.shopRoutes.cartAdd + '.js', { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
      .then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok) { failedWith = j.description || j.message || 'Could not add this item.'; throw new Error('rejected'); }
          return j;
        });
      })
      .then(function (item) {
        return fetch(window.shopRoutes.cart + '.js').then(function (r) { return r.json(); }).then(function (cart) { return [item, cart]; });
      })
      .then(function (res) {
        var cart = res[1];
        document.querySelectorAll('.cart-count').forEach(function (c) { c.textContent = cart.item_count; });
        setLabel('Added ✓', true);
        showToast(res[0].quantity + ' × ' + res[0].product_title + ' added to your cart');
        setTimeout(function () { setLabel(original, false); busy = false; }, 1500);
      })
      .catch(function () {
        busy = false;
        if (failedWith) { showMsg(failedWith); setLabel(original, false); }
        else { f.submit(); }
      });
  });

  // Sticky add-to-cart bar on phones once the main button has scrolled out of view
  if (bar && barBtn && 'IntersectionObserver' in window) {
    bar.hidden = false;
    barBtn.addEventListener('click', function () { btn.click(); });
    new IntersectionObserver(function (en) { bar.classList.toggle('show', !en[0].isIntersecting && en[0].boundingClientRect.top < 0); })
      .observe(btn);
    if (barPrice) barPrice.innerHTML = data.find(function (x) { return String(x.id) === idInput.value; }).price_html;
  }
})();
