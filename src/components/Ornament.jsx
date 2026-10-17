/** The gold rule-and-diamond divider from the packaging. */
export default function Ornament({ className = "w-48", hole = "rgb(var(--bg))" }) {
  return (
    <svg viewBox="0 0 240 14" className={`text-gold ${className}`} aria-hidden="true">
      <line x1="0" y1="7" x2="104" y2="7" stroke="currentColor" strokeWidth="1.2" />
      <line x1="136" y1="7" x2="240" y2="7" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="98" cy="7" r="1.6" fill="currentColor" />
      <circle cx="142" cy="7" r="1.6" fill="currentColor" />
      <path d="M120 1 L126 7 L120 13 L114 7 Z" fill="currentColor" />
      <path d="M120 4.5 L122.5 7 L120 9.5 L117.5 7 Z" fill={hole} />
    </svg>
  );
}
