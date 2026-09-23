import { useQuote } from '../quoteStore.jsx';

// Real link (works without JS) that routes through the shared quote journey.
export default function QuoteLink({ toStep, onBeforeOpen, onClick, children, ...rest }) {
  const { openQuote } = useQuote();
  return (
    <a
      href="#quote"
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        onBeforeOpen?.();
        openQuote({ toStep });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
