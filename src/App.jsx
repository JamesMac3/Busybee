import { useEffect } from 'react';
import { QuoteProvider } from './quoteStore.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import YardProblems from './components/YardProblems.jsx';
import Work from './components/Work.jsx';
import Services from './components/Services.jsx';
import Process from './components/Process.jsx';
import Team from './components/Team.jsx';
import QuoteFlow from './components/QuoteFlow.jsx';
import Footer from './components/Footer.jsx';
import MobileQuoteBar from './components/MobileQuoteBar.jsx';

// Restrained scroll reveals. Content is fully visible without JS or with
// reduced motion; the `can-reveal` class opts in to the effect.
function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return undefined;
    const root = document.documentElement;
    root.classList.add('can-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove('can-reveal');
    };
  }, []);
}

export default function App() {
  useReveal();
  return (
    <QuoteProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main">
        <Hero />
        <YardProblems />
        <Team />
        <Work />
        <Services />
        <Process />
        <QuoteFlow />
      </main>
      <Footer />
      <MobileQuoteBar />
    </QuoteProvider>
  );
}

