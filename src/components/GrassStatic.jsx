import { useMemo } from 'react';
import { mulberry32 } from '../seededRandom.js';

// Deterministic, non-animated grass strip. Used as the quiet echo near the
// quote section and as the fallback when canvas isn't available.

const DEFAULT_COLORS = ['#1d5534', '#356d44', '#5f8f5b'];

export default function GrassStatic({
  width = 1440,
  height = 44,
  count = 170,
  seed = 7,
  colors = DEFAULT_COLORS,
  className = '',
}) {
  const blades = useMemo(() => {
    const rnd = mulberry32(seed);
    const out = [];
    const spread = width * 0.13;
    for (let i = 0; i < count; i++) {
      const x = rnd() * width;
      // Taller, denser clusters toward the outer corners; a quiet center.
      const corner = Math.max(Math.exp(-((x / spread) ** 2)), Math.exp(-(((width - x) / spread) ** 2)));
      if (corner < 0.12 && rnd() < 0.6) continue;
      const h = height * (0.3 + 0.7 * corner) * (0.5 + 0.5 * rnd());
      const w = 2 + rnd() * 2.5;
      const lean = (rnd() - 0.5) * 10;
      const cy = height - h * 0.55;
      const d =
        `M${(x - w / 2).toFixed(1)} ${height}` +
        `Q${(x + lean * 0.35 - w * 0.3).toFixed(1)} ${cy.toFixed(1)} ${(x + lean).toFixed(1)} ${(height - h).toFixed(1)}` +
        `Q${(x + lean * 0.35 + w * 0.3).toFixed(1)} ${cy.toFixed(1)} ${(x + w / 2).toFixed(1)} ${height}Z`;
      out.push({ d, fill: colors[Math.floor(rnd() * colors.length)] });
    }
    return out;
  }, [width, height, count, seed, colors]);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {blades.map((b, i) => (
        <path key={i} d={b.d} fill={b.fill} />
      ))}
    </svg>
  );
}
