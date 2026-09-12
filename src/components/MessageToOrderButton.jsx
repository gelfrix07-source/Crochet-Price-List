import { useSiteSettings } from '../contexts/SettingsContext.jsx'
import { buildMessageLink } from '../services/settingsService'

export default function MessageToOrderButton({ productName, className = '', full = false }) {
  const { settings } = useSiteSettings()
  const link = settings?.contact_url ? buildMessageLink(settings.contact_url, productName) : null

  if (!link) {
    return null
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-primary ${full ? 'w-full' : ''} ${className}`}
    >
      <span aria-hidden="true">💬</span> Message to Order
    </a>
  )
}
