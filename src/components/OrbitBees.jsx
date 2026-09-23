import { useEffect, useId, useRef } from 'react';

// Bees fly in from off screen, loop a section heading 3–4 times on tilted
// elliptical orbits, then fly off screen. On the far side of each orbit a bee
// drops behind the heading (smaller, dimmer); on the near side it passes in
// front (larger, brighter), which reads as depth. The show is cued when the
// section scrolls into view and replays after it has left the screen.
// Positions are written straight to the DOM, not React state.
//
// Place inside a positioned wrapper that also contains the heading; the
// heading must sit at z-index 1 so bees can go behind (0) and in front (2).

// dir: +1 / -1 orbit direction. loops: full circuits before leaving.
const ORBITS = [
  { speed: 1.55, dir: 1, loops: 4, tilt: -0.16, rx: 1.0, ry: 0.55, size: 1.0, join: 0 },
  { speed: 1.3, dir: -1, loops: 3, tilt: 0.12, rx: 0.86, ry: 0.75, size: 0.85, join: 0.35 },
  { speed: 1.75, dir: 1, loops: 4, tilt: -0.06, rx: 0.93, ry: 0.4, size: 0.9, join: -0.3 },
  { speed: 1.45, dir: -1, loops: 3, tilt: 0.2, rx: 0.78, ry: 0.95, size: 0.8, join: 0.2 },
];
const ENTER = 1.5; // seconds to fly in
const EXIT = 1.7; // seconds to fly off
const STAGGER = 0.55; // seconds between bees
const STILL = 3.4; // reduced motion: one frame from mid-show, every bee on its orbit

