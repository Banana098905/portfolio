(function() {
  'use strict';

  function initSecretEntry() {
    // 1. Find the .logo element (or #sz-entry)
    var logo = document.getElementById('sz-entry') || document.querySelector('.logo');
    if (!logo) return;

    var overlay = document.getElementById('sz-noise-overlay');
    var isNavigating = false;
    var ambientTimer = null;

    var isReducedMotion = function() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // 2. Make it keyboard accessible
    logo.setAttribute('tabindex', '0');
    logo.setAttribute('role', 'button');
    logo.setAttribute('aria-label', 'STUDIO ZERO を開く');

    // 3. Set up ambient glitch
    function triggerGlitch(duration, callback) {
      if (isNavigating) return;
      logo.classList.add('sz-glitch-active');
      setTimeout(function() {
        logo.classList.remove('sz-glitch-active');
        if (typeof callback === 'function') {
          callback();
        }
      }, duration);
    }

    function scheduleAmbientGlitch() {
      if (isReducedMotion() || isNavigating) return;

      // Random interval between 8 and 20 seconds (8000ms - 20000ms)
      var delay = Math.floor(Math.random() * (20000 - 8000 + 1)) + 8000;

      ambientTimer = setTimeout(function() {
        if (isReducedMotion() || isNavigating) return;

        // Glitch duration 150-300ms
        var dur1 = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
        var isDoubleGlitch = Math.random() < 0.3; // 30% chance

        triggerGlitch(dur1, function() {
          if (isDoubleGlitch && !isNavigating) {
            setTimeout(function() {
              if (isReducedMotion() || isNavigating) return;
              var dur2 = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
              triggerGlitch(dur2, function() {
                scheduleAmbientGlitch();
              });
            }, 100); // 100ms pause
          } else {
            scheduleAmbientGlitch();
          }
        });
      }, delay);
    }

    if (!isReducedMotion()) {
      scheduleAmbientGlitch();
    }

    // 4. Click / Enter / Space entry transition handler
    function triggerEntry(e) {
      if (isNavigating) return;
      isNavigating = true;

      if (ambientTimer) {
        clearTimeout(ambientTimer);
      }
      logo.classList.remove('sz-glitch-active');

      // If reduced motion is requested, navigate immediately without animation/overlay
      if (isReducedMotion()) {
        window.location.href = 'studio-zero.html';
        return;
      }

      if (overlay) {
        var rect = logo.getBoundingClientRect();
        var originX = (rect.left + rect.width / 2) + 'px';
        var originY = (rect.top + rect.height / 2) + 'px';

        overlay.style.setProperty('--sz-origin-x', originX);
        overlay.style.setProperty('--sz-origin-y', originY);
        overlay.classList.add('sz-noise-active');
      }

      setTimeout(function() {
        window.location.href = 'studio-zero.html';
      }, 1200);
    }

    logo.addEventListener('click', function(e) {
      triggerEntry(e);
    });

    logo.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        triggerEntry(e);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecretEntry);
  } else {
    initSecretEntry();
  }
})();
