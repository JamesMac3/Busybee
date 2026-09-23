import { services } from '../content.js';
import { useQuote } from '../quoteStore.jsx';
import SectionHeading from './SectionHeading.jsx';
import Icon from './Icon.jsx';

function ServiceCard({ icon, title, text, problem }) {
  const { selected, toggle } = useQuote();
  const added = selected.includes(problem);
  return (
    <li className="service-card reveal">
      <span className="service-icon">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      <button
        type="button"
        className={`service-add${added ? ' is-added' : ''}`}
        aria-pressed={added}
        onClick={() => toggle(problem)}
      >
        <Icon name={added ? 'check' : 'plus'} size={18} />
        <span className="service-add-long">{added ? 'In your quote' : 'Add to my quote'}</span>
        <span className="service-add-short" aria-hidden="true">{added ? 'Added' : 'Add'}</span>
        <span className="visually-hidden service-add-sr">{added ? 'In your quote' : 'Add to my quote'}</span>
        <span className="visually-hidden">: {title}</span>
      </button>
    </li>
  );
}

export default function Services() {
  return (
    <section id="services" className="section section-tint" aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="One busy hive. A whole yard of possibilities."
          intro="Choose one service or bundle a few. Anything you add here shows up in your quote."
        />
        <ul className="service-grid">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </ul>
      </div>
    </section>
  );
}

