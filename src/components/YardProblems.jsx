import { useQuote, quoteCtaLabel } from '../quoteStore.jsx';
import ProblemPicker from './ProblemPicker.jsx';
import QuoteLink from './QuoteLink.jsx';
import Icon from './Icon.jsx';

export default function YardProblems() {
  const { selected, clear } = useQuote();
  const label = quoteCtaLabel(selected);

  return (
    <section id="yard-problems" className="section section-tight problems-section" aria-labelledby="problems-title">
      <div className="container">
        <div className="problems-head reveal">
          <p className="eyebrow">Start here</p>
          <h2 id="problems-title">What’s bugging your yard?</h2>
          <p className="section-intro">Pick everything that applies. We’ll carry your picks straight into your quote.</p>
        </div>

        <ProblemPicker variant="cards" legend="What’s bugging your yard? Choose all that apply." />

        <div className={`problems-action${selected.length ? ' is-active' : ''}`} id="problems-action">
          <p className="problems-status" aria-live="polite">
            {selected.length
              ? `${selected.length} selected — nice. Next, a couple of quick details.`
              : 'Choose one or more to get started.'}
          </p>
          {selected.length > 0 && (
            <div className="problems-buttons">
              <QuoteLink className="btn btn-primary btn-lg" toStep={2}>
                {label}
                <Icon name="arrow" size={20} />
              </QuoteLink>
              <button type="button" className="btn btn-quiet" onClick={clear}>
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
