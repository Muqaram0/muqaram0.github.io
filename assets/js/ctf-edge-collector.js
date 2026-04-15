(function () {
  "use strict";

  var canvas = document.querySelector("[data-ctf-edge-canvas]");
  if (!canvas) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  var pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.5,
    active: false,
    lastX: window.innerWidth * 0.5,
    lastY: window.innerHeight * 0.5,
    lastT: performance.now(),
    speed: 0,
    flowX: 0,
    flowY: 0
  };

  var root = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  var segments = [];
  var shards = [];
  var faces = [];
  var maxShards = 58;
  var maxFaces = 140;
  var faceMaxEdge = 118;
  var breakSpeedThreshold = 2.05; // px/ms
  var breakCooldown = 520;
  var breakUntil = 0;
  var breakFlashUntil = 0;
  var nextShardId = 1;
  var dpr = 1;
  var rafId = null;
  var frameCount = 0;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createSegment() {
    var drift = randomBetween(0.12, 0.32);
    var direction = Math.random() > 0.5 ? 1 : -1;
    return {
      x: randomBetween(8, window.innerWidth - 8),
      y: randomBetween(window.innerHeight * 0.18, window.innerHeight - 20),
      vx: direction * drift,
      vy: randomBetween(-0.06, 0.08),
      angle: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-0.007, 0.007),
      length: randomBetween(9, 26)
    };
  }

  function resetSegments() {
    segments = [];
    var target = Math.max(22, Math.min(54, Math.round(window.innerWidth / 56)));
    for (var i = 0; i < target; i += 1) {
      segments.push(createSegment());
    }
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
    canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    root.x = Math.min(window.innerWidth - 20, Math.max(20, pointer.x + 12));
    root.y = Math.min(window.innerHeight - 20, Math.max(20, pointer.y + 8));
    resetSegments();
  }

  function drawSegment(segment, alpha) {
    var dx = Math.cos(segment.angle) * segment.length * 0.5;
    var dy = Math.sin(segment.angle) * segment.length * 0.5;
    context.strokeStyle = "rgba(255, 255, 255, " + alpha + ")";
    context.lineWidth = 1.45;
    context.beginPath();
    context.moveTo(segment.x - dx, segment.y - dy);
    context.lineTo(segment.x + dx, segment.y + dy);
    context.stroke();
  }

  function collectSegment(segment, now) {
    if (shards.length >= maxShards) {
      shards.shift();
    }

    shards.push({
      id: nextShardId++,
      x: segment.x,
      y: segment.y,
      vx: randomBetween(-0.32, 0.32),
      vy: randomBetween(-0.28, 0.28),
      seed: randomBetween(0, Math.PI * 2),
      born: now
    });
  }

  function breakMesh(now) {
    shards = [];
    faces = [];
    breakUntil = now + breakCooldown;
    breakFlashUntil = now + 140;
  }

  function rebuildFaces() {
    faces = [];
    if (shards.length < 3) {
      return;
    }

    var idToIndex = {};
    for (var i = 0; i < shards.length; i += 1) {
      idToIndex[shards[i].id] = i;
    }

    var seen = {};
    var maxEdge2 = faceMaxEdge * faceMaxEdge;

    function addFace(a, b, c) {
      if (a === b || b === c || a === c) {
        return;
      }
      var ids = [a, b, c].sort(function (m, n) {
        return m - n;
      });
      var key = ids[0] + "_" + ids[1] + "_" + ids[2];
      if (seen[key]) {
        return;
      }
      seen[key] = true;
      faces.push({
        a: ids[0],
        b: ids[1],
        c: ids[2],
        seed: randomBetween(0, Math.PI * 2)
      });
    }

    for (var s = 0; s < shards.length; s += 1) {
      var origin = shards[s];
      var near = [];

      for (var t = 0; t < shards.length; t += 1) {
        if (s === t) {
          continue;
        }
        var other = shards[t];
        var dx = other.x - origin.x;
        var dy = other.y - origin.y;
        var d2 = dx * dx + dy * dy;
        if (d2 <= maxEdge2) {
          near.push({ id: other.id, d2: d2 });
        }
      }

      near.sort(function (p, q) {
        return p.d2 - q.d2;
      });

      if (near.length >= 2) {
        addFace(origin.id, near[0].id, near[1].id);
      }
      if (near.length >= 3 && s % 2 === 0) {
        addFace(origin.id, near[1].id, near[2].id);
      }
    }

    if (faces.length > maxFaces) {
      faces = faces.slice(0, maxFaces);
    }
  }

  function applyShardPhysics(time) {
    var len = shards.length;
    if (!len) {
      return;
    }

    var fx = new Array(len).fill(0);
    var fy = new Array(len).fill(0);
    var flowScale = pointer.active ? Math.min(1.28, pointer.speed * 0.52) : 0;

    for (var i = 0; i < len; i += 1) {
      var shard = shards[i];
      var dxr = root.x - shard.x;
      var dyr = root.y - shard.y;
      var dist = Math.sqrt(dxr * dxr + dyr * dyr);
      var attract = dist > 170 ? 0.0062 : 0.0022;

      fx[i] += dxr * attract;
      fy[i] += dyr * attract;

      var inv = 1 / Math.max(24, dist);
      var swirl = 0.68 + 0.42 * Math.sin(time * 0.0019 + shard.seed);
      fx[i] += (-dyr * inv) * 0.045 * swirl;
      fy[i] += (dxr * inv) * 0.045 * swirl;

      if (flowScale > 0) {
        var flowNoise = 0.56 + 0.44 * Math.sin(time * 0.0025 + shard.seed * 1.7);
        fx[i] += pointer.flowX * 0.016 * flowScale * flowNoise;
        fy[i] += pointer.flowY * 0.016 * flowScale * flowNoise;
      }

      fx[i] += Math.sin(time * 0.0031 + shard.seed) * 0.012;
      fy[i] += Math.cos(time * 0.0027 + shard.seed) * 0.012;
    }

    for (var a = 0; a < len; a += 1) {
      for (var b = a + 1; b < len; b += 1) {
        var sx = shards[b].x - shards[a].x;
        var sy = shards[b].y - shards[a].y;
        var d2 = sx * sx + sy * sy;
        if (d2 <= 1 || d2 > 70 * 70) {
          continue;
        }
        var d = Math.sqrt(d2);
        var nx = sx / d;
        var ny = sy / d;
        var repulse = (1 - d / 70) * 0.12;
        fx[a] -= nx * repulse;
        fy[a] -= ny * repulse;
        fx[b] += nx * repulse;
        fy[b] += ny * repulse;
      }
    }

    for (var u = 0; u < len; u += 1) {
      var p = shards[u];
      p.vx = (p.vx + fx[u]) * 0.9;
      p.vy = (p.vy + fy[u]) * 0.9;
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  function drawTriangle(p1, p2, p3, alpha, fillAlpha) {
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.closePath();
    context.fillStyle = "rgba(255, 255, 255, " + fillAlpha + ")";
    context.fill();
    context.strokeStyle = "rgba(255, 255, 255, " + alpha + ")";
    context.lineWidth = 1.08;
    context.stroke();
  }

  function animate(time) {
    frameCount += 1;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    var rootTargetX = pointer.active ? pointer.x + 12 : window.innerWidth * 0.84;
    var rootTargetY = pointer.active ? pointer.y + 8 : window.innerHeight * 0.16;
    rootTargetX = Math.min(window.innerWidth - 16, Math.max(16, rootTargetX));
    rootTargetY = Math.min(window.innerHeight - 16, Math.max(16, rootTargetY));
    var rootEase = pointer.active ? 0.34 : 0.08;
    root.x += (rootTargetX - root.x) * rootEase;
    root.y += (rootTargetY - root.y) * rootEase;

    context.shadowColor = "rgba(255, 255, 255, 0.36)";
    context.shadowBlur = 8;

    for (var i = segments.length - 1; i >= 0; i -= 1) {
      var segment = segments[i];
      segment.x += segment.vx;
      segment.y += segment.vy;
      segment.angle += segment.spin;

      if (segment.x < -24) {
        segment.x = window.innerWidth + 24;
      } else if (segment.x > window.innerWidth + 24) {
        segment.x = -24;
      }

      if (segment.y < window.innerHeight * 0.12) {
        segment.y = window.innerHeight * 0.12;
        segment.vy = Math.abs(segment.vy);
      } else if (segment.y > window.innerHeight - 12) {
        segment.y = window.innerHeight - 12;
        segment.vy = -Math.abs(segment.vy);
      }

      var dx = segment.x - pointer.x;
      var dy = segment.y - pointer.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      var shouldCollect = pointer.active && time > breakUntil && distance < 24;

      if (shouldCollect) {
        collectSegment(segment, time);
        segments.splice(i, 1);
        segments.push(createSegment());
      } else {
        drawSegment(segment, 0.44);
      }
    }

    applyShardPhysics(time);
    if (frameCount % 3 === 0) {
      rebuildFaces();
    }

    var shardMap = {};
    for (var s = 0; s < shards.length; s += 1) {
      shardMap[shards[s].id] = shards[s];
    }

    context.shadowColor = "rgba(255, 255, 255, 0.45)";
    context.shadowBlur = 10;

    for (var f = 0; f < faces.length; f += 1) {
      var face = faces[f];
      var p1 = shardMap[face.a];
      var p2 = shardMap[face.b];
      var p3 = shardMap[face.c];
      if (!p1 || !p2 || !p3) {
        continue;
      }

      var e1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      var e2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
      var e3 = Math.hypot(p1.x - p3.x, p1.y - p3.y);
      if (e1 > faceMaxEdge * 1.24 || e2 > faceMaxEdge * 1.24 || e3 > faceMaxEdge * 1.24) {
        continue;
      }

      var pulse = 0.78 + Math.sin(time * 0.002 + face.seed) * 0.22;
      var edgeAlpha = 0.2 + pulse * 0.42;
      var fillAlpha = 0.01 + pulse * 0.038;
      drawTriangle(p1, p2, p3, edgeAlpha, fillAlpha);
    }

    for (var q = 0; q < shards.length; q += 1) {
      var dot = shards[q];
      context.fillStyle = "rgba(255, 255, 255, 0.77)";
      context.beginPath();
      context.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
      context.fill();
    }

    if (shards.length > 0) {
      context.strokeStyle = "rgba(255, 255, 255, 0.72)";
      context.lineWidth = 1.2;
      context.beginPath();
      context.arc(root.x, root.y, 3.8, 0, Math.PI * 2);
      context.stroke();
    }

    if (time < breakFlashUntil) {
      context.strokeStyle = "rgba(255, 255, 255, 0.8)";
      context.lineWidth = 1.35;
      context.beginPath();
      context.moveTo(root.x - 9, root.y - 9);
      context.lineTo(root.x + 9, root.y + 9);
      context.moveTo(root.x + 9, root.y - 9);
      context.lineTo(root.x - 9, root.y + 9);
      context.stroke();
    }

    context.shadowBlur = 0;
    rafId = window.requestAnimationFrame(animate);
  }

  window.addEventListener("pointermove", function (event) {
    var now = performance.now();
    var dx = event.clientX - pointer.lastX;
    var dy = event.clientY - pointer.lastY;
    var dt = Math.max(1, now - pointer.lastT);
    var speed = Math.sqrt(dx * dx + dy * dy) / dt;

    pointer.speed = speed;
    pointer.flowX = pointer.flowX * 0.68 + (dx / dt) * 0.32;
    pointer.flowY = pointer.flowY * 0.68 + (dy / dt) * 0.32;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    pointer.lastT = now;

    if (shards.length > 0 && now > breakUntil && speed > breakSpeedThreshold) {
      breakMesh(now);
    }
  });

  window.addEventListener("pointerleave", function () {
    pointer.active = false;
    pointer.flowX *= 0.45;
    pointer.flowY *= 0.45;
  });

  window.addEventListener("blur", function () {
    pointer.active = false;
    pointer.flowX = 0;
    pointer.flowY = 0;
  });

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pagehide", function () {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
    }
  });

  resizeCanvas();
  rafId = window.requestAnimationFrame(animate);
})();
