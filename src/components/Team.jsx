import { team, business } from '../content.js';
import QuoteLink from './QuoteLink.jsx';
import Icon from './Icon.jsx';
import HoneyHive from './HoneyHive.jsx';

export default function Team() {
  return (
    <section id="about" className="section team-section" aria-labelledby="team-title">
      <HoneyHive />
      <div className="container team-grid">
        <div className="team-copy reveal">
          <p className="eyebrow">{team.eyebrow}</p>
          <h2 id="team-title">{team.title}</h2>
          <p className="team-lede">{team.copy}</p>
          <ul className="area-list" aria-label="Service areas">
            {business.areas.map((a) => (
              <li key={a}>
                <Icon name="pin" size={16} /> {a}
              </li>
            ))}
          </ul>
          <QuoteLink className="btn btn-accent btn-lg team-cta">
            {team.cta}
            <Icon name="arrow" size={20} />
          </QuoteLink>
        </div>

        <ul className="team-portraits">
          {team.members.map((m) => (
            <li key={m.name} className="portrait reveal">
              <figure>
                <div className="portrait-frame">
                  <img
                    src={m.src}
                    srcSet={m.srcSet}
                    sizes="(min-width: 600px) 170px, 30vw"
                    width="800"
                    height="1000"
                    alt={m.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
