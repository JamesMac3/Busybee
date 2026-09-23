import { process } from '../content.js';
import SectionHeading from './SectionHeading.jsx';
import QuoteLink from './QuoteLink.jsx';

export default function Process() {
  return (
    <section className="section process-section" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading
          id="process-title"
          eyebrow="How it works"
          title="Getting started is simple."
          align="center"
        />
        <ol className="process-list">
          {process.map((step, i) => (
            <li key={step.title} className="process-step reveal">
              <span className="process-num" aria-hidden="true">
                {i + 1}
              </span>
              <h3>
                <span className="visually-hidden">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="process-cta">
          <QuoteLink className="btn btn-primary btn-lg">Start My Free Quote</QuoteLink>
        </div>
      </div>
    </section>
  );
}
