(function () {
  "use strict";

  var canvas = document.querySelector("[data-lily-field]");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr, w, h, horizon, flowers, rafId, start = performance.now();

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function build() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    horizon = h * (w < 700 ? 0.72 : 0.64);
    var count = Math.max(140, Math.min(460, Math.round((w * (h - horizon)) / 1500)));
    flowers = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.pow(Math.random(), 1.7);
      flowers.push({
        x: rand(-20, w + 20),
        y: horizon + 4 + depth * (h - horizon) * 0.92,
        depth: depth,
        scale: 0.2 + depth * 1.35,
        rot: rand(0, Math.PI * 2),
        phase: rand(0, Math.PI * 2),
        lean: rand(-0.08, 0.08)
      });
    }
    flowers.sort(function (a, b) { return a.y - b.y; });
  }

  function drawFlower(f, t) {
    var s = f.scale;
    var alpha = 0.14 + f.depth * 0.7;
    var stemLen = 34 * s;
    var wave = Math.sin(t * 0.55 + f.x * 0.006 - f.depth * 1.5) * 0.7 + Math.sin(t * 1.3 + f.phase) * 0.2;
    var sway = (wave * 0.09 + f.lean) * stemLen;

    var hx = f.x + sway;
    var hy = f.y - stemLen;

    ctx.strokeStyle = "rgba(226, 232, 240," + (alpha * 0.55) + ")";
    ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.quadraticCurveTo(f.x + sway * 0.2, f.y - stemLen * 0.55, hx, hy);
    ctx.stroke();

    var len = 14 * s;
    var tips = [];
    ctx.strokeStyle = "rgba(244, 247, 252," + alpha + ")";
    ctx.lineWidth = Math.max(0.45, 0.75 * s);
    ctx.beginPath();
    for (var k = 0; k < 12; k++) {
      var a = f.rot + (k / 12) * Math.PI * 2 + wave * 0.12;
      var dx = Math.cos(a);
      var dy = Math.sin(a) * 0.45;
      var reach = len * (k % 2 ? 0.82 : 1);
      var tx = hx + dx * reach + sway * 0.06;
      var ty = hy + dy * reach - reach * 0.85;

      ctx.moveTo(hx, hy);
      ctx.quadraticCurveTo(hx + dx * reach * 0.85, hy + dy * reach * 0.85 - reach * 0.05, tx, ty);
      tips.push(tx, ty);

      if (k % 2 === 0) {
        ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo(
          hx + dx * len * 0.35, hy + dy * len * 0.35 - len * 0.12,
          hx + dx * len * 0.45, hy + dy * len * 0.45 + len * 0.08
        );
      }
    }
    ctx.stroke();

    if (s > 0.3) {
      ctx.fillStyle = "rgba(255, 255, 255," + Math.min(1, alpha * 1.15) + ")";
      var r = Math.max(0.55, 0.85 * s);
      for (var j = 0; j < tips.length; j += 2) {
        ctx.beginPath();
        ctx.arc(tips[j], tips[j + 1], r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function paint(t) {
    ctx.clearRect(0, 0, w, h);

    var mist = ctx.createLinearGradient(0, horizon - h * 0.14, 0, horizon + h * 0.08);
    mist.addColorStop(0, "rgba(255, 255, 255, 0)");
    mist.addColorStop(0.65, "rgba(255, 255, 255, 0.055)");
    mist.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = mist;
    ctx.fillRect(0, horizon - h * 0.14, w, h * 0.22);

    for (var i = 0; i < flowers.length; i++) drawFlower(flowers[i], t);
  }

  function frame(now) {
    paint((now - start) / 1000);
    rafId = window.requestAnimationFrame(frame);
  }

  build();
  paint(0);

  var resizeTimer;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      build();
      paint((performance.now() - start) / 1000);
    }, 150);
  });

  if (reduceMotion) return;
  rafId = window.requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
    } else {
      rafId = window.requestAnimationFrame(frame);
    }
  });
})();
