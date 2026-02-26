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

  // ---- UTM Parameter Tracking ----
  // Capture UTM params from Meta Ads for attribution
  var urlParams = new URLSearchParams(window.location.search);
  var utmSource = urlParams.get('utm_source') || 'direct';
  var utmMedium = urlParams.get('utm_medium') || 'none';
  var utmCampaign = urlParams.get('utm_campaign') || 'none';
  var utmContent = urlParams.get('utm_content') || 'none';

  // Store UTM params in sessionStorage for cross-page tracking
  if (urlParams.get('utm_source')) {
    sessionStorage.setItem('artify_utm', JSON.stringify({
      source: utmSource, medium: utmMedium, campaign: utmCampaign, content: utmContent
    }));
  }

  // ---- Meta Pixel: ViewContent on Gallery Scroll ----
  var gallerySection = document.getElementById('gallery');
  var galleryViewed = false;

  if (gallerySection) {
    var galleryObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !galleryViewed) {
          galleryViewed = true;
          if (typeof fbq === 'function') {
            fbq('track', 'ViewContent', {
              content_name: 'Art Style Gallery',
              content_category: 'gallery',
              content_type: 'product_group'
            });
          }
          if (typeof gtag === 'function') {
            gtag('event', 'view_gallery', { event_category: 'engagement' });
          }
        }
      });
    }, { threshold: 0.3 });
    galleryObserver.observe(gallerySection);
  }

  // ---- Meta Pixel: Track Filter Pill Clicks ----
  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var category = pill.dataset.category;
      if (category !== 'all') {
        if (typeof fbq === 'function') {
          fbq('trackCustom', 'ArtStyleFilter', { style_category: category });
        }
        if (typeof gtag === 'function') {
          gtag('event', 'filter_style', { art_category: category });
        }
      }
    });
  });

  // ---- Track Art Order Clicks (Enhanced) ----
  document.querySelectorAll('.art-card__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = this.closest('.art-card');
      var styleName = card.querySelector('.art-card__title').textContent;
      var styleCategory = card.dataset.category;

      // Retrieve stored UTM params
      var storedUtm = JSON.parse(sessionStorage.getItem('artify_utm') || '{}');

      // Meta Pixel: Standard InitiateCheckout event (used by Meta Ads optimization)
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout', {
          content_name: styleName,
          content_category: styleCategory,
          content_type: 'product',
          value: 50,
          currency: 'BWP',
          num_items: 1
        });

        // Meta Pixel: Custom event for granular reporting
        fbq('trackCustom', 'ArtOrderClick', {
          art_style: styleName,
          art_category: styleCategory,
          value: 50,
          currency: 'BWP',
          utm_source: storedUtm.source || 'direct',
          utm_campaign: storedUtm.campaign || 'none'
        });
      }

      // GA4 event
      if (typeof gtag === 'function') {
        gtag('event', 'art_order_click', {
          art_style: styleName,
          art_category: styleCategory,
          value: 50,
          currency: 'BWP',
          utm_source: storedUtm.source || 'direct',
          utm_campaign: storedUtm.campaign || 'none'
        });
      }
    });
  });

  // ---- Track All WhatsApp Link Clicks (Header, CTA, Float) ----
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
    // Skip art card buttons (already tracked above)
    if (link.classList.contains('art-card__btn')) return;

    link.addEventListener('click', function () {
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', { content_name: 'WhatsApp General Inquiry' });
      }
      if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', { link_location: link.closest('section') ? link.closest('section').id : 'header' });
      }
    });
  });

});
