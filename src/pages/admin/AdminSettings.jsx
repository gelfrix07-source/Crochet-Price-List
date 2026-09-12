import { useEffect, useState } from 'react'
import { useSiteSettings } from '../../contexts/SettingsContext.jsx'
import { updateSettings } from '../../services/settingsService'
import { uploadProductImage, deleteProductImage, getPublicImageUrl } from '../../services/storageService'
import { Spinner } from '../../components/LoadingStates'
import { ErrorState } from '../../components/EmptyState'

const EMPTY_FORM = {
  business_name: '',
  tagline: '',
  contact_url: '',
  welcome_message: '',
  tutorial_content: '',
  price_disclaimer: '',
}

export default function AdminSettings() {
  const { settings, loading, error, refresh } = useSiteSettings()
  const [form, setForm] = useState(EMPTY_FORM)
  const [logoFile, setLogoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!settings) return
    setForm({
      business_name: settings.business_name || '',
      tagline: settings.tagline || '',
      contact_url: settings.contact_url || '',
      welcome_message: settings.welcome_message || '',
      tutorial_content: settings.tutorial_content || '',
      price_disclaimer: settings.price_disclaimer || '',
    })
  }, [settings])

  const updateField = (field, value) => {
    setSaved(false)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      let logo_path = settings?.logo_path || null
      if (logoFile) {
        logo_path = await uploadProductImage(logoFile, 'branding')
        if (settings?.logo_path) {
          await deleteProductImage(settings.logo_path)
        }
      }
      await updateSettings(settings.id, { ...form, logo_path })
      await refresh()
      setLogoFile(null)
      setSaved(true)
    } catch (err) {
      console.error(err)
      setSaveError('We couldn\u2019t save your settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner label="Loading settings…" />
  if (error) return <ErrorState message={error} onRetry={refresh} />

  const logoUrl = logoFile ? URL.createObjectURL(logoFile) : getPublicImageUrl(settings?.logo_path)

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-heading text-2xl font-semibold text-ink">Settings</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="card flex flex-col gap-4 p-6">
          <h2 className="font-heading text-lg font-semibold text-ink">Business</h2>
          <div>
            <label className="label-field" htmlFor="business_name">Business Name</label>
            <input
              id="business_name"
              value={form.business_name}
              onChange={(e) => updateField('business_name', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="contact_url">Contact URL (e.g. Facebook Messenger link)</label>
            <input
              id="contact_url"
              type="url"
              value={form.contact_url}
              onChange={(e) => updateField('contact_url', e.target.value)}
              placeholder="https://m.me/yourpage"
              className="input-field"
            />
            <p className="mt-1 font-body text-xs text-ink-soft">
              This powers every "Message to Order" button across the site.
            </p>
          </div>
        </section>

        <section className="card flex flex-col gap-4 p-6">
          <h2 className="font-heading text-lg font-semibold text-ink">Customer Welcome</h2>
          <div>
            <label className="label-field" htmlFor="welcome_message">Welcome Message</label>
            <textarea
              id="welcome_message"
              rows={3}
              value={form.welcome_message}
              onChange={(e) => updateField('welcome_message', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="tutorial_content">Tutorial Instructions</label>
            <textarea
              id="tutorial_content"
              rows={3}
              value={form.tutorial_content}
              onChange={(e) => updateField('tutorial_content', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="price_disclaimer">Price Disclaimer</label>
            <textarea
              id="price_disclaimer"
              rows={2}
              value={form.price_disclaimer}
              onChange={(e) => updateField('price_disclaimer', e.target.value)}
              className="input-field"
            />
          </div>
        </section>

        <section className="card flex flex-col gap-4 p-6">
          <h2 className="font-heading text-lg font-semibold text-ink">Branding</h2>
          <div>
            <label className="label-field">Logo</label>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-cozy border-2 border-dashed border-ink/10 bg-surface-soft">
                {logoUrl ? (
                  <img src={logoUrl} alt="Business logo" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl" aria-hidden="true">🌷</span>
                )}
              </div>
              <label className="btn-secondary cursor-pointer !px-4 !py-2 text-sm">
                Upload Logo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          </div>
        </section>

        {saveError && <p className="font-body text-sm text-peach">{saveError}</p>}
        {saved && <p className="font-body text-sm text-olive">Settings saved.</p>}

        <button type="submit" disabled={saving} className="btn-primary w-fit">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
