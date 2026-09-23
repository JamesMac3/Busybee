import { useEffect, useRef, useState } from 'react';
import { nav, business } from '../content.js';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import QuoteLink from './QuoteLink.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on Escape, outside click, or when resized up to desktop.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (!panelRef.current?.contains(e.target) && !toggleRef.current?.contains(e.target)) setOpen(false);
    };
    const mq = window.matchMedia('(min-width: 900px)');
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    mq.addEventListener('change', onMq);
    panelRef.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' menu-open' : ''}`}>
      <div className="container header-inner">
        <Logo />

        <nav className="primary-nav" aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a className="phone-pill header-phone" href={business.phoneHref}>
            <Icon name="phone" size={18} />
            <span>{business.phone}</span>
          </a>
          <QuoteLink className="btn btn-primary header-cta">Get a Free Quote</QuoteLink>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={close}>
                  {item.label}
                  <Icon name="arrow" size={18} />
                </a>
              </li>
            ))}
          </ul>
          <QuoteLink className="btn btn-accent btn-block" onClick={close}>
            Get a Free Quote
          </QuoteLink>
          <a className="phone-pill mobile-menu-phone" href={business.phoneHref} onClick={close}>
            <Icon name="phone" size={18} /> Call {business.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
