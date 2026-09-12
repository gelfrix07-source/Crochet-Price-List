// Renders the uploaded business logo when one is set in Settings, otherwise falls back to a
// CSS wordmark using the brand's Fraunces typeface and colors.
export default function Logo({ size = 'md', className = '', imageUrl = null, businessName = 'AXKN07 Crochet' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  const [first, ...rest] = businessName.split(' ')

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={businessName} className="h-9 w-9 rounded-full object-cover shadow-gentle" />
      ) : (
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-fade text-surface shadow-gentle"
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </span>
      )}
      <span className={`font-heading font-semibold leading-none text-ink ${sizes[size]}`}>
        {first} <span className="text-peach">{rest.join(' ')}</span>
      </span>
    </div>
  )
}
