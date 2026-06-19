(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var gallery = document.querySelector(".photo-gallery");
  if (!gallery) return;

  var layer = document.createElement("div");
  layer.className = "gallery-float-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  var emojis = ["🐠", "🐟", "🐶", "🌊"];
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
    el.textContent = options.emoji || emojis[Math.floor(Math.random() * emojis.length)];

    var size = options.size || 0.85 + Math.random() * 0.55;
    el.style.fontSize = size + "rem";
    el.style.left = x + "px";
    el.style.top = y + "px";

    layer.appendChild(el);
    active += 1;

    var dx = options.dx !== undefined ? options.dx : (Math.random() - 0.5) * 100;
    var dy = options.dy !== undefined ? options.dy : -70 - Math.random() * 90;
    var duration = options.duration || 1400 + Math.random() * 900;

    var animation = el.animate(
      [
        { transform: "translate(-50%, -50%) scale(0.4)", opacity: 0 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0.75, offset: 0.12 },
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

  function swimAcross() {
    if (active >= maxActive) return;

    var el = document.createElement("span");
    el.className = "gallery-float-emoji gallery-float-emoji--swim";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    var fromLeft = Math.random() > 0.25;
    var y = 70 + Math.random() * (window.innerHeight - 140);
    var startX = fromLeft ? -30 : window.innerWidth + 30;
    var endX = fromLeft ? window.innerWidth + 30 : -30;

    el.style.fontSize = 1 + Math.random() * 0.4 + "rem";
    el.style.left = startX + "px";
    el.style.top = y + "px";

    layer.appendChild(el);
    active += 1;

    var duration = 7000 + Math.random() * 5000;
    var wobble = (Math.random() - 0.5) * 24;

    var animation = el.animate(
      [
        { transform: "translate(-50%, -50%)", opacity: 0 },
        { transform: "translate(-50%, -50%)", opacity: 0.55, offset: 0.08 },
        { transform: "translate(calc(-50% + " + (endX - startX) + "px), calc(-50% + " + wobble + "px))", opacity: 0.55 },
        { transform: "translate(calc(-50% + " + (endX - startX) + "px), calc(-50% + " + wobble + "px))", opacity: 0 },
      ],
      { duration: duration, easing: "linear", fill: "forwards" }
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
          emoji: Math.random() > 0.35 ? "🐠" : "🐟",
          dy: -55 - Math.random() * 45,
          duration: 1300,
        });
      });
    }

    item.addEventListener("click", function (event) {
      burst(event.clientX, event.clientY, 5);
    });
  });

  window.setTimeout(swimAcross, 1200);
  window.setInterval(swimAcross, 7500);
})();
