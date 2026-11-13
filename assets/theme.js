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

  var f = document.querySelector('[data-product-form]');
  if (!f) return;
  var data = JSON.parse(f.querySelector('[data-variants]').textContent);
  var idInput = f.querySelector('[name=id]'), btn = f.querySelector('[data-add]'),
      price = document.querySelector('[data-price]'),
      bar = document.querySelector('[data-atc-bar]'),
      barBtn = document.querySelector('[data-bar-btn]'),
      barPrice = document.querySelector('[data-bar-price]');

  // Variant change: price, VAT, savings, stock and URL follow the chosen size
  f.addEventListener('change', function () {
    var chosen = Array.from(f.querySelectorAll('.opt')).map(function (g) {
      var c = g.querySelector('input:checked'); return c && c.value;
    });
    var v = data.find(function (x) { return x.options.every(function (o, i) { return o === chosen[i]; }); });
    if (!v) return;
    idInput.value = v.id;
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

  // Add to cart without a page reload; falls back to a normal submit on any error
  f.addEventListener('submit', function (e) {
    if (!window.fetch || !window.shopRoutes) return;
    e.preventDefault();
    var original = btn.textContent;
    setLabel('Adding…', true);
    fetch(window.shopRoutes.cartAdd + '.js', { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('add failed'); return r.json(); })
      .then(function () { return fetch(window.shopRoutes.cart + '.js').then(function (r) { return r.json(); }); })
      .then(function (cart) {
        document.querySelectorAll('.cart-count').forEach(function (c) { c.textContent = cart.item_count; });
        setLabel('Added ✓', true);
        setTimeout(function () { setLabel(original, false); }, 1500);
      })
      .catch(function () { f.submit(); });
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
