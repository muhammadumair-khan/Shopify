(function () {
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
    if (price) price.innerHTML = v.price_html;
    if (barPrice) barPrice.innerHTML = v.price_html;
    try { var u = new URL(location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u); } catch (e) {}
  });

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
