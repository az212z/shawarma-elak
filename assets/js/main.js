/* ===== Shawarma Elak — interactions ===== */
(function () {
  'use strict';

  /* ---- Preloader (guaranteed hide) ---- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-done');
    setTimeout(function () { preloader.style.display = 'none'; }, 500);
  }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1200); // safety fallback

  /* ---- Year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-shrunk');
    else header.classList.remove('is-shrunk');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  var menuClose = document.getElementById('menuClose');

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function () { menu.hidden = true; }, 300);
  }
  if (burger) burger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menu) {
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (menu && menu.classList.contains('is-open')) closeMenu();
      if (lightbox && lightbox.classList.contains('is-open')) closeLightbox();
    }
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
  // safety: ensure everything visible after 2.5s no matter what
  setTimeout(function () {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }, 2500);

  /* ---- Lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCap = document.getElementById('lightboxCap');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, cap, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || cap || '';
    lightboxCap.textContent = cap || '';
    lightbox.hidden = false;
    requestAnimationFrame(function () { lightbox.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { lightbox.hidden = true; lightboxImg.src = ''; }, 300);
  }
  document.querySelectorAll('.gallery__item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      openLightbox(btn.getAttribute('data-src'), btn.getAttribute('data-cap'), img ? img.alt : '');
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---- Toast ---- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add('is-show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-show');
      setTimeout(function () { toast.hidden = true; }, 300);
    }, 4000);
  }

  /* ---- Order form ---- */
  var form = document.getElementById('orderForm');
  var WA_NUMBER = '966533324298';

  function setError(field, msg) {
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.add('is-invalid');
    var err = document.querySelector('.field__err[data-for="' + field.id + '"]');
    if (err) err.textContent = msg;
  }
  function clearError(field) {
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.remove('is-invalid');
    var err = document.querySelector('.field__err[data-for="' + field.id + '"]');
    if (err) err.textContent = '';
  }

  if (form) {
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      el.addEventListener('input', function () { clearError(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name;
      var phone = form.phone;
      var valid = true;

      if (!name.value.trim()) { setError(name, 'الرجاء كتابة الاسم'); valid = false; }
      var phoneVal = phone.value.replace(/\s+/g, '');
      if (!phoneVal) { setError(phone, 'الرجاء كتابة رقم الجوال'); valid = false; }
      else if (!/^[0-9+]{8,15}$/.test(phoneVal)) { setError(phone, 'رقم الجوال غير صحيح'); valid = false; }

      if (!valid) {
        var firstInvalid = form.querySelector('.field.is-invalid input, .field.is-invalid select');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = {
        name: name.value.trim(),
        phone: phoneVal,
        type: form.type.value,
        count: form.count.value,
        date: form.date.value,
        time: form.time.value,
        notes: form.notes.value.trim(),
        ts: Date.now()
      };

      // localStorage demo
      try {
        var list = JSON.parse(localStorage.getItem('elak_orders') || '[]');
        list.push(data);
        localStorage.setItem('elak_orders', JSON.stringify(list));
      } catch (err) { /* ignore */ }

      // Build WhatsApp message
      var lines = [
        'طلب جديد من موقع شاورما إيلاك',
        'الاسم: ' + data.name,
        'الجوال: ' + data.phone,
        'نوع الطلب: ' + data.type,
        'عدد الأشخاص: ' + data.count
      ];
      if (data.date) lines.push('التاريخ: ' + data.date);
      if (data.time) lines.push('الوقت: ' + data.time);
      if (data.notes) lines.push('الطلب/ملاحظات: ' + data.notes);

      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

      showToast('تم تجهيز طلبك! نفتح لك واتساب الآن…');
      setTimeout(function () { window.open(url, '_blank', 'noopener'); }, 700);
      form.reset();
    });
  }
})();
