/*
 * Moving things drawn on a full-screen canvas: petals, confetti, balloons,
 * hearts, sparkles, bubbles. Pauses when the tab is hidden and turns itself
 * off for people who ask their phone for reduced motion.
 */
window.InviteEffects = (function () {
  function R(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  var TAU = Math.PI * 2;

  var KINDS = {
    petals: {
      count: 22,
      colors: ["#F28C28", "#F7C548", "#E8552E", "#FF9F43", "#C8323C"],
      spawn: function (p, w, h, first) { p.x = R(0, w); p.y = first ? R(-h, h) : R(-60, -20); p.s = R(6, 12); p.vy = R(0.5, 1.2); p.vx = R(-0.3, 0.3); p.r = R(0, TAU); p.vr = R(-0.03, 0.03); p.ph = R(0, TAU); },
      step: function (p) { p.ph += 0.02; p.x += p.vx + Math.sin(p.ph) * 0.6; p.y += p.vy; p.r += p.vr; },
      dead: function (p, w, h) { return p.y > h + 30; },
      draw: function (c, p) {
        c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c;
        c.beginPath(); c.moveTo(0, -p.s); c.quadraticCurveTo(p.s * 0.8, 0, 0, p.s); c.quadraticCurveTo(-p.s * 0.8, 0, 0, -p.s); c.fill();
        c.restore();
      }
    },
    confetti: {
      count: 40,
      colors: ["#FF5A5F", "#FFC93C", "#3EC1D3", "#7BD389", "#B983FF", "#FF8FAB"],
      spawn: function (p, w, h, first) { p.x = R(0, w); p.y = first ? R(-h, h) : R(-40, -10); p.w = R(6, 10); p.h = R(10, 16); p.vy = R(1, 2.2); p.vx = R(-0.6, 0.6); p.r = R(0, TAU); p.vr = R(-0.08, 0.08); p.ph = R(0, TAU); },
      step: function (p) { p.ph += 0.08; p.x += p.vx; p.y += p.vy; p.r += p.vr; },
      dead: function (p, w, h) { return p.y > h + 20; },
      draw: function (c, p) {
        c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.scale(1, Math.cos(p.ph));
        c.fillStyle = p.c; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore();
      }
    },
    balloons: {
      count: 5,
      colors: ["#FF5A5F", "#FFC93C", "#3EC1D3", "#7BD389", "#B983FF", "#FF8FAB"],
      spawn: function (p, w, h, first) { p.x = R(0, w); p.y = first ? R(0, h * 1.4) : h + R(60, 200); p.s = R(18, 30); p.vy = R(0.5, 1.1); p.ph = R(0, TAU); },
      step: function (p) { p.ph += 0.015; p.y -= p.vy; p.x += Math.sin(p.ph) * 0.4; },
      dead: function (p) { return p.y < -p.s * 5; },
      draw: function (c, p) {
        var s = p.s;
        c.save(); c.translate(p.x, p.y); c.globalAlpha = 0.72;
        c.strokeStyle = "rgba(255,255,255,.55)"; c.lineWidth = 1;
        c.beginPath(); c.moveTo(0, s * 1.25); c.bezierCurveTo(s * 0.4, s * 2, -s * 0.4, s * 2.6, 0, s * 3.4); c.stroke();
        c.fillStyle = p.c; c.beginPath(); c.ellipse(0, 0, s, s * 1.2, 0, 0, TAU); c.fill();
        c.beginPath(); c.moveTo(-s * 0.18, s * 1.32); c.lineTo(s * 0.18, s * 1.32); c.lineTo(0, s * 1.15); c.fill();
        c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.ellipse(-s * 0.35, -s * 0.45, s * 0.18, s * 0.32, -0.5, 0, TAU); c.fill();
        c.restore();
      }
    },
    hearts: {
      count: 14,
      colors: ["#FF6B8B", "#FF8FAB", "#E63B6F", "#FFB3C6"],
      spawn: function (p, w, h, first) { p.x = R(0, w); p.y = first ? R(0, h) : h + R(20, 80); p.s = R(7, 14); p.vy = R(0.4, 0.9); p.ph = R(0, TAU); p.a = R(0.5, 0.9); },
      step: function (p) { p.ph += 0.02; p.y -= p.vy; p.x += Math.sin(p.ph) * 0.5; },
      dead: function (p) { return p.y < -30; },
      draw: function (c, p) {
        var s = p.s; c.save(); c.translate(p.x, p.y); c.globalAlpha = p.a; c.fillStyle = p.c;
        c.beginPath(); c.moveTo(0, s * 0.35);
        c.bezierCurveTo(-s, -s * 0.4, -s * 0.5, -s * 1.1, 0, -s * 0.5);
        c.bezierCurveTo(s * 0.5, -s * 1.1, s, -s * 0.4, 0, s * 0.35); c.fill(); c.restore();
      }
    },
    sparkles: {
      count: 26,
      colors: ["#FFE7A0", "#FFFFFF", "#F6DFA0"],
      spawn: function (p, w, h) { p.x = R(0, w); p.y = R(0, h); p.s = R(3, 7); p.t = 0; p.life = R(90, 200); },
      step: function (p) { p.t++; },
      dead: function (p) { return p.t > p.life; },
      draw: function (c, p) {
        var k = Math.sin((p.t / p.life) * Math.PI), s = p.s * (0.6 + k * 0.6);
        c.save(); c.translate(p.x, p.y); c.globalAlpha = k * 0.9; c.fillStyle = p.c;
        c.beginPath(); c.moveTo(0, -s * 2); c.quadraticCurveTo(0, 0, s * 2, 0); c.quadraticCurveTo(0, 0, 0, s * 2); c.quadraticCurveTo(0, 0, -s * 2, 0); c.quadraticCurveTo(0, 0, 0, -s * 2); c.fill();
        c.restore();
      }
    },
    feathers: {
      count: 14,
      colors: ["#2AAE9A", "#2D84B8", "#1E647F", "#D5B65C"],
      spawn: function (p, w, h, first) { p.x = R(0, w); p.y = first ? R(0, h) : h + R(20, 100); p.s = R(10, 20); p.vy = R(.35, .75); p.vx = R(-.35, .35); p.r = R(-.7, .7); p.vr = R(-.012, .012); p.ph = R(0, TAU); },
      step: function (p) { p.ph += .018; p.x += p.vx + Math.sin(p.ph) * .35; p.y -= p.vy; p.r += p.vr; },
      dead: function (p) { return p.y < -60; },
      draw: function (c, p) {
        c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.globalAlpha = .78;
        c.fillStyle = p.c; c.beginPath(); c.moveTo(0, -p.s * 1.8); c.quadraticCurveTo(p.s * 1.5, -p.s * .2, 0, p.s * 2); c.quadraticCurveTo(-p.s * 1.2, 0, 0, -p.s * 1.8); c.fill();
        c.strokeStyle = "rgba(255,238,175,.75)"; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -p.s * 1.5); c.lineTo(0, p.s * 1.6); c.stroke();
        c.restore();
      }
    },
    embers: {
      count: 24,
      colors: ["#FFB347", "#FFD36A", "#F47B38", "#FFF0B2"],
      spawn: function (p, w, h, first) { p.x = R(0, w); p.y = first ? R(0, h) : h + R(5, 40); p.s = R(1.5, 4); p.vy = R(.45, 1.3); p.vx = R(-.35, .35); p.ph = R(0, TAU); p.life = R(90, 190); p.t = 0; },
      step: function (p) { p.t++; p.ph += .05; p.x += p.vx + Math.sin(p.ph) * .3; p.y -= p.vy; },
      dead: function (p) { return p.t > p.life || p.y < -30; },
      draw: function (c, p) {
        var a = Math.sin(Math.PI * p.t / p.life);
        c.save(); c.globalAlpha = a * .9; c.shadowBlur = 14; c.shadowColor = p.c; c.fillStyle = p.c;
        c.beginPath(); c.arc(p.x, p.y, p.s * (.6 + a), 0, TAU); c.fill(); c.restore();
      }
    },
    bubbles: {
      count: 16,
      colors: ["rgba(255,255,255,.7)"],
      spawn: function (p, w, h, first) { p.x = R(0, w); p.y = first ? R(0, h) : h + R(10, 60); p.s = R(6, 20); p.vy = R(0.3, 0.8); p.ph = R(0, TAU); },
      step: function (p) { p.ph += 0.02; p.y -= p.vy; p.x += Math.sin(p.ph) * 0.4; },
      dead: function (p) { return p.y < -40; },
      draw: function (c, p) {
        c.save(); c.strokeStyle = p.c; c.lineWidth = 1.2; c.globalAlpha = 0.7;
        c.beginPath(); c.arc(p.x, p.y, p.s, 0, TAU); c.stroke();
        c.fillStyle = "rgba(255,255,255,.35)"; c.beginPath(); c.arc(p.x - p.s * 0.35, p.y - p.s * 0.35, p.s * 0.22, 0, TAU); c.fill();
        c.restore();
      }
    }
  };

  function start(canvas, kinds) {
    if (!canvas || !kinds || !kinds.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ctx = canvas.getContext("2d"), w = 0, h = 0, parts = [], running = true;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function build() {
      parts = [];
      var scale = Math.max(0.45, Math.min(1, w / 1200));
      kinds.forEach(function (k) {
        var K = KINDS[k]; if (!K) return;
        var n = Math.round(K.count * scale / Math.max(1, kinds.length * 0.75));
        for (var i = 0; i < n; i++) { var p = { k: K, c: pick(K.colors) }; K.spawn(p, w, h, true); parts.push(p); }
      });
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i], K = p.k;
        K.step(p);
        if (K.dead(p, w, h)) { p.c = pick(K.colors); K.spawn(p, w, h, false); }
        K.draw(ctx, p);
      }
      requestAnimationFrame(frame);
    }
    size(); build();
    window.addEventListener("resize", function () { var ow = w; size(); if (Math.abs(ow - w) > 80) build(); });
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden; if (running) requestAnimationFrame(frame);
    });
    requestAnimationFrame(frame);
  }

  return { start: start, kinds: Object.keys(KINDS) };
})();
