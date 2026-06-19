(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var gallery = document.querySelector(".photo-gallery");
  if (!gallery) return;

  var layer = document.createElement("div");
  layer.className = "gallery-float-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  var heart = "🫶🏻";
  var active = 0;
  var maxActive = 10;
  var canHover = window.matchMedia("(hover: hover)").matches;

  function release() {
    active = Math.max(0, active - 1);
  }

  function pop(x, y, options) {
    if (active >= maxActive) return;

    options = options || {};
    var el = document.createElement("span");
    el.className = "gallery-float-emoji";
    el.textContent = heart;

    var size = options.size || 0.9 + Math.random() * 0.45;
    el.style.fontSize = size + "rem";
    el.style.left = x + "px";
    el.style.top = y + "px";

    layer.appendChild(el);
    active += 1;

    var dx = options.dx !== undefined ? options.dx : (Math.random() - 0.5) * 90;
    var dy = options.dy !== undefined ? options.dy : -70 - Math.random() * 90;
    var duration = options.duration || 1400 + Math.random() * 900;

    var animation = el.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.4)", opacity: 0 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0.85, offset: 0.12 },
        { transform: "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px)) scale(0.85)", opacity: 0 },
      ],
      { duration: duration, easing: "ease-out", fill: "forwards" }
    );

    animation.onfinish = function () {
      el.remove();
      release();
    };

    window.setTimeout(function () {
      if (el.parentNode) {
        el.remove();
        release();
      }
    }, duration + 400);
  }

  function burst(clientX, clientY, count) {
    for (var i = 0; i < count; i += 1) {
      window.setTimeout(function () {
        pop(clientX + (Math.random() - 0.5) * 36, clientY + (Math.random() - 0.5) * 36, {
          dx: (Math.random() - 0.5) * 140,
          dy: -90 - Math.random() * 110,
          duration: 1600 + Math.random() * 800,
        });
      }, i * 70);
    }
  }

  gallery.addEventListener("contextmenu", function (event) {
    if (event.target.closest(".photo-gallery__item")) {
      event.preventDefault();
    }
  });

  gallery.addEventListener("dragstart", function (event) {
    if (event.target.closest(".photo-gallery__item")) {
      event.preventDefault();
    }
  });

  gallery.querySelectorAll(".photo-gallery__item").forEach(function (item) {
    if (canHover) {
      item.addEventListener("mouseenter", function () {
        if (item.dataset.floatCooldown) return;
        item.dataset.floatCooldown = "1";
        window.setTimeout(function () {
          delete item.dataset.floatCooldown;
        }, 700);

        var rect = item.getBoundingClientRect();
        pop(rect.left + rect.width * 0.5, rect.top + rect.height * 0.55, {
          dy: -55 - Math.random() * 45,
          duration: 1300,
        });
      });
    }

    item.addEventListener("click", function (event) {
      burst(event.clientX, event.clientY, 5);
    });
  });
})();