const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function Bee() {
  const clip = `orbit-bee-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 34 28" width="34" height="28" focusable="false">
      <g className="orbit-bee-wing">
        <ellipse cx="13" cy="9" rx="6.5" ry="8.5" fill="#e3f5ed" opacity="0.9" transform="rotate(-25 13 9)" />
      </g>
      <g className="orbit-bee-wing orbit-bee-wing-back">
        <ellipse cx="19" cy="9.5" rx="5.2" ry="7" fill="#b8ded2" opacity="0.85" transform="rotate(20 19 9.5)" />
      </g>
      <path d="M4.5 17 1 18.2l3.5 1.2z" fill="#183328" />
      <ellipse cx="15" cy="18" rx="11" ry="7.5" fill="#f4cf35" />
      <clipPath id={clip}>
        <ellipse cx="15" cy="18" rx="11" ry="7.5" />
      </clipPath>
      <g clipPath={`url(#${clip})`} fill="#183328">
        <rect x="9" y="9" width="3.4" height="18" />
        <rect x="15.4" y="9" width="3.4" height="18" />
      </g>
      <circle cx="26.5" cy="16.5" r="5" fill="#183328" />
      <circle cx="28.3" cy="15.4" r="1.3" fill="#fff" />
      <path d="M27 11.8c.8-2.6 2.2-4 4.2-4.5" fill="none" stroke="#183328" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function OrbitBees({ count = 4, target = 'h2' }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const wrap = root?.parentElement;
    const heading = wrap?.querySelector(target);
    if (!root || !wrap || !heading) return undefined;
    const bees = [...root.children];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let cx = 0;
    let cy = 0;
    let RX = 0;
    let RY = 0;
    let offL = -80; // off-screen x positions, in wrapper coordinates
    let offR = 1600;
    let beeScale = 1;
    let raf = 0;
    let last = 0;
    let t = 0; // show clock
    let state = 'idle'; // idle → playing → done
    let visible = false;
    const prevX = new Float32Array(bees.length);
    const layer = new Int8Array(bees.length).fill(-1);
    const pt = { x: 0, y: 0, depth: 1, tx: 0, ty: 0 }; // reused, no per-frame allocation

    const measure = () => {
      const w = wrap.getBoundingClientRect();
      const h = heading.getBoundingClientRect();
      cx = h.left - w.left + h.width / 2;
      cy = h.top - w.top + h.height / 2;
      // Loop just past the heading's ends, but never past the wrapper's edges.
      const room = Math.min(cx, w.width - cx) - 22;
      RX = Math.max(60, Math.min(h.width / 2 + 34, room));
      RY = Math.max(26, h.height / 2 + 14);
      offL = -w.left - 70;
      offR = window.innerWidth - w.left + 70;
      beeScale = w.width < 600 ? 0.85 : 1.3;
    };

    // Point on an orbit at angle a, plus the unit tangent in the direction of travel.
    const orbitAt = (o, a) => {
      const ex = Math.cos(a) * RX * o.rx;
      const ey = Math.sin(a) * RY * o.ry;
      const ct = Math.cos(o.tilt);
      const st = Math.sin(o.tilt);
      pt.x = cx + ex * ct - ey * st;
      pt.y = cy + ex * st + ey * ct;
      pt.depth = Math.sin(a);
      const dx = -Math.sin(a) * RX * o.rx * o.dir;
      const dy = Math.cos(a) * RY * o.ry * o.dir;
      const tx = dx * ct - dy * st;
      const ty = dx * st + dy * ct;
      const len = Math.hypot(tx, ty) || 1;
      pt.tx = tx / len;
      pt.ty = ty / len;
      return pt;
    };

    // Bees join and leave their orbits on the near side, so they arrive and depart in front.
    const joinAngle = (o) => Math.PI / 2 + o.join;
    const orbitTime = (o) => (Math.PI * 2 * o.loops) / o.speed;
    let showLength = 0;
    for (let i = 0; i < bees.length; i++) {
      const o = ORBITS[i % ORBITS.length];
      showLength = Math.max(showLength, i * STAGGER + ENTER + orbitTime(o) + EXIT);
    }

    const draw = (i, x, y, depth, o) => {
      const el = bees[i];
      const s = beeScale * o.size * (0.78 + 0.3 * (depth + 1) * 0.5);
      const dir = x >= prevX[i] ? 1 : -1;
      prevX[i] = x;
      const front = depth > 0 ? 1 : 0;
      if (layer[i] !== front) {
        layer[i] = front;
        el.style.zIndex = front ? '2' : '0';
      }
      el.style.opacity = (0.55 + 0.45 * (depth + 1) * 0.5).toFixed(2);
      el.style.transform = `translate3d(${(x - 17).toFixed(1)}px, ${(y - 14).toFixed(1)}px, 0) scale(${(s * dir).toFixed(3)}, ${s.toFixed(3)})`;
    };

    const place = (time) => {
      for (let i = 0; i < bees.length; i++) {
        const o = ORBITS[i % ORBITS.length];
        const a0 = joinAngle(o);
        const local = time - i * STAGGER;
        const orbitEnd = ENTER + orbitTime(o);
        const bob = Math.sin(time * 3 + i) * 3;

        if (local < 0 || local >= orbitEnd + EXIT) {
          bees[i].style.opacity = '0';
        } else if (local < ENTER) {
          // Fly in from off screen and merge onto the orbit along its tangent.
          const p = orbitAt(o, a0);
          const x3 = p.x;
          const y3 = p.y;
          const x0 = p.tx < 0 ? offR : offL;
          const y0 = cy - 70 - i * 12;
          const k = easeInOut(local / ENTER);
          const x = bez(x0, x0 + (x3 - x0) * 0.35, x3 - p.tx * 110, x3, k);
          const y = bez(y0, y0 + 30, y3 - p.ty * 110, y3, k);
          draw(i, x, y + bob * k, 1, o);
        } else if (local < orbitEnd) {
          const p = orbitAt(o, a0 + o.dir * o.speed * (local - ENTER));
          draw(i, p.x, p.y + bob, p.depth, o);
        } else {
          // Peel off along the tangent and fly off screen, rising a little.
          const p = orbitAt(o, a0);
          const x0 = p.x;
          const y0 = p.y;
          const x3 = p.tx > 0 ? offR : offL;
          const y3 = cy - 90 - i * 14;
          const k = easeInOut((local - orbitEnd) / EXIT);
          const x = bez(x0, x0 + p.tx * 120, x0 + (x3 - x0) * 0.6, x3, k);
          const y = bez(y0, y0 + p.ty * 120, y3 + 20, y3, k);
          draw(i, x, y + bob * (1 - k), 1, o);
        }
      }
    };

    const loop = (now) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      t += dt;
      place(t);
      if (t >= showLength) {
        state = 'done';
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden || state === 'done') return;
      if (state === 'idle') {
        state = 'playing';
        t = 0;
      }
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const refresh = () => {
      measure();
      if (reduce) place(STILL);
      else if (state === 'playing') place(t);
    };
    const ro = new ResizeObserver(refresh);
    ro.observe(wrap);
    // Cue the show once the heading area is well into view; rearm it after a
    // finished show once the section has fully left the screen.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.intersectionRatio >= 0.35;
        if (visible) start();
        else stop();
        if (!e.isIntersecting && state === 'done') state = 'idle';
      },
      { threshold: [0, 0.35] },
    );
    io.observe(wrap);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    // The heading slides into place on reveal; re-center once it settles.
    wrap.addEventListener('transitionend', refresh);

    measure();
    if (reduce) place(STILL);
    else bees.forEach((el) => (el.style.opacity = '0'));
    root.classList.add('is-ready');

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      wrap.removeEventListener('transitionend', refresh);
    };
  }, [count, target]);

  return (
    <div ref={rootRef} className="orbit-bees" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="orbit-bee">
          <Bee />
        </span>
      ))}
    </div>
  );
}
