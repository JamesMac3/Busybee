import { work } from '../content.js';
import { useQuote } from '../quoteStore.jsx';
import SectionHeading from './SectionHeading.jsx';
import QuoteLink from './QuoteLink.jsx';
import Icon from './Icon.jsx';

const SIZES = {
  stripes: '(min-width: 900px) 58vw, 100vw',
  trim: '(min-width: 900px) 40vw, (min-width: 600px) 50vw, 100vw',
};

function WorkCard({ item }) {
  const { add } = useQuote();
  return (
    <article className={`work-card work-${item.key} reveal`}>
      <figure className="work-media">
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={SIZES[item.key] ?? '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw'}
          alt={item.alt}
          loading="lazy"
          decoding="async"
        />
        {item.isProject && <span className="work-tag">Busy Bee project</span>}
      </figure>
      <div className="work-body">
        <div>
          <p className="work-sub">{item.sub}</p>
          <h3>{item.caption}</h3>
        </div>
        <QuoteLink className="work-help" onBeforeOpen={() => add(item.problem)}>
          {item.cta}
          <span className="visually-hidden">: {item.sub}</span>
          <Icon name="arrow" size={18} />
        </QuoteLink>
      </div>
    </article>
  );
}

export default function Work() {
  return (
    <section id="work" className="section work-section" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading id="work-title" eyebrow={work.eyebrow} title={work.title} intro={work.intro} />
        <div className="work-grid">
          {work.items.map((item) => (
            <WorkCard key={item.key} item={item} />
          ))}
        </div>
        <p className="work-note">
          <Icon name="info" size={18} />
          {work.note}
        </p>
      </div>
    </section>
  );
}

