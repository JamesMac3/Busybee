import { hero, business } from '../content.js';
import Icon from './Icon.jsx';
import GrassBackground from './GrassBackground.jsx';

export default function Hero() {
  const { image } = hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <figure className="hero-media">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          width={image.width}
          height={image.height}
          alt={image.alt}
          fetchPriority="high"
        />
        <figcaption className="hero-grounds-caption">
          <span>RESIDENTIAL · COMMERCIAL · HOA</span>
          <strong>From your front yard<br />to your entire property.</strong>
        </figcaption>
      </figure>

      <GrassBackground />

      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title">
            <span className="hero-lead">{hero.titleLead}</span>
            <span className="hero-punch">{hero.titlePunch}</span>
          </h1>
          <p className="hero-lede">{hero.lede}</p>
          <div className="hero-actions">
            <a className="btn btn-accent btn-lg" href="#yard-problems">
              {hero.primary}
              <Icon name="arrow" size={20} />
            </a>
            <a className="btn btn-ghost-light btn-lg" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>
          <p className="hero-assurance">Free quote · No account needed · A local, family-run hive</p>
          <p className="hero-call">
            Rather talk it through?
            <a className="phone-pill phone-pill-dark" href={business.phoneHref}>
              <Icon name="phone" size={18} />
              {business.phone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}


