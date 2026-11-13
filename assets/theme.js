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
    showMsg('');
    if (!v) { idInput.value = ''; setLabel('Unavailable', true); stock(null); return; } // this combination does not exist: never add a wrong item
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
