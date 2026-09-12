import { Link } from 'react-router-dom'
import { getPublicImageUrl } from '../services/storageService'
import { AvailabilityBadge, FeatureBadge } from './Badge'
import { useCart } from '../contexts/CartContext.jsx'

export default function ProductCard({ product }) {
  const imageUrl = getPublicImageUrl(product.image_path)
  const { addItem } = useCart()

  return (
    <div className="card group flex flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-daisy/40">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">🧶</div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {product.is_new && <FeatureBadge tone="olive">New</FeatureBadge>}
          {product.featured && <FeatureBadge tone="peach">Featured</FeatureBadge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-heading text-base font-semibold leading-snug text-ink hover:text-peach">
              {product.name}
            </h3>
          </Link>
          <AvailabilityBadge status={product.availability} />
        </div>

        {product.categories?.name && (
          <span className="w-fit rounded-full bg-daisy/50 px-2.5 py-0.5 font-body text-xs text-ink-soft">
            {product.categories.name}
          </span>
        )}

        {product.short_description && (
          <p className="line-clamp-2 font-body text-sm text-ink-soft">{product.short_description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-heading text-xl font-semibold text-peach">₱{formatPrice(product.price)}</span>
        </div>

        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
  <Link to={`/product/${product.id}`} className="btn-secondary flex-1 !px-4 !py-2 text-sm">
    View Details
  </Link>
  <button
    onClick={() => addItem(product)}
    className="btn-primary flex-1 !px-4 !py-2 text-sm"
  >
    🧺 Add to Cart
  </button>
</div>
      </div>
    </div>
  )
}

function formatPrice(price) {
  const num = Number(price)
  if (Number.isNaN(num)) return price
  return num.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
