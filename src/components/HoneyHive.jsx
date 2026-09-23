import { useEffect, useRef } from 'react';

// Decorative honeycomb with honey slowly dripping down the seams between cells.
// Pure canvas, no dependencies. Pauses off-screen / in background tabs and
// renders a single still frame when reduced motion is requested.
const HONEY = [201, 164, 58]; // dull honey yellow
const rgba = (a) => `rgba(${HONEY[0]}, ${HONEY[1]}, ${HONEY[2]}, ${a})`;
const rand = (min, max) => min + Math.random() * (max - min);

function buildGrid(w, h, r) {
  const hexW = Math.sqrt(3) * r;
  const rowH = 1.5 * r;
  const cells = [];
  for (let row = -1; row * rowH < h + r * 2; row++) {
    const offset = row % 2 ? hexW / 2 : 0;
    for (let col = -1; col * hexW < w + hexW; col++) {
      cells.push({ x: col * hexW + offset, y: row * rowH });
    }
  }
  return cells;
}

function hexPath(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2; // pointy-top
    const px = x + r * Math.cos(a);
    const py = y + r * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// Static layer: cell outlines, a few honey-filled cells, and honey-coated seams.
function drawComb(ctx, w, h, r, cells) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineJoin = 'round';

  for (const c of cells) {
    if (Math.random() < 0.07) {
      hexPath(ctx, c.x, c.y, r - 3);
      ctx.fillStyle = rgba(rand(0.08, 0.16));
      ctx.fill();
    }
  }

  ctx.lineWidth = 1.25;
  ctx.strokeStyle = rgba(0.32);
  for (const c of cells) {
    hexPath(ctx, c.x, c.y, r);
    ctx.stroke();
  }

  // Honey-coated vertical seams (below each cell's bottom point).
  ctx.lineCap = 'round';
  for (const c of cells) {
    if (Math.random() < 0.22) {
      const topY = c.y + r;
      const len = r * rand(0.5, 1.4);
      const grad = ctx.createLinearGradient(0, topY, 0, topY + len);
      grad.addColorStop(0, rgba(0.75));
      grad.addColorStop(1, rgba(0));
      ctx.strokeStyle = grad;
      ctx.lineWidth = rand(3.5, 6);
      ctx.beginPath();
      ctx.moveTo(c.x, topY);
      ctx.lineTo(c.x, topY + len);
      ctx.stroke();
    }
  }
}

function drawDrip(ctx, d) {
  const { x, y, len, bulb, neck } = d;
  const by = y + len;
  ctx.fillStyle = rgba(0.9);

  // Bead of honey pooled at the joint.
  ctx.beginPath();
  ctx.arc(x, y, neck * 1.35, 0, Math.PI * 2);
  ctx.fill();

  // Neck tapering into a round bulb.
  ctx.beginPath();
  ctx.moveTo(x - neck, y);
  ctx.quadraticCurveTo(x - neck * 0.35, by - bulb * 1.6, x - bulb, by);
  ctx.arc(x, by, bulb, Math.PI, 0, true);
  ctx.quadraticCurveTo(x + neck * 0.35, by - bulb * 1.6, x + neck, y);
  ctx.closePath();
  ctx.fill();

  // Glossy highlight.
  ctx.fillStyle = 'rgba(255, 245, 200, 0.35)';
  ctx.beginPath();
  ctx.arc(x - bulb * 0.35, by - bulb * 0.3, bulb * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawDrop(ctx, p) {
  ctx.fillStyle = rgba(0.85 * p.alpha);
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, p.r * 0.85, p.r * 1.25, 0, 0, Math.PI * 2);
  ctx.fill();
}

export default function HoneyHive() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return undefined;
    const ctx = canvas.getContext('2d');
    const comb = document.createElement('canvas');
    const combCtx = comb.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let r = 30;
    let cells = [];
    let drips = [];
    let drops = [];
    let raf = 0;
    let last = 0;
    let visible = false;

    const spawn = (d = {}) => {
      const c = cells[Math.floor(Math.random() * cells.length)];
      return Object.assign(d, {
        x: c.x,
        y: c.y + r,
        len: 0,
        max: r * rand(0.9, 1.9),
        speed: rand(5, 10), // px per second: honey is slow
        bulb: 2.5,
        neck: rand(2.4, 3.6),
        state: 'grow',
        wait: rand(0, 5),
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = section.clientWidth;
      h = section.clientHeight;
      r = w < 600 ? 22 : 30;
      for (const cv of [canvas, comb]) {
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
      }
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      combCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = buildGrid(w, h, r);
      drawComb(combCtx, w, h, r, cells);
      const count = Math.max(10, Math.round((w * h) / 24000));
      drips = Array.from({ length: count }, () => spawn());
      drops = [];
      if (reduce) {
        // Still frame: drips caught mid-flow.
        drips.forEach((d) => {
          d.len = d.max * rand(0.3, 1);
          d.bulb = 2.5 + (d.len / d.max) * 4.5;
          d.wait = 0;
        });
      }
      render();
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(comb, 0, 0, w, h);
      drips.forEach((d) => d.wait <= 0 && d.len > 0.5 && drawDrip(ctx, d));
      drops.forEach((p) => drawDrop(ctx, p));
    };

    const step = (dt) => {
      for (const d of drips) {
        if (d.wait > 0) {
          d.wait -= dt;
          continue;
        }
        if (d.state === 'grow') {
          // Honey stretches slowly, easing as it nears its limit.
          d.len += d.speed * dt * (1.15 - d.len / d.max);
          d.bulb = 2.5 + (d.len / d.max) * 4.5;
          if (d.len >= d.max * 0.97) {
            drops.push({ x: d.x, y: d.y + d.len, r: d.bulb, vy: 6, alpha: 1 });
            d.state = 'retract';
          }
        } else {
          d.len -= 40 * dt;
          d.bulb = Math.max(2.5, d.bulb - 8 * dt);
          if (d.len <= 0) spawn(d);
        }
      }
      for (const p of drops) {
        p.vy += 160 * dt; // gravity
        p.y += p.vy * dt;
        p.alpha -= 0.45 * dt;
      }
      drops = drops.filter((p) => p.alpha > 0 && p.y < h + 20);
    };

    const loop = (t) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      step(dt);
      render();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(section);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(section);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="honey-hive" aria-hidden="true" />;
}
