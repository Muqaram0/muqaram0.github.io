(function () {
  "use strict";

  var canvas = document.querySelector("[data-lily-field]");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FRAME_MS = 1000 / 40;
  var Z_NEAR = 0.6;
  var Z_FAR = 22;
  var SPEED = 0.13;
  var TAU = Math.PI * 2;
  var dpr, w, h, horizon, groundK, clumps, items, motes, rafId, lastFrame = 0, lastTime = 0;
  var cam = { x: 0, y: 0 };
  var start = performance.now();
  var glow = makeGlowSprite();

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function smooth(edge0, edge1, v) {
    var k = Math.max(0, Math.min(1, (v - edge0) / (edge1 - edge0)));
    return k * k * (3 - 2 * k);
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

  function makeFlower(c) {
    var florets = [];
    var n = 5 + Math.floor(Math.random() * 3);
    var rot = rand(0, TAU);
    for (var i = 0; i < n; i++) {
      var stamens = [];
      var a = rot + (i / n) * TAU + rand(-0.3, 0.3);
      for (var k = 0; k < 3; k++) {
        stamens.push({ b: a + (k - 1) * rand(0.18, 0.32), reach: rand(0.8, 1.2), lift: rand(0.65, 1) });
      }
      florets.push({ a: a, out: rand(0.22, 0.34), stamens: stamens });
    }
    return {
      kind: 0,
      clump: c,
      du: rand(-1, 1) * c.spread,
      dz: rand(-1, 1) * c.depth,
      phase: rand(0, TAU),
      lean: rand(-0.07, 0.07),
      kink: rand(-0.06, 0.06),
      tilt: rand(-0.45, 0.45),
      height: rand(0.78, 1.18),
      florets: florets,
      twinkle: Math.random() < 0.12 ? { rate: rand(0.6, 1.6), phase: rand(0, TAU) } : null
    };
  }

  function makeTuft(c) {
    var blades = [];
    var n = 6 + Math.floor(Math.random() * 6);
    for (var i = 0; i < n; i++) {
      blades.push({ ox: rand(-0.5, 0.5), hgt: rand(0.25, 0.5), bend: rand(-0.35, 0.35), width: rand(0.025, 0.05) });
    }
    return {
      kind: 1,
      clump: c,
      du: rand(-1, 1) * c.spread * 0.9,
      dz: rand(-0.4, 1) * c.depth,
      width: rand(0.9, 1.6),
      phase: rand(0, TAU),
      blades: blades
    };
  }

  function placeClump(c, z) {
    c.u = rand(-1.15, 1.15);
    c.z = z;
    c.spread = rand(0.03, 0.09);
    c.depth = rand(0.15, 0.6);
    for (var i = 0; i < c.members.length; i++) {
      var m = c.members[i];
      var fresh = m.kind ? makeTuft(c) : makeFlower(c);
      for (var key in fresh) m[key] = fresh[key];
    }
  }

  function newClump(z, flowerCount) {
    var c = { members: [] };
    placeClump(c, z);
    for (var i = 0; i < flowerCount; i++) c.members.push(makeFlower(c));
    var tufts = 2 + Math.floor(Math.random() * 3);
    for (var j = 0; j < tufts; j++) c.members.push(makeTuft(c));
    placeClump(c, z);
    return c;
  }

  function newMote(anywhere) {
    return {
      x: rand(-10, w + 10),
      y: anywhere ? rand(horizon - h * 0.12, h) : h + rand(2, 20),
      vx: rand(2, 9),
      vy: rand(-7, -2),
      size: rand(0.8, 2.2),
      rate: rand(0.8, 2.4),
      phase: rand(0, TAU)
    };
  }

  function build() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    horizon = h * (w < 700 ? 0.72 : 0.66);
    groundK = (h - horizon) * 1.1;

    var target = Math.round(Math.max(800, Math.min(1900, w * 1.35)));
    clumps = [];
    items = [];
    for (var total = 0; total < target;) {
      var n = 4 + Math.floor(Math.random() * 11);
      var c = newClump(rand(Z_NEAR, Z_FAR), n);
      clumps.push(c);
      total += n;
      for (var i = 0; i < c.members.length; i++) items.push(c.members[i]);
    }

    motes = [];
    var moteCount = Math.max(24, Math.round(w / 16));
    for (var m = 0; m < moteCount; m++) motes.push(newMote(true));
  }

  function project(item, t) {
    var z = item.clump.z + item.dz;
    item.z = z;
    if (z < Z_NEAR * 0.75) return false;
    var u = item.clump.u + item.du;
    var parallax = 0.42 / z;
    item.sx = w / 2 + (u * (0.9 + parallax) - cam.x * parallax) * (w / 2);
    item.sy = horizon + groundK / z + cam.y * parallax * 10;
    item.s = Math.min(3.2, 2.4 / z);
    var distance = (z - Z_NEAR) / (Z_FAR - Z_NEAR);
    var alpha = 0.06 + 0.86 * Math.pow(1 - Math.min(1, distance), 1.6);
    alpha *= smooth(Z_FAR, Z_FAR - 3, z) * smooth(Z_NEAR * 0.75, Z_NEAR + 0.9, z);
    item.alpha = alpha;
    return alpha > 0.02;
  }

  function windAt(item, t) {
    var gust = 0.55 + 0.45 * Math.sin(t * 0.55 + item.z * 0.32 - item.sx * 0.002);
    return Math.sin(t * 0.95 + item.z * 0.55 - item.sx * 0.004) * gust + Math.sin(t * 2.1 + item.phase) * 0.1 + gust * 0.25;
  }

  function cubic(p0, p1, p2, p3, k) {
    var m = 1 - k;
    return m * m * m * p0 + 3 * m * m * k * p1 + 3 * m * k * k * p2 + k * k * k * p3;
  }

  function drawFlower(f, t) {
    var s = f.s * f.height;
    var stemLen = 34 * s;
    var len = 14 * s;
    var x = f.sx;
    var gy = f.sy;
    if (x < -len * 3 || x > w + len * 3 || gy - stemLen - len > h) return;

    var alpha = f.alpha;
    var wind = windAt(f, t);
    var sway = (wind * 0.16 + f.lean) * stemLen;
    var kink = f.kink * stemLen;
    var hx = x + sway;
    var hy = gy - stemLen + Math.abs(sway) * 0.15;

    var px = [x, x + kink, x + kink * 0.5 + sway * 0.45, hx];
    var py = [gy, gy - stemLen * 0.35, gy - stemLen * 0.72, hy];
    var segments = s > 0.6 ? 6 : s > 0.25 ? 3 : 1;
    var lastX = x;
    var lastY = gy;
    for (var i = 1; i <= segments; i++) {
      var k = i / segments;
      var nx = cubic(px[0], px[1], px[2], px[3], k);
      var ny = cubic(py[0], py[1], py[2], py[3], k);
      var fade = segments === 1 ? 0.4 : Math.pow((i - 0.5) / segments, 0.9);
      ctx.strokeStyle = "rgba(214, 222, 234," + (alpha * 0.72 * fade) + ")";
      ctx.lineWidth = Math.max(0.35, s * (1.15 - 0.6 * k));
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      lastX = nx;
      lastY = ny;
    }

    var tilt = f.tilt + wind * 0.28 + sway / stemLen * 0.6;
    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(tilt);
    ctx.scale(len, len);

    ctx.strokeStyle = "rgba(244, 247, 252," + alpha + ")";
    ctx.lineWidth = Math.max(0.4, 0.65 * s) / len;
    ctx.beginPath();

    if (s < 0.3) {
      for (var a = 0; a < 7; a++) {
        var ang = (a / 6) * Math.PI;
        ctx.moveTo(0, 0);
        ctx.lineTo(-Math.cos(ang) * 0.9, -Math.sin(ang) * 0.7 - 0.2);
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    var tips = s > 0.3 ? new Path2D() : null;
    var r = Math.max(0.5, 0.8 * s) / len;
    for (var j = 0; j < f.florets.length; j++) {
      var fl = f.florets[j];
      var dx = Math.cos(fl.a);
      var dy = Math.sin(fl.a) * 0.4;
      var fx = dx * fl.out;
      var fy = dy * fl.out - 0.08;

      ctx.moveTo(0, 0);
      ctx.lineTo(fx, fy);

      ctx.moveTo(fx, fy);
      ctx.quadraticCurveTo(fx + dx * 0.32, fy - 0.12, fx + dx * 0.36, fy + 0.12);
      ctx.moveTo(fx, fy);
      ctx.quadraticCurveTo(fx + dx * 0.2 + 0.08, fy - 0.1, fx + dx * 0.22 + 0.05, fy + 0.14);

      for (var m = 0; m < fl.stamens.length; m++) {
        var st = fl.stamens[m];
        var sx = Math.cos(st.b);
        var sy = Math.sin(st.b) * 0.35;
        var tx = fx + sx * 0.78 * st.reach;
        var ty = fy + sy * st.reach - 0.72 * st.reach * st.lift;
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(fx + sx * 0.7 * st.reach, fy + sy * 0.4 - 0.05, tx, ty);
        if (tips) {
          tips.moveTo(tx + r, ty);
          tips.arc(tx, ty, r, 0, TAU);
        }
      }
    }
    ctx.stroke();

    if (tips) {
      ctx.fillStyle = "rgba(255, 255, 255," + Math.min(1, alpha * 1.15) + ")";
      ctx.fill(tips);
    }
    ctx.restore();

    if (f.twinkle) {
      var pulse = Math.pow(Math.max(0, Math.sin(t * f.twinkle.rate + f.twinkle.phase)), 3);
      if (pulse > 0.02) {
        var size = len * 3.4;
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = pulse * Math.min(1, alpha * 1.1);
        ctx.drawImage(glow, hx - size / 2, hy - len * 0.5 - size / 2, size, size);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
    }
  }

  function drawTuft(g, t) {
    var s = g.s;
    var span = 30 * s * g.width;
    var tall = 34 * s;
    var x = g.sx;
    var gy = g.sy + 1;
    if (x < -span || x > w + span || gy - tall > h) return;

    var wind = windAt(g, t) * 0.12;
    var path = new Path2D();
    for (var i = 0; i < g.blades.length; i++) {
      var b = g.blades[i];
      var bx = x + b.ox * span;
      var bw = Math.max(0.6, b.width * tall);
      var bh = b.hgt * tall;
      var tipX = bx + (b.bend + wind) * bh;
      var tipY = gy - bh;
      path.moveTo(bx - bw, gy + 2);
      path.quadraticCurveTo(bx - bw * 0.5, gy - bh * 0.6, tipX, tipY);
      path.quadraticCurveTo(bx + bw * 0.6, gy - bh * 0.55, bx + bw, gy + 2);
      path.closePath();
    }
    var base = Math.min(1, g.alpha * 1.6 + 0.2);
    ctx.fillStyle = "rgba(3, 4, 6," + (0.94 * base) + ")";
    ctx.fill(path);
    ctx.strokeStyle = "rgba(200, 210, 225," + (g.alpha * 0.1) + ")";
    ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.stroke(path);

    var skirt = ctx.createLinearGradient(0, gy - tall * 0.18, 0, gy + tall * 0.12);
    skirt.addColorStop(0, "rgba(3, 4, 6, 0)");
    skirt.addColorStop(1, "rgba(3, 4, 6," + (0.9 * base) + ")");
    ctx.fillStyle = skirt;
    ctx.fillRect(x - span * 0.7, gy - tall * 0.18, span * 1.4, tall * 0.3);
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
      for (var j = 0; j < clumps.length; j++) {
        var c = clumps[j];
        c.z -= SPEED * dt;
        if (c.z + c.depth < Z_NEAR * 0.75) placeClump(c, Z_FAR + rand(0, 1.5));
      }
    }
    cam.x = Math.sin(t * 0.11) * 0.12 + Math.sin(t * 0.043 + 1.3) * 0.08;
    cam.y = Math.sin(t * 0.5) * 0.35;

    var visible = [];
    for (var i = 0; i < items.length; i++) {
      if (project(items[i], t)) visible.push(items[i]);
    }
    visible.sort(function (a, b) { return b.z - a.z; });

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    for (var v = 0; v < visible.length; v++) {
      if (visible[v].kind) drawTuft(visible[v], t);
      else drawFlower(visible[v], t);
    }
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
