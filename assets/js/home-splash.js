(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!document.body.classList.contains("layout-home")) return;

  var layer = document.createElement("div");
  layer.className = "splash-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  var lastX = 0;
  var lastY = 0;
  var lastTime = 0;
  var active = 0;
  var maxActive = 18;

  function spawn(x, y) {
    if (active >= maxActive) return;

    var drop = document.createElement("span");
    drop.className = "splash-droplet";
    var size = 4 + Math.random() * 10;
    var dx = (Math.random() - 0.5) * 28;
    var dy = 8 + Math.random() * 22;

    drop.style.left = x + "px";
    drop.style.top = y + "px";
    drop.style.width = size + "px";
    drop.style.height = size + "px";
    drop.style.setProperty("--dx", dx + "px");
    drop.style.setProperty("--dy", dy + "px");

    layer.appendChild(drop);
    active += 1;

    drop.addEventListener("animationend", function () {
      drop.remove();
      active -= 1;
    });
  }

  document.addEventListener("mousemove", function (e) {
    var now = Date.now();
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (now - lastTime < 110 || dist < 18) return;

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
    spawn(e.clientX, e.clientY);
  });
})();
