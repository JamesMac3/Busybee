import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { problems } from './content.js';

// Shared quote-journey state. Held in memory only: nothing is sent or stored.
const QuoteContext = createContext(null);

const ORDER = problems.map((p) => p.id);
const byOrder = (ids) => [...ids].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
const EMPTY_DETAILS = { zip: '', property: '', notes: '', name: '', contact: '' };

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function QuoteProvider({ children }) {
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [done, setDone] = useState(false);
  const focusRequest = useRef(0);
  const [focusToken, setFocusToken] = useState(0);

  const toggle = useCallback(
    (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : byOrder([...s, id]))),
    [],
  );
  const add = useCallback((id) => setSelected((s) => (s.includes(id) ? s : byOrder([...s, id]))), []);
  const clear = useCallback(() => setSelected([]), []);

  // Every quote CTA funnels through here, so selections always carry over.
  const openQuote = useCallback(({ toStep } = {}) => {
    setDone(false);
    if (toStep) setStep(toStep);
    // Land on the card itself so the step heading and controls are in view.
    const target = document.querySelector('#quote .quote-card') ?? document.getElementById('quote');
    target?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    focusRequest.current += 1;
    setFocusToken(focusRequest.current);
  }, []);

  const reset = useCallback(() => {
    setSelected([]);
    setDetails(EMPTY_DETAILS);
    setStep(1);
    setDone(false);
  }, []);

  const value = useMemo(
    () => ({ selected, toggle, add, clear, step, setStep, details, setDetails, done, setDone, openQuote, reset, focusToken }),
    [selected, toggle, add, clear, step, details, done, openQuote, reset, focusToken],
  );
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuote() {
  return useContext(QuoteContext);
}

// Contextual CTA, e.g. "Get a quote for mowing + garden beds".
// eslint-disable-next-line react-refresh/only-export-components
export function quoteCtaLabel(ids) {
  const picked = problems.filter((p) => ids.includes(p.id) && p.id !== 'unsure');
  if (!picked.length) return ids.includes('unsure') ? 'Help me choose where to start' : '';
  if (picked.length > 3) return `Get a quote for ${picked.length} services`;
  return `Get a quote for ${picked.map((p) => p.short).join(' + ')}`;
}
