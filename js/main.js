/* Navegación móvil y utilidades */
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menuMobile');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = !menu.hidden;
      menu.hidden = open;
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); });
    });
  }
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
