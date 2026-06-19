(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var layer = document.querySelector(".gallery-float-layer");
  if (!layer) return;

  var emojis = ["🐠", "🐟", "🐶", "🌊"];
  var busy = false;

  function drift() {
    if (busy) return;
    busy = true;

    var el = document.createElement("span");
    el.className = "gallery-float-emoji";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    var top = 8 + Math.random() * 75;
    var duration = 9 + Math.random() * 8;
    var reverse = Math.random() > 0.75;

    el.style.top = top + "vh";
    el.style.animationDuration = duration + "s";
    if (reverse) {
      el.classList.add("gallery-float-emoji--reverse");
    }

    layer.appendChild(el);

    el.addEventListener("animationend", function () {
      el.remove();
      busy = false;
    });
  }

  drift();
  window.setInterval(drift, 4200);
})();
