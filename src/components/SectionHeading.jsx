export default function SectionHeading({ id, eyebrow, title, intro, align = 'left', tone }) {
  return (
    <div className={`section-heading reveal align-${align}${tone ? ` tone-${tone}` : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id}>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}
