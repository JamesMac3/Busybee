import { business } from '../content.js';

export default function Logo({ className = '', href = '#top' }) {
  const { logo, name } = business;
  return (
    <a className={`logo ${className}`} href={href} aria-label={`${name} — back to top`}>
      <picture>
        <source type="image/webp" srcSet={logo.srcSet} />
        <img src={logo.fallback} width={logo.width} height={logo.height} alt={name} />
      </picture>
    </a>
  );
}
