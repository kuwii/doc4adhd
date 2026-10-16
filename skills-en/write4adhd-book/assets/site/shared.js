/* Shared script for a demystified-style book site (same source as the inlined script in
   skeleton.html - keep both in sync when you edit either).
   Contains: theme color lookup, Canvas init + drawing helpers, step-animation scaffolding,
   theme switching. After including this file, each page writes its own diagram code in an
   inline <script>. */

/* ── Read the current theme colors so diagrams adapt to light/dark automatically ── */
function getColors() {
  var s = getComputedStyle(document.documentElement);
  function v(n) { return (s.getPropertyValue(n) || '').trim(); }
  return {
    primary: v('--primary'), primaryLight: v('--primary-light'),
    accent: v('--accent'),   accentLight: v('--accent-light'),
    green: v('--green'),     greenLight: v('--green-light'),
    purple: v('--purple'),   purpleLight: v('--purple-light'),
    text: v('--text'), muted: v('--text-muted'), light: v('--text-light'),
    surface: v('--surface'), border: v('--border'), bg: v('--bg')
  };
}

/* Every diagram that needs redrawing on theme switch registers itself here */
var __redraws = [];

/* ── Canvas init: DPR handling + proportional scaling, no distortion on narrow screens ── */
function setupCanvas(id, drawFn) {
  var canvas = document.getElementById(id);
  if (!canvas) return null;
  var dpr = window.devicePixelRatio || 1;
  var baseW = canvas.width, baseH = canvas.height; // design-space size
  var ctx = canvas.getContext('2d');
  var cssW = baseW, cssH = baseH, scale = 1;

  function paint() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.save();
    ctx.scale(scale, scale);
    drawFn(ctx, baseW, baseH);
    ctx.restore();
  }

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var w = Math.min(rect.width - 32, baseW);
    var h = baseH * (w / baseW);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    cssW = w; cssH = h; scale = w / baseW;
    paint();
  }

  __redraws.push(resize);
  resize();
  window.addEventListener('resize', resize);
  return { paint: paint, resize: resize, canvas: canvas };
}

/* ── Basic drawing helpers ── */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawArrow(ctx, x1, y1, x2, y2, color, width) {
  color = color || '#64748b';
  width = width || 2;
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var headLen = 11;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - headLen * 0.85 * Math.cos(angle), y2 - headLen * 0.85 * Math.sin(angle));
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
}

/* Rounded box with multi-line text support (\n for line breaks) */
function drawBox(ctx, x, y, w, h, text, fill, border, textColor, fontSize) {
  fontSize = fontSize || 14;
  roundRect(ctx, x, y, w, h, 9);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = textColor;
  ctx.font = '600 ' + fontSize + 'px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  var lines = String(text).split('\n');
  var lh = fontSize * 1.25;
  var startY = y + h / 2 - (lines.length - 1) * lh / 2;
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x + w / 2, startY + i * lh);
  }
}

/* Label with multi-line + alignment support */
function drawLabel(ctx, x, y, text, color, size, align) {
  color = color || '#64748b';
  size = size || 13;
  align = align || 'center';
  ctx.fillStyle = color;
  ctx.font = '500 ' + size + 'px -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  var lines = String(text).split('\n');
  var lh = size * 1.3;
  var startY = y - (lines.length - 1) * lh / 2;
  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, startY + i * lh);
  }
}

/* ── Step-animation scaffolding ──
   spec.steps: total number of steps; spec.stepMs: duration of each step;
   spec.draw(ctx, w, h, step, t): draws the current step and its progress t (0→1).
   Automatically wires up the <id>-play / <id>-step / <id>-reset buttons,
   autoplays and loops by default, and pauses when scrolled out of the viewport. */
function setupAnim(id, spec) {
  var anim = { step: 0, t: 0, playing: true };
  var steps = spec.steps || 4;
  var stepMs = spec.stepMs || 1300;
  var view = setupCanvas(id, function (ctx, w, h) {
    spec.draw(ctx, w, h, anim.step, anim.t);
  });
  if (!view) return null;

  var visible = true, rafId = null, last = 0;
  function syncPlay() {
    var b = document.getElementById(id + '-play');
    if (b) b.textContent = anim.playing ? '⏸ Pause' : '▶ Play';
  }
  function loop(ts) {
    rafId = null;
    if (!anim.playing || !visible) return;
    if (!last) last = ts;
    anim.t += (ts - last) / stepMs;
    last = ts;
    while (anim.t >= 1) { anim.t -= 1; anim.step = (anim.step + 1) % steps; }
    view.paint();
    rafId = requestAnimationFrame(loop);
  }
  function start() {
    if (rafId == null && anim.playing && visible) { last = 0; rafId = requestAnimationFrame(loop); }
  }
  function stop() { if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; } }

  var playBtn = document.getElementById(id + '-play');
  if (playBtn) playBtn.addEventListener('click', function () {
    anim.playing = !anim.playing;
    syncPlay();
    if (anim.playing) start(); else stop();
  });
  var stepBtn = document.getElementById(id + '-step');
  if (stepBtn) stepBtn.addEventListener('click', function () {
    anim.playing = false; syncPlay(); stop();
    anim.step = (anim.step + 1) % steps; anim.t = 0;
    view.paint();
  });
  var resetBtn = document.getElementById(id + '-reset');
  if (resetBtn) resetBtn.addEventListener('click', function () {
    anim.step = 0; anim.t = 0; anim.playing = true;
    syncPlay(); start();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.15 }).observe(view.canvas);
  }

  start();
  return { anim: anim, view: view, start: start, stop: stop };
}

/* ── Theme switching ── */
document.addEventListener('DOMContentLoaded', function () {
  var html = document.documentElement;
  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var theme = this.getAttribute('data-theme');
      html.setAttribute('data-theme', theme);
      localStorage.setItem('dd-theme', theme);
      __redraws.forEach(function (fn) { fn(); }); // redraw diagrams on theme switch
    });
  });
});
