export default function SectionHeading({ eyebrow, title, center = true, className = "" }) {
  return (
    <div className={`${center ? "text-center" : ""} mb-16 ${className}`}>
      {eyebrow && <span className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-4">{eyebrow}</span>}
      <h2 className="font-display text-headline-md-mobile md:text-headline-md text-primary">{title}</h2>
    </div>
  );
}
