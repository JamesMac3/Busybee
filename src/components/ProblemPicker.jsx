import { problems } from '../content.js';
import { useQuote } from '../quoteStore.jsx';
import Icon from './Icon.jsx';

// Multi-select list of yard problems backed by real checkboxes.
// `variant="cards"` is the large chooser; `variant="chips"` is the compact quote step.
export default function ProblemPicker({ variant = 'cards', legend, legendClass = 'visually-hidden', describedBy, invalid }) {
  const { selected, toggle } = useQuote();
  return (
    <fieldset className={`picker picker-${variant}`} aria-describedby={describedBy} aria-invalid={invalid || undefined}>
      <legend className={legendClass}>{legend}</legend>
      <ul className="picker-list">
        {problems.map((p) => {
          const checked = selected.includes(p.id);
          return (
            <li key={p.id}>
              <label className={`picker-option${checked ? ' is-checked' : ''}`}>
                <input
                  type="checkbox"
                  className="picker-input"
                  name="problems"
                  value={p.id}
                  checked={checked}
                  onChange={() => toggle(p.id)}
                />
                <span className="picker-icon" aria-hidden="true">
                  <Icon name={p.icon} size={variant === 'cards' ? 28 : 22} />
                </span>
                <span className="picker-text">
                  <span className="picker-title">{p.title}</span>
                  {variant === 'cards' && <span className="picker-benefit">{p.benefit}</span>}
                </span>
                <span className="picker-check" aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
