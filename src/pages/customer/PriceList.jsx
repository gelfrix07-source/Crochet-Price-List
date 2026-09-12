import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { useProducts } from '../../hooks/useProducts'
import { useSiteSettings } from '../../contexts/SettingsContext.jsx'
import SearchBar from '../../components/SearchBar'
import CategoryFilter from '../../components/CategoryFilter'
import ProductCard from '../../components/ProductCard'
import EmptyState, { ErrorState } from '../../components/EmptyState'
import { ProductGridSkeleton } from '../../components/LoadingStates'

export default function PriceList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState(null)

  const { categories } = useCategories()
  const { settings } = useSiteSettings()
  const { products, loading, error, refresh } = useProducts({
    categoryId: activeCategoryId,
    searchTerm,
    categories,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
          Our Crochet Price List 🧶
        </h1>
        {settings?.price_disclaimer && (
          <p className="mx-auto mt-2 max-w-lg font-body text-sm text-ink-soft">{settings.price_disclaimer}</p>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryFilter categories={categories} activeId={activeCategoryId} onChange={setActiveCategoryId} />
      </div>

      {loading && <ProductGridSkeleton />}

      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && products.length === 0 && searchTerm && (
        <EmptyState icon="🔍" title="No products found." message="Try a different search term or category." />
      )}

      {!loading && !error && products.length === 0 && !searchTerm && (
        <EmptyState icon="🧶" title="No crochet pieces available yet." />
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
