import { useEffect, useState } from 'react';
import { business } from '../content.js';
import { useQuote } from '../quoteStore.jsx';
import QuoteLink from './QuoteLink.jsx';
import Icon from './Icon.jsx';

// Fixed bottom action on small screens. Steps aside while quote controls are on
// screen and while any field has focus, so it never covers the form or keyboard.
export default function MobileQuoteBar() {
  const { selected } = useQuote();
  const [controlsVisible, setControlsVisible] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const targets = ['.quote-card', '#problems-action'].map((s) => document.querySelector(s)).filter(Boolean);
    if (!targets.length || !('IntersectionObserver' in window)) return undefined;
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
        setControlsVisible(visible.size > 0);
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const isField = (el) => el?.matches?.('input:not([type=checkbox]):not([type=radio]), textarea, select');
    const onIn = (e) => setTyping(isField(e.target));
    const onOut = () => setTyping(false);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);

  const hidden = controlsVisible || typing;
  const hasPicks = selected.length > 0;

  return (
    <div className={`mobile-quote-bar${hidden ? ' is-hidden' : ''}`} aria-hidden={hidden || undefined} inert={hidden || undefined}>
      {hasPicks ? (
        <QuoteLink className="btn btn-accent mobile-quote-main">
          Continue My Quote
          <span className="mobile-quote-count" aria-hidden="true">
            {selected.length}
          </span>
          <span className="visually-hidden">, {selected.length} selected</span>
        </QuoteLink>
      ) : (
        <a className="btn btn-accent mobile-quote-main" href="#yard-problems">
          Let’s Fix My Yard
        </a>
      )}
      <a className="mobile-quote-call" href={business.phoneHref} aria-label={`Call Busy Bee Lawn at ${business.phone}`}>
        <Icon name="phone" size={22} />
      </a>
    </div>
  );
}
