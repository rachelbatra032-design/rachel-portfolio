(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  (function initNameBoil() {
    var el = document.querySelector("[data-boil]");
    if (!el) return;

    var text = el.textContent.replace(/\s+/g, " ").trim();
    var marks = ["´", "`", "·", "¨"];
    el.setAttribute("aria-label", text);
    el.textContent = "";

    for (var i = 0; i < text.length; i++) {
      var span = document.createElement("span");
      var ch = text.charAt(i);
      span.className = ch === " " ? "char space" : "char";
      span.textContent = ch;
      if (ch !== " ") {
        span.style.animationDuration = (0.3 + (i % 5) * 0.07) + "s";
        span.style.animationDelay = (-i * 0.08) + "s";
        if (i % 2 === 0) {
          var tick = document.createElement("i");
          tick.className = "tick";
          tick.textContent = marks[i % marks.length];
          tick.style.animationDelay = (-i * 0.19) + "s";
          span.appendChild(tick);
        }
      }
      el.appendChild(span);
    }
  })();

  (function initPlayField() {
    var stage = document.getElementById("play-stage");
    var world = document.getElementById("play-world");
    if (!stage || !world) return;

    var posters = [
      { src: "images/play/tree-head.jpg", w: 260, h: 320, ox: 70, oy: 40 },
      { src: "images/play/dna-star.png", w: 240, h: 310, ox: 160, oy: 90 },
      { src: "images/play/ink.png", w: 320, h: 230, ox: 40, oy: 130 },
      { src: "images/play/blossoms.png", w: 250, h: 250, ox: 180, oy: 50 },
      { src: "images/play/house-head.jpg", w: 300, h: 240, ox: 90, oy: 160 }
    ];

    var cols = 3;
    var cell = 520;
    var periodX = cols * cell;
    var periodY = Math.ceil(posters.length / cols) * cell;
    var gx, gy, i, tile, col, row, node;

    for (gy = -1; gy <= 1; gy++) {
      for (gx = -1; gx <= 1; gx++) {
        for (i = 0; i < posters.length; i++) {
          tile = posters[i];
          col = i % cols;
          row = Math.floor(i / cols);
          node = document.createElement("div");
          node.className = "play-tile";
          node.style.left = gx * periodX + col * cell + tile.ox + "px";
          node.style.top = gy * periodY + row * cell + tile.oy + "px";
          node.style.width = tile.w + "px";
          node.style.height = tile.h + "px";
          node.innerHTML = "<img src=\"" + tile.src + "\" alt=\"\">";
          world.appendChild(node);
        }
      }
    }

    var x = periodX * 0.35;
    var y = periodY * 0.2;
    var dragging = false;
    var lastX = 0;
    var lastY = 0;

    function wrap() {
      x = ((x % periodX) + periodX) % periodX;
      y = ((y % periodY) + periodY) % periodY;
      world.style.transform = "translate(" + Math.round(-x) + "px," + Math.round(-y) + "px)";
    }

    wrap();

    stage.addEventListener("wheel", function (event) {
      event.preventDefault();
      x += event.deltaX;
      y += event.deltaY;
      wrap();
    }, { passive: false });

    stage.addEventListener("pointerdown", function (event) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      stage.classList.add("is-dragging");
      stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      x -= event.clientX - lastX;
      y -= event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      wrap();
    });

    function endDrag() {
      dragging = false;
      stage.classList.remove("is-dragging");
    }

    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
  })();

  var form = document.getElementById("unlock-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var input = form.querySelector("input[name='password']");
    var err = document.getElementById("unlock-error");
    var next = new URLSearchParams(window.location.search).get("next") || "pcm-agent";
    if (err) err.hidden = true;
    fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ password: input ? input.value : "" })
    }).then(function (res) {
      if (!res.ok) throw new Error("unlock failed");
      window.location.href = next + ".html";
    }).catch(function () {
      if (err) err.hidden = false;
    });
  });
})();
