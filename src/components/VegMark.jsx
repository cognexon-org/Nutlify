/** The vegetarian symbol: a green dot in a green square. */
export default function VegMark({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} role="img" aria-label="Vegetarian">
      <rect x="1" y="1" width="18" height="18" rx="1.5" fill="#FFFFFF" stroke="#1E8A3A" strokeWidth="2" />
      <circle cx="10" cy="10" r="5" fill="#1E8A3A" />
    </svg>
  );
}
