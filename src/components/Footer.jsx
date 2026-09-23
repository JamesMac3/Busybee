import { nav, business } from '../content.js';
import Logo from './Logo.jsx';
import QuoteLink from './QuoteLink.jsx';
import Icon from './Icon.jsx';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo className="logo-footer" />
          <p>
            <Icon name="pin" size={16} />
            <span>
              Serving {business.areas.join(' · ')}, TN
            </span>
          </p>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <QuoteLink>Free Quote</QuoteLink>
            </li>
          </ul>
        </nav>

        <div className="footer-contact">
          <a className="phone-pill phone-pill-dark" href={business.phoneHref}>
            <Icon name="phone" size={18} />
            {business.phone}
          </a>
          <a className="footer-email" href={`mailto:${business.email}`}>
            <Icon name="mail" size={18} />
            {business.email}
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {year} {business.name}
        </p>
        <p className="concept-notice">Website concept prepared for Busy Bee Lawn.</p>
      </div>
    </footer>
  );
}
