import { useEffect, useId, useRef, useState } from 'react';
import { quote, problems, business } from '../content.js';
import { useQuote } from '../quoteStore.jsx';
import ProblemPicker from './ProblemPicker.jsx';
import Icon from './Icon.jsx';
import GrassStatic from './GrassStatic.jsx';

const NOTES_MAX = 500;
const QUOTE_GRASS = ['#cfe2cb', '#b7d0b1', '#a3c19c'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PROPERTY = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'business', label: 'Business', icon: 'building' },
];

function validateStep(step, selected, d) {
  const e = {};
  if (step === 1 && !selected.length) e.problems = 'Choose at least one so we know where to start.';
  if (step === 2) {
    if (!/^\d{5}$/.test(d.zip)) e.zip = d.zip ? 'ZIP codes are 5 digits.' : 'Enter your ZIP code.';
    if (!d.property) e.property = 'Let us know if this is a home or a business.';
  }
  if (step === 3) {
    if (d.name.trim().length < 2) e.name = 'Please enter your name.';
    const c = d.contact.trim();
    const digits = c.replace(/\D/g, '');
    if (!c) e.contact = 'Add an email or phone number so we can reply.';
    else if (c.includes('@') && !EMAIL_RE.test(c)) e.contact = 'That email address doesn’t look quite right.';
    else if (!c.includes('@') && !(digits.length === 10 || (digits.length === 11 && digits[0] === '1')))
      e.contact = 'Enter a 10-digit phone number, like 615-555-0123.';
  }
  return e;
}

function Field({ id, label, optional, error, hint, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="field-optional"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <Icon name="info" size={16} /> {error}
        </p>
      )}
    </div>
  );
}

