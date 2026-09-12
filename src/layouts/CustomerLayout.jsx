import { Link, Outlet, useLocation } from 'react-router-dom'
import Logo from '../components/Logo'
import { useSiteSettings } from '../contexts/SettingsContext.jsx'
import { getPublicImageUrl } from '../services/storageService'

export default function CustomerLayout() {
  const location = useLocation()
  const { settings } = useSiteSettings()
  const logoUrl = getPublicImageUrl(settings?.logo_path)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/">
            <Logo size="sm" imageUrl={logoUrl} businessName={settings?.business_name || 'AXKN07 Crochet'} />
          </Link>
          <nav className="flex items-center gap-1 font-body text-sm font-semibold">
            <Link
              to="/"
              className={`rounded-full px-4 py-2 transition-colors ${
                location.pathname === '/' ? 'bg-daisy/60 text-ink' : 'text-ink-soft hover:text-ink'
              }`}
            >
              Home
            </Link>
            <Link
              to="/prices"
              className={`rounded-full px-4 py-2 transition-colors ${
                location.pathname.startsWith('/prices') ? 'bg-daisy/60 text-ink' : 'text-ink-soft hover:text-ink'
              }`}
            >
              Price List
            </Link>
          </nav>
        </div>
        <div className="stitch-divider" />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-ink/5 bg-surface-soft py-8">
        <div className="mx-auto max-w-5xl px-4 text-center font-body text-sm text-ink-soft sm:px-6">
          Made with 🧡 by {settings?.business_name || 'AXKN07 Crochet'}
        </div>
      </footer>
    </div>
  )
}
