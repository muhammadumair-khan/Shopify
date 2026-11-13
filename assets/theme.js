(function () {
  var t = document.querySelector('.menu-toggle'), n = document.querySelector('.nav');
  if (t && n) t.addEventListener('click', function () {
    var o = n.classList.toggle('open'); t.setAttribute('aria-expanded', o);
  });
  // Product page: keep variant id in sync with selected options
  var f = document.querySelector('[data-product-form]');
  if (f) {
    var data = JSON.parse(f.querySelector('[data-variants]').textContent);
    var idInput = f.querySelector('[name=id]'), btn = f.querySelector('[data-add]'),
        price = document.querySelector('[data-price]');
    f.addEventListener('change', function () {
      var chosen = Array.from(f.querySelectorAll('.opt')).map(function (g) {
        var c = g.querySelector('input:checked'); return c && c.value;
      });
      var v = data.find(function (x) { return x.options.every(function (o, i) { return o === chosen[i]; }); });
      if (!v) return;
      idInput.value = v.id;
      btn.disabled = !v.available;
      btn.textContent = v.available ? btn.dataset.labelAdd : btn.dataset.labelSold;
      if (price) price.innerHTML = v.price_html;
      var u = new URL(location.href); u.searchParams.set('variant', v.id); history.replaceState({}, '', u);
    });
  }
})();