function Summary({ selected, details, step, goTo }) {
  const picked = problems.filter((p) => selected.includes(p.id));
  const property = PROPERTY.find((p) => p.value === details.property);
  return (
    <div className="quote-summary" aria-label="Your quote so far">
      <div className="summary-row">
        <ul className="summary-chips" aria-label="Selected services">
          {picked.map((p) => (
            <li key={p.id}>{p.service}</li>
          ))}
        </ul>
        <button type="button" className="summary-edit" onClick={() => goTo(1)}>
          <Icon name="edit" size={16} /> Edit<span className="visually-hidden"> services</span>
        </button>
      </div>
      {step === 3 && (
        <div className="summary-row">
          <p className="summary-meta">
            {property?.label} · ZIP {details.zip}
            {details.notes.trim() && ' · Notes added'}
          </p>
          <button type="button" className="summary-edit" onClick={() => goTo(2)}>
            <Icon name="edit" size={16} /> Edit<span className="visually-hidden"> property details</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuoteFlow() {
  const uid = useId();
  const { selected, step, setStep, details, setDetails, done, setDone, reset, focusToken } = useQuote();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const headingRef = useRef(null);
  const cardRef = useRef(null);
  const lastFocusKey = useRef(null);

  const id = (n) => `${uid}-${n}`;
  const live = validateStep(step, selected, details);
  // Errors appear after a Next attempt, or once a touched field is left invalid.
  const err = (n) => errors[n] || (touched[n] && live[n]) || undefined;
  const describedBy = (n, hint) => (err(n) ? `${id(n)}-error` : hint ? `${id(n)}-hint` : undefined);

  // Move focus to the step heading whenever the step changes or a CTA opens the flow.
  useEffect(() => {
    const key = `${step}|${done}|${focusToken}`;
    const initial = lastFocusKey.current === null;
    const unchanged = lastFocusKey.current === key;
    lastFocusKey.current = key;
    if (initial || unchanged) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
    if (top < headerH) cardRef.current.scrollIntoView({ block: 'start' });
  }, [step, done, focusToken]);

  // Clear a step's errors as soon as they're resolved.
  useEffect(() => {
    setErrors((prev) => {
      const next = {};
      for (const k of Object.keys(prev)) if (live[k]) next[k] = live[k];
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [live.problems, live.zip, live.property, live.name, live.contact]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (name) => (e) => setDetails((d) => ({ ...d, [name]: e.target.value }));
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));

  const goTo = (n) => {
    setErrors({});
    setStep(n);
  };

  const next = (e) => {
    e.preventDefault();
    const found = validateStep(step, selected, details);
    if (Object.keys(found).length) {
      setErrors(found);
      const firstKey = Object.keys(found)[0];
      const target =
        firstKey === 'problems'
          ? cardRef.current.querySelector('.picker-input')
          : firstKey === 'property'
            ? cardRef.current.querySelector('input[name="property"]')
            : document.getElementById(id(firstKey));
      target?.focus();
      return;
    }
    setErrors({});
    if (step < 3) setStep(step + 1);
    else setDone(true); // Preview only: nothing is sent or stored.
  };

  const startOver = () => {
    reset();
    setTouched({});
    setErrors({});
  };

  const errorCount = Object.keys(errors).length;

  return (
    <section id="quote" className="section quote-section" aria-labelledby="quote-title">
      <div className="container quote-grid">
        <div className="quote-intro reveal">
          <p className="eyebrow">{quote.eyebrow}</p>
          <h2 id="quote-title">{quote.title}</h2>
          <p className="section-intro">{quote.lede}</p>
          <a className="phone-pill phone-pill-lg quote-phone" href={business.phoneHref}>
            <Icon name="phone" size={20} />
            Call {business.phone}
          </a>
          <ul className="quote-contact">
            <li>
              <span className="quote-contact-icon"><Icon name="mail" size={20} /></span>
              <a href={`mailto:${business.email}`}>
                <span className="quote-contact-label">Email</span>
                {business.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="quote-card" ref={cardRef}>
          <p className="preview-notice" role="note">
            <Icon name="info" size={20} />
            <span>{quote.previewNotice}</span>
          </p>

          {done ? (
            <div className="demo-result" role="status">
              <span className="demo-result-icon"><Icon name="check" size={28} /></span>
              <h3 ref={headingRef} tabIndex={-1}>Demo complete — nothing was sent.</h3>
              <p>
                This preview shows how the quote request would work. Your details were not submitted or saved,
                and no quote has been requested.
              </p>
              <p className="demo-result-contact">
                To reach Busy Bee Lawn today, call <a href={business.phoneHref}>{business.phone}</a> or email{' '}
                <a href={`mailto:${business.email}`}>{business.email}</a>.
              </p>
              <div className="demo-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setDone(false)}>
                  Review my answers
                </button>
                <button type="button" className="btn btn-quiet" onClick={startOver}>
                  Start over
                </button>
              </div>
            </div>
          ) : (
            <form className="quote-form" noValidate onSubmit={next}>
              <div className="progress">
                <p className="progress-label">
                  <span className="progress-count">Step {step} of 3</span>
                  <span className="progress-name">{quote.steps[step - 1]}</span>
                </p>
                <ol className="progress-bar" aria-hidden="true">
                  {quote.steps.map((s, i) => (
                    <li key={s} className={i + 1 < step ? 'is-done' : i + 1 === step ? 'is-current' : ''} />
                  ))}
                </ol>
              </div>

              {step > 1 && selected.length > 0 && (
                <Summary selected={selected} details={details} step={step} goTo={goTo} />
              )}

              {errorCount > 1 && (
                <p className="form-summary" role="alert">
                  Please check the {errorCount} highlighted fields.
                </p>
              )}

              {step === 1 && (
                <div className="step">
                  <h3 ref={headingRef} tabIndex={-1} className="step-title">What can we help with?</h3>
                  <p className="step-help">Choose all that apply. You can change these any time.</p>
                  <ProblemPicker
                    variant="chips"
                    legend="Services you need help with"
                    describedBy={errors.problems ? id('problems-error') : undefined}
                    invalid={!!errors.problems}
                  />
                  {errors.problems && (
                    <p id={id('problems-error')} className="field-error" role="alert">
                      <Icon name="info" size={16} /> {errors.problems}
                    </p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="step">
                  <h3 ref={headingRef} tabIndex={-1} className="step-title">Tell us about the property.</h3>
                  <Field id={id('zip')} label="ZIP Code" error={err('zip')}>
                    <input
                      id={id('zip')}
                      name="zip"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={5}
                      className="input-zip"
                      value={details.zip}
                      onChange={(e) => setDetails((d) => ({ ...d, zip: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                      onBlur={blur('zip')}
                      aria-invalid={!!err('zip')}
                      aria-describedby={describedBy('zip')}
                    />
                  </Field>

                  <fieldset
                    className={`field segmented${err('property') ? ' has-error' : ''}`}
                    aria-describedby={err('property') ? `${id('property')}-error` : undefined}
                  >
                    <legend>Property type</legend>
                    <div className="segmented-options">
                      {PROPERTY.map((p) => (
                        <label key={p.value} className={`segmented-option${details.property === p.value ? ' is-checked' : ''}`}>
                          <input
                            type="radio"
                            name="property"
                            value={p.value}
                            checked={details.property === p.value}
                            onChange={set('property')}
                          />
                          <Icon name={p.icon} size={22} />
                          {p.label}
                        </label>
                      ))}
                    </div>
                    {err('property') && (
                      <p id={`${id('property')}-error`} className="field-error">
                        <Icon name="info" size={16} /> {err('property')}
                      </p>
                    )}
                  </fieldset>

                  <Field
                    id={id('notes')}
                    label="Project notes"
                    optional
                    hint={`Yard size, timing, gate codes—anything helpful. ${details.notes.length}/${NOTES_MAX}`}
                  >
                    <textarea
                      id={id('notes')}
                      name="notes"
                      rows={3}
                      maxLength={NOTES_MAX}
                      value={details.notes}
                      onChange={set('notes')}
                      aria-describedby={describedBy('notes', true)}
                    />
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="step">
                  <h3 ref={headingRef} tabIndex={-1} className="step-title">How should we reach you?</h3>
                  <Field id={id('name')} label="Name" error={err('name')}>
                    <input
                      id={id('name')}
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={details.name}
                      onChange={set('name')}
                      onBlur={blur('name')}
                      aria-invalid={!!err('name')}
                      aria-describedby={describedBy('name')}
                    />
                  </Field>
                  <Field
                    id={id('contact')}
                    label="Email or phone"
                    error={err('contact')}
                    hint="Whichever you’d prefer we use."
                  >
                    <input
                      id={id('contact')}
                      name="contact"
                      type="text"
                      autoComplete="email"
                      value={details.contact}
                      onChange={set('contact')}
                      onBlur={blur('contact')}
                      aria-invalid={!!err('contact')}
                      aria-describedby={describedBy('contact', true)}
                    />
                  </Field>
                </div>
              )}

              <div className="step-nav">
                {step > 1 && (
                  <button type="button" className="btn btn-secondary step-back" onClick={() => goTo(step - 1)}>
                    <Icon name="arrow" size={18} className="icon-flip" /> Back
                  </button>
                )}
                <button type="submit" className={`btn btn-lg ${step === 3 ? 'btn-accent' : 'btn-primary'} step-next`}>
                  {step === 3 ? 'Request My Free Quote' : 'Next'}
                  {step < 3 && <Icon name="arrow" size={18} />}
                </button>
              </div>
              {step === 3 && (
                <p className="form-footnote">Preview only — this runs a form check and does not send anything.</p>
              )}
            </form>
          )}
        </div>
      </div>
      <GrassStatic className="quote-grass" height={40} count={150} seed={11} colors={QUOTE_GRASS} />
    </section>
  );
}
