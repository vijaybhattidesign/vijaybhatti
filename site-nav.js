(function () {
  var MQ = window.matchMedia('(max-width: 768px)');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');
  var backdrop = document.getElementById('nav-backdrop');
  if (!nav || !toggle || !menu) return;

  var focusable = 'a[href], button:not([disabled])';

  function getFocusables() {
    return Array.prototype.slice.call(menu.querySelectorAll(focusable));
  }

  function isOpen() {
    return nav.classList.contains('nav-open');
  }

  function setOpen(open) {
    nav.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-menu-open', open);
    if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function closeMenu() {
    if (!isOpen()) return;
    setOpen(false);
    toggle.focus();
  }

  function openMenu() {
    setOpen(true);
    var items = getFocusables();
    if (items[0]) items[0].focus();
  }

  toggle.addEventListener('click', function () {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  document.addEventListener('keydown', function (e) {
    if (!isOpen() || !MQ.matches) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key !== 'Tab') return;

    var items = getFocusables();
    if (!items.length) return;

    var first = items[0];
    var last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a.nl')) closeMenu();
  });

  function onMqChange() {
    if (!MQ.matches) closeMenu();
  }

  if (typeof MQ.addEventListener === 'function') {
    MQ.addEventListener('change', onMqChange);
  } else if (typeof MQ.addListener === 'function') {
    MQ.addListener(onMqChange);
  }
})();
