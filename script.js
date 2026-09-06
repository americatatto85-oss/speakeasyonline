/* ============ SPEAKEASY — language, menu, registration ============ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '213781610793';
  var LANG_KEY = 'speakeasy-lang';
  var currentLang = 'ar';

  /* ---------- Bilingual UI strings (form validation & messages) ---------- */
  var STR = {
    ar: {
      required: 'هذا الحقل مطلوب.',
      badName: 'يرجى إدخال الاسم الكامل (كلمتين على الأقل).',
      badPhone: 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456).',
      badEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
      mustAgree: 'يجب الموافقة على شروط التسجيل أولًا.',
      waHeader: 'New SPEAKEASY Registration — تسجيل جديد في SPEAKEASY',
      fSerial: 'Serial No / الرقم التسلسلي',
      fName: 'Full Name / الاسم الكامل',
      fPhone: 'Phone / الهاتف',
      fAge: 'Age / العمر',
      fEmail: 'Email / البريد الإلكتروني',
      fWilaya: 'Wilaya / الولاية',
      fLevel: 'English Level / المستوى',
      fPayment: 'Payment Method / طريقة الدفع',
      waThanks: 'Thank you for registering with SPEAKEASY — شكرًا لتسجيلكم في SPEAKEASY.'
    },
    en: {
      required: 'This field is required.',
      badName: 'Please enter your full name (at least two words).',
      badPhone: 'Please enter a valid Algerian phone number (e.g. 0550123456).',
      badEmail: 'Please enter a valid email address.',
      mustAgree: 'You must agree to the registration conditions first.',
      waHeader: 'New SPEAKEASY Registration',
      fSerial: 'Serial No',
      fName: 'Full Name',
      fPhone: 'Phone',
      fAge: 'Age',
      fEmail: 'Email',
      fWilaya: 'Wilaya',
      fLevel: 'English Level',
      fPayment: 'Payment Method',
      waThanks: 'Thank you for registering with SPEAKEASY.'
    }
  };

  /* ---------- Language switcher ---------- */
  function setLang(lang) {
    currentLang = (lang === 'en') ? 'en' : 'ar';

    document.documentElement.lang = currentLang;
    document.documentElement.dir = (currentLang === 'ar') ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-' + currentLang + ']').forEach(function (el) {
      var val = el.getAttribute('data-' + currentLang);
      if (val !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Placeholders use dedicated attributes
    document.querySelectorAll('[data-' + currentLang + '-ph]').forEach(function (el) {
      el.placeholder = el.getAttribute('data-' + currentLang + '-ph');
    });

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === currentLang);
    });

    // Keep the selected wilaya/option visible after relabeling (no-op safeguard)
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) { /* private mode */ }
  }

  document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang-btn')); });
  });

  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  setLang(saved === 'en' ? 'en' : 'ar');

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Serial registration number (starts at 1, increments per registration) ---------- */
  var SERIAL_KEY = 'speakeasy-serial';
  function getSerial() {
    try {
      var n = parseInt(localStorage.getItem(SERIAL_KEY) || '1', 10);
      if (isNaN(n) || n < 1) n = 1;
      return n;
    } catch (e) { return 1; }
  }
  function bumpSerial() {
    try { localStorage.setItem(SERIAL_KEY, String(getSerial() + 1)); } catch (e) { /* private mode */ }
  }
  function refreshSerialDisplay() {
    var el = document.getElementById('serialNum');
    if (el) el.textContent = getSerial();
  }
  refreshSerialDisplay();

  /* ---------- Registration form ---------- */
  var form = document.getElementById('regForm');
  if (!form) return;

  function setError(name, msg) {
    var err = form.querySelector('[data-error-for="' + name + '"]');
    var input = form.querySelector('[name="' + name + '"]');
    if (err) {
      err.textContent = msg || '';
      err.classList.toggle('show', !!msg);
    }
    if (input && (input.tagName === 'INPUT' || input.tagName === 'SELECT')) {
      input.classList.toggle('invalid', !!msg);
    }
  }

  function validPhone(v) {
    var digits = v.replace(/[^\d]/g, '');
    // Accept: 05/06/07XXXXXXXX (10 digits), 213XXXXXXXXX, or 9–12 digit numbers
    if (/^0[567]\d{8}$/.test(digits)) return true;
    if (/^213[567]\d{8}$/.test(digits)) return true;
    return digits.length >= 9 && digits.length <= 12;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  ['fullName', 'phone', 'email'].forEach(function (n) {
    var i = form.querySelector('[name="' + n + '"]');
    if (i) i.addEventListener('input', function () { setError(n, ''); });
  });
  ['age', 'level', 'wilaya', 'payment'].forEach(function (n) {
    var s = form.querySelector('[name="' + n + '"]');
    if (s) s.addEventListener('change', function () { setError(n, ''); });
  });
  var agreeBox = form.querySelector('[name="agree"]');
  if (agreeBox) agreeBox.addEventListener('change', function () { setError('agree', ''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = STR[currentLang];
    var ok = true;

    var fullName = form.fullName.value.trim();
    var phone = form.phone.value.trim();
    var age = form.age.value;
    var email = form.email.value.trim();
    var wilaya = form.wilaya.value;
    var level = form.level.value;
    var payment = form.payment.value;
    var serial = getSerial();

    if (!fullName) { setError('fullName', t.required); ok = false; }
    else if (fullName.split(/\s+/).length < 2) { setError('fullName', t.badName); ok = false; }
    else setError('fullName', '');

    if (!phone) { setError('phone', t.required); ok = false; }
    else if (!validPhone(phone)) { setError('phone', t.badPhone); ok = false; }
    else setError('phone', '');

    if (!age) { setError('age', t.required); ok = false; } else setError('age', '');
    if (!level) { setError('level', t.required); ok = false; } else setError('level', '');

    if (!email) { setError('email', t.required); ok = false; }
    else if (!validEmail(email)) { setError('email', t.badEmail); ok = false; }
    else setError('email', '');

    if (!wilaya) { setError('wilaya', t.required); ok = false; } else setError('wilaya', '');

    if (!payment) { setError('payment', t.required); ok = false; } else setError('payment', '');

    if (!agreeBox.checked) { setError('agree', t.mustAgree); ok = false; } else setError('agree', '');

    if (!ok) {
      var firstBad = form.querySelector('.invalid');
      if (firstBad && firstBad.focus) firstBad.focus();
      return;
    }

    var lines = [
      t.waHeader,
      '--------------------------',
      t.fSerial + ': ' + serial,
      t.fName + ': ' + fullName,
      t.fPhone + ': ' + phone,
      t.fAge + ': ' + age,
      t.fEmail + ': ' + email,
      t.fWilaya + ': ' + wilaya,
      t.fLevel + ': ' + level,
      t.fPayment + ': ' + payment,
      '--------------------------',
      t.waThanks
    ];
    var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

    var fallback = document.getElementById('waFallback');
    if (fallback) fallback.href = waUrl;

    window.open(waUrl, '_blank', 'noopener');

    var success = document.getElementById('formSuccess');
    if (success) {
      var ss = document.getElementById('successSerial');
      if (ss) ss.textContent = serial;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    bumpSerial();
    refreshSerialDisplay();
    form.reset();
  });
})();
