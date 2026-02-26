// Artify BW - Main JavaScript

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile Menu ----
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var isOpen = false;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      isOpen = !isOpen;
      mobileMenu.classList.toggle('active', isOpen);
      var spans = menuBtn.querySelectorAll('span');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none';
      spans[1].style.opacity = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        isOpen = false;
        mobileMenu.classList.remove('active');
        var spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ---- Header Scroll Effect ----
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    });
  }

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 80;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---- Fade-in on Scroll ----
  var fadeElements = document.querySelectorAll('.fade-in');

  function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return rect.top <= (window.innerHeight * 0.85);
  }

  function checkElements() {
    fadeElements.forEach(function (el) {
      if (isInViewport(el)) {
        el.classList.add('visible');
      }
    });
  }

  checkElements();
  window.addEventListener('scroll', checkElements);

  // ---- Art Gallery Filter Pills ----
  var pills = document.querySelectorAll('.art-pill');
  var cards = document.querySelectorAll('.art-card');

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');

      var category = pill.dataset.category;
      cards.forEach(function (card) {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---- FAQ Toggles ----
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.parentElement.classList.toggle('active');
    });
  });

  // ---- Track Art Order Clicks ----
  document.querySelectorAll('.art-card__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = this.closest('.art-card');
      var styleName = card.querySelector('.art-card__title').textContent;
      if (typeof gtag === 'function') {
        gtag('event', 'art_order_click', { art_style: styleName, value: 50, currency: 'BWP' });
      }
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', { content_name: styleName, value: 50, currency: 'BWP' });
      }
    });
  });

});
