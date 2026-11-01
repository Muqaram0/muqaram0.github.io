(function () {
  "use strict";

  var canvas = document.querySelector("[data-lily-field]");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FRAME_MS = 1000 / 40;
  var Z_NEAR = 0.55;
  var Z_FAR = 22;
  var SPEED = 0.3;
  var dpr, w, h, horizon, groundK, flowers, motes, rafId, lastFrame = 0, lastTime = 0;
  var start = performance.now();
  var glow = makeGlowSprite();

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeGlowSprite() {
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    var g = sprite.getContext("2d");
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.18, "rgba(255, 255, 255, 0.55)");
    grad.addColorStop(0.5, "rgba(220, 230, 255, 0.12)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return sprite;
  }

  function spawnFlower(f, z) {
    f.u = rand(-1.12, 1.12);
    f.z = z;
    f.rot = rand(0, Math.PI * 2);
    f.phase = rand(0, Math.PI * 2);
    f.lean = rand(-0.06, 0.06);
    f.height = rand(0.85, 1.15);
    f.twinkle = Math.random() < 0.14 ? { rate: rand(0.6, 1.6), phase: rand(0, Math.PI * 2) } : null;
    return f;
  }

  function newMote(anywhere) {
    return {
      x: rand(-10, w + 10),
      y: anywhere ? rand(horizon - h * 0.12, h) : h + rand(2, 20),
      vx: rand(2, 9),
      vy: rand(-7, -2),
      size: rand(0.8, 2.2),
      rate: rand(0.8, 2.4),
      phase: rand(0, Math.PI * 2)
    };
  }

  function build() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    horizon = h * (w < 700 ? 0.72 : 0.66);
    groundK = (h - horizon) * 1.1;

    var count = Math.round(Math.max(700, Math.min(1700, w * 1.2)));
    flowers = [];
    for (var i = 0; i < count; i++) {
      flowers.push(spawnFlower({}, rand(Z_NEAR, Z_FAR)));
    }

    motes = [];
    var moteCount = Math.max(24, Math.round(w / 16));
    for (var m = 0; m < moteCount; m++) motes.push(newMote(true));
  }

  function drawFlower(f, t) {
    var groundY = horizon + groundK / f.z;
    var x = w / 2 + f.u * (w / 2) * (0.9 + 0.42 / f.z);
    var s = Math.min(4.2, 2.4 / f.z) * f.height;
    var stemLen = 34 * s;
    var len = 14 * s;

    if (x < -len * 2 || x > w + len * 2 || groundY - stemLen - len > h) return;

    var distance = (f.z - Z_NEAR) / (Z_FAR - Z_NEAR);
    var alpha = 0.06 + 0.86 * Math.pow(1 - distance, 1.6);
    if (f.z > Z_FAR - 3) alpha *= (Z_FAR - f.z) / 3;
    if (alpha < 0.02) return;

    var gust = 0.55 + 0.45 * Math.sin(t * 0.7 + f.z * 0.32);
    var flutter = Math.sin(t * 1.15 + f.z * 0.55 - f.u * 2.2) * gust + Math.sin(t * 2.4 + f.phase) * 0.12;
    var sway = (flutter * 0.17 + gust * 0.05 + f.lean) * stemLen;

    var hx = x + sway;
    var hy = groundY - stemLen + Math.abs(sway) * 0.12;

    ctx.strokeStyle = "rgba(226, 232, 240," + (alpha * 0.5) + ")";
    ctx.lineWidth = Math.max(0.4, 0.85 * s);
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.quadraticCurveTo(x + sway * 0.15, groundY - stemLen * 0.55, hx, hy);
    ctx.stroke();

    var spin = flutter * 0.2;
    var trail = sway * 0.12;
    var tipsPath = s > 0.28 ? new Path2D() : null;
    var r = Math.max(0.5, 0.8 * s);

    ctx.strokeStyle = "rgba(244, 247, 252," + alpha + ")";
    ctx.lineWidth = Math.max(0.4, 0.7 * s);
    ctx.beginPath();
    for (var k = 0; k < 12; k++) {
      var a = f.rot + (k / 12) * Math.PI * 2 + spin;
      var dx = Math.cos(a);
      var dy = Math.sin(a) * 0.45;
      var reach = len * (k % 2 ? 0.82 : 1);
      var tx = hx + dx * reach + trail;
      var ty = hy + dy * reach - reach * 0.85;

      ctx.moveTo(hx, hy);
      ctx.quadraticCurveTo(hx + dx * reach * 0.85 + trail * 0.4, hy + dy * reach * 0.85 - reach * 0.05, tx, ty);

      if (k % 2 === 0) {
        ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo(
          hx + dx * len * 0.35, hy + dy * len * 0.35 - len * 0.12,
          hx + dx * len * 0.45 + trail * 0.3, hy + dy * len * 0.45 + len * 0.08
        );
      }

      if (tipsPath) {
        tipsPath.moveTo(tx + r, ty);
        tipsPath.arc(tx, ty, r, 0, Math.PI * 2);
      }
    }
    ctx.stroke();

    if (tipsPath) {
      ctx.fillStyle = "rgba(255, 255, 255," + Math.min(1, alpha * 1.15) + ")";
      ctx.fill(tipsPath);
    }

    if (f.twinkle) {
      var pulse = Math.pow(Math.max(0, Math.sin(t * f.twinkle.rate + f.twinkle.phase)), 3);
      if (pulse > 0.02) {
        var size = len * 3.4;
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = pulse * Math.min(1, alpha * 1.1);
        ctx.drawImage(glow, hx + trail * 0.5 - size / 2, hy - len * 0.5 - size / 2, size, size);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
    }
  }

  function drawMotes(t, dt) {
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      if (dt) {
        m.x += (m.vx + Math.sin(t * 1.1 - m.x * 0.01) * 8) * dt;
        m.y += (m.vy + Math.sin(t * 0.9 + m.phase) * 3) * dt;
        if (m.y < horizon - h * 0.2 || m.x > w + 20) motes[i] = m = newMote(false);
      }
      var shine = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(t * m.rate + m.phase), 2);
      var size = m.size * 7;
      ctx.globalAlpha = shine * 0.7;
      ctx.drawImage(glow, m.x - size / 2, m.y - size / 2, size, size);
      ctx.globalAlpha = shine;
      ctx.fillStyle = "#fff";
      ctx.fillRect(m.x - m.size * 0.4, m.y - m.size * 0.4, m.size * 0.8, m.size * 0.8);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function paint(t, dt) {
    if (dt) {
      for (var j = 0; j < flowers.length; j++) {
        var f = flowers[j];
        f.z -= SPEED * dt;
        if (f.z < Z_NEAR) spawnFlower(f, Z_FAR + rand(0, 1));
      }
    }
    flowers.sort(function (a, b) { return b.z - a.z; });

    ctx.clearRect(0, 0, w, h);

    var ground = ctx.createLinearGradient(0, horizon, 0, h);
    ground.addColorStop(0, "rgba(255, 255, 255, 0.04)");
    ground.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = ground;
    ctx.fillRect(0, horizon, w, h - horizon);

    var mist = ctx.createLinearGradient(0, horizon - h * 0.12, 0, horizon + h * 0.06);
    mist.addColorStop(0, "rgba(255, 255, 255, 0)");
    mist.addColorStop(0.7, "rgba(255, 255, 255, 0.07)");
    mist.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = mist;
    ctx.fillRect(0, horizon - h * 0.12, w, h * 0.18);

    for (var i = 0; i < flowers.length; i++) drawFlower(flowers[i], t);
    drawMotes(t, dt);
  }

  function frame(now) {
    rafId = window.requestAnimationFrame(frame);
    if (now - lastFrame < FRAME_MS) return;
    lastFrame = now;
    var t = (now - start) / 1000;
    var dt = lastTime ? Math.min(0.1, t - lastTime) : 0;
    lastTime = t;
    paint(t, dt);
  }

  build();
  paint(0, 0);

  var resizeTimer;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      build();
      paint((performance.now() - start) / 1000, 0);
    }, 150);
  });

  if (reduceMotion) return;
  rafId = window.requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      window.cancelAnimationFrame(rafId);
    } else {
      lastTime = 0;
      rafId = window.requestAnimationFrame(frame);
    }
  });
})();
