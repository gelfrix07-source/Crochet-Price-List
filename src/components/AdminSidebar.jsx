import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSiteSettings } from '../contexts/SettingsContext.jsx'
import { getPublicImageUrl } from '../services/storageService'
import Logo from './Logo'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/admin/products', label: 'Products', icon: '🧶' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function AdminSidebar({ onNavigate }) {
  const { signOut } = useAuth()
  const { settings } = useSiteSettings()
  const logoUrl = getPublicImageUrl(settings?.logo_path)

  return (
    <div className="flex h-full flex-col bg-surface p-5">
      <div className="mb-8">
        <Logo size="sm" imageUrl={logoUrl} businessName={settings?.business_name || 'AXKN07 Crochet'} />
        <p className="mt-1 font-body text-xs text-ink-soft">Pricing Studio · Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-cozy px-4 py-3 font-body text-sm font-semibold transition-colors ${
                isActive ? 'bg-peach text-surface' : 'text-ink-soft hover:bg-daisy/50 hover:text-ink'
              }`
            }
          >
            <span aria-hidden="true">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={signOut}
        className="mt-4 flex items-center gap-3 rounded-cozy px-4 py-3 font-body text-sm font-semibold text-ink-soft transition-colors hover:bg-daisy/50 hover:text-ink"
      >
        <span aria-hidden="true">🚪</span> Log Out
      </button>
    </div>
  )
}
