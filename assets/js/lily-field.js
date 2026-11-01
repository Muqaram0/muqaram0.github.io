(function () {
  "use strict";

  var canvas = document.querySelector("[data-lily-field]");
  if (!canvas) return;

  var MODES = {
    hero: { speed: 0.13, density: 1.35, min: 800, max: 1900, horizon: 0.66, horizonNarrow: 0.72, zFar: 22, sky: true, camera: 1, motes: 16, red: true },
    strip: { speed: 0.05, density: 0.42, min: 260, max: 640, horizon: 0.86, horizonNarrow: 0.88, zFar: 12, sky: false, camera: 0.4, motes: 40, red: false },
    solo: { speed: 0, density: 0, min: 0, max: 0, horizon: 0.74, horizonNarrow: 0.76, zFar: 12, sky: true, camera: 0.3, motes: 30, red: false }
  };
  var mode = MODES[canvas.getAttribute("data-lily-field")] || MODES.hero;

  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FRAME_MS = 1000 / 40;
  var Z_NEAR = 0.6;
  var Z_FAR = mode.zFar;
  var TAU = Math.PI * 2;
  var dpr, w, h, horizon, groundK, clumps, items, motes, rafId, lastFrame = 0, lastTime = 0;
  var cam = { x: 0, y: 0 };
  var pointer = { x: -9999, y: -9999, vx: 0, active: false };
  var bursts = [];
  var stars = [], meteor = null, nextMeteor = 0;
  var start = performance.now();
  var glow = makeGlowSprite("255, 255, 255", "220, 230, 255");
  var redGlow = makeGlowSprite("255, 70, 90", "200, 20, 50");

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function smooth(edge0, edge1, v) {
    var k = Math.max(0, Math.min(1, (v - edge0) / (edge1 - edge0)));
    return k * k * (3 - 2 * k);
  }

  function makeGlowSprite(core, edge) {
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    var g = sprite.getContext("2d");
    var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(" + core + ", 1)");
    grad.addColorStop(0.18, "rgba(" + core + ", 0.55)");
    grad.addColorStop(0.5, "rgba(" + edge + ", 0.12)");
    grad.addColorStop(1, "rgba(" + edge + ", 0)");
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
      push: 0,
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

  function addClump(c) {
    clumps.push(c);
    for (var i = 0; i < c.members.length; i++) items.push(c.members[i]);
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

    horizon = h * (w < 700 ? mode.horizonNarrow : mode.horizon);
    groundK = (h - horizon) * 1.1;
    clumps = [];
    items = [];

    if (mode === MODES.solo) {
      var lone = newClump(1.1, 1);
      lone.u = 0;
      lone.spread = 0;
      lone.depth = 0;
      for (var s = 0; s < lone.members.length; s++) {
        var member = lone.members[s];
        member.dz = 0;
        member.du = member.kind ? rand(-0.06, 0.06) : 0;
        if (!member.kind) {
          member.tilt = 0.2;
          member.lean = 0.02;
          member.height = 1.25;
          member.twinkle = { rate: 0.7, phase: 0 };
        }
      }
      addClump(lone);
    } else {
      var target = Math.round(Math.max(mode.min, Math.min(mode.max, w * mode.density)));
      for (var total = 0; total < target;) {
        var n = 4 + Math.floor(Math.random() * 11);
        addClump(newClump(rand(Z_NEAR, Z_FAR), n));
        total += n;
      }
    }

    if (mode.red) {
      var red = newClump(rand(2.4, 3), 1);
      red.u = rand(0.35, 0.7) * (Math.random() < 0.5 ? -1 : 1);
      red.members[0].red = true;
      red.members[0].du = 0;
      red.members[0].dz = 0;
      red.members[0].height = 1.08;
      addClump(red);
    }

    if (mode.sky) buildSky();

    motes = [];
    var moteCount = Math.max(16, Math.round(w / mode.motes));
    for (var m = 0; m < moteCount; m++) motes.push(newMote(true));
  }

  function project(item) {
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
    item.alpha = mode === MODES.solo ? 0.95 : alpha;
    return alpha > 0.02;
  }

  function windAt(item, t) {
    var gust = 0.55 + 0.45 * Math.sin(t * 0.55 + item.z * 0.32 - item.sx * 0.002);
    return Math.sin(t * 0.95 + item.z * 0.55 - item.sx * 0.004) * gust + Math.sin(t * 2.1 + item.phase) * 0.1 + gust * 0.25;
  }

  function pointerPush(item, x, y, reach, dt) {
    var target = 0;
    if (pointer.active) {
      var dx = x - pointer.x;
      var dy = y - pointer.y;
      var influence = Math.exp(-(dx * dx + dy * dy) / (reach * reach));
      if (influence > 0.01) {
        target = (dx < 0 ? -1 : 1) * influence * 0.55 + pointer.vx * influence * 0.0008;
        target = Math.max(-0.8, Math.min(0.8, target));
      }
    }
    item.push = (item.push || 0) + (target - (item.push || 0)) * Math.min(1, dt * 5);
    return item.push;
  }

  function cubic(p0, p1, p2, p3, k) {
    var m = 1 - k;
    return m * m * m * p0 + 3 * m * m * k * p1 + 3 * m * k * k * p2 + k * k * k * p3;
  }

  function drawFlower(f, t, dt) {
    var s = f.s * f.height;
    var stemLen = 34 * s;
    var len = 14 * s;
    var x = f.sx;
    var gy = f.sy;
    if (x < -len * 3 || x > w + len * 3 || gy - stemLen - len > h) return;

    var alpha = f.red ? Math.max(f.alpha, 0.5) : f.alpha;
    var wind = windAt(f, t);
    var push = pointerPush(f, x, gy - stemLen * 0.7, Math.max(70, stemLen * 1.6), dt);
    var sway = (wind * 0.16 + f.lean + push) * stemLen;
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

    ctx.strokeStyle = f.red ? "rgba(232, 48, 70," + alpha + ")" : "rgba(244, 247, 252," + alpha + ")";
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

    var tips = new Path2D();
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
        tips.moveTo(tx + r, ty);
        tips.arc(tx, ty, r, 0, TAU);
      }
    }
    ctx.stroke();
    ctx.fillStyle = f.red ? "rgba(255, 92, 110," + Math.min(1, alpha * 1.15) + ")" : "rgba(255, 255, 255," + Math.min(1, alpha * 1.15) + ")";
    ctx.fill(tips);
    ctx.restore();

    var pulse = 0;
    if (f.red) pulse = 0.45 + 0.35 * Math.sin(t * 0.9);
    else if (f.twinkle) pulse = Math.pow(Math.max(0, Math.sin(t * f.twinkle.rate + f.twinkle.phase)), 3);
    if (pulse > 0.02) {
      var size = len * (f.red ? 4.6 : 3.4);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = pulse * Math.min(1, alpha * 1.1);
      ctx.drawImage(f.red ? redGlow : glow, hx - size / 2, hy - len * 0.5 - size / 2, size, size);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
  }

  function drawTuft(g, t, dt) {
    var s = g.s;
    var span = 30 * s * g.width;
    var tall = 34 * s;
    var x = g.sx;
    var gy = g.sy + 1;
    if (x < -span || x > w + span || gy - tall > h) return;

    var wind = windAt(g, t) * 0.12 + pointerPush(g, x, gy - tall * 0.3, Math.max(60, tall * 1.4), dt) * 0.6;
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

  function buildSky() {
    stars = [];
    var count = Math.round(w * horizon / 5200);
    for (var i = 0; i < count; i++) {
      stars.push({
        x: rand(0, w),
        y: rand(h * 0.04, horizon - h * 0.04),
        size: Math.random() < 0.12 ? rand(1.3, 1.9) : rand(0.5, 1.1),
        rate: rand(0.4, 1.8),
        phase: rand(0, TAU),
        base: rand(0.4, 0.85)
      });
    }
    meteor = null;
    nextMeteor = rand(3, 7);
  }

  function drawSky(t, dt) {
    ctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      var shine = st.base * (0.55 + 0.45 * Math.sin(t * st.rate + st.phase));
      if (st.size > 1.2) {
        var gs = st.size * 6;
        ctx.globalAlpha = shine * 0.5;
        ctx.drawImage(glow, st.x - gs / 2, st.y - gs / 2, gs, gs);
      }
      ctx.globalAlpha = shine;
      ctx.fillStyle = "#fff";
      ctx.fillRect(st.x - st.size / 2, st.y - st.size / 2, st.size, st.size);
    }

    if (dt) {
      nextMeteor -= dt;
      if (!meteor && nextMeteor <= 0) {
        var dir = Math.random() < 0.5 ? -1 : 1;
        var angle = rand(0.35, 0.6);
        var speed = rand(w * 0.55, w * 0.85);
        meteor = {
          x: dir < 0 ? rand(w * 0.45, w * 0.95) : rand(w * 0.05, w * 0.55),
          y: rand(h * 0.05, horizon * 0.35),
          vx: Math.cos(angle) * speed * dir,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: rand(0.7, 1.1),
          length: rand(90, 170)
        };
        nextMeteor = rand(7, 15);
      }
      if (meteor) {
        meteor.life += dt;
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        if (meteor.life >= meteor.max || meteor.y > horizon) meteor = null;
      }
    }

    if (meteor) {
      var fade = Math.sin(Math.PI * Math.min(1, meteor.life / meteor.max));
      var speedNow = Math.hypot(meteor.vx, meteor.vy);
      var tx = meteor.x - (meteor.vx / speedNow) * meteor.length;
      var ty = meteor.y - (meteor.vy / speedNow) * meteor.length;
      var trail = ctx.createLinearGradient(tx, ty, meteor.x, meteor.y);
      trail.addColorStop(0, "rgba(255, 255, 255, 0)");
      trail.addColorStop(1, "rgba(255, 255, 255," + 0.85 * fade + ")");
      ctx.globalAlpha = 1;
      ctx.strokeStyle = trail;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(meteor.x, meteor.y);
      ctx.stroke();
      ctx.globalAlpha = fade;
      ctx.drawImage(glow, meteor.x - 8, meteor.y - 8, 16, 16);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
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

    for (var b = bursts.length - 1; b >= 0; b--) {
      var p = bursts[b];
      p.life -= dt;
      if (p.life <= 0) {
        bursts.splice(b, 1);
        continue;
      }
      p.vx *= 1 - dt * 1.6;
      p.vy = p.vy * (1 - dt * 1.6) - 14 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      var fadeOut = p.life / p.max;
      var bs = p.size * 8;
      ctx.globalAlpha = fadeOut * 0.8;
      ctx.drawImage(glow, p.x - bs / 2, p.y - bs / 2, bs, bs);
      ctx.globalAlpha = fadeOut;
      ctx.fillStyle = "#fff";
      ctx.fillRect(p.x - p.size * 0.4, p.y - p.size * 0.4, p.size * 0.8, p.size * 0.8);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }


  function paint(t, dt) {
    if (dt && mode.speed) {
      for (var j = 0; j < clumps.length; j++) {
        var c = clumps[j];
        c.z -= mode.speed * dt;
        if (c.z + c.depth < Z_NEAR * 0.75) placeClump(c, Z_FAR + rand(0, 1.5));
      }
    }
    cam.x = (Math.sin(t * 0.11) * 0.12 + Math.sin(t * 0.043 + 1.3) * 0.08) * mode.camera;
    cam.y = Math.sin(t * 0.5) * 0.35 * mode.camera;
    pointer.vx *= 0.85;

    var visible = [];
    for (var i = 0; i < items.length; i++) {
      if (project(items[i])) visible.push(items[i]);
    }
    visible.sort(function (a, b) { return b.z - a.z; });

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (mode.sky) drawSky(t, dt);

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
      if (visible[v].kind) drawTuft(visible[v], t, dt);
      else drawFlower(visible[v], t, dt);
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

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    var rect = canvas.getBoundingClientRect();
    var nx = e.clientX - rect.left;
    if (pointer.active) pointer.vx = pointer.vx * 0.5 + (nx - pointer.x) * 20;
    pointer.x = nx;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  }, { passive: true });

  document.addEventListener("pointerleave", function () {
    pointer.active = false;
  });

  window.addEventListener("pointerdown", function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    for (var i = 0; i < 22 && bursts.length < 220; i++) {
      var a = rand(0, TAU);
      var v = rand(30, 140);
      var life = rand(1.4, 2.8);
      bursts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v * 0.7 - 30, size: rand(0.8, 2.2), life: life, max: life });
    }
  });

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
