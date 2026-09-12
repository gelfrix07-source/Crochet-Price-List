import { Link } from 'react-router-dom'
import { useSiteSettings } from '../../contexts/SettingsContext.jsx'
import { Spinner } from '../../components/LoadingStates'

const STEPS = [
  { number: '01', title: 'Browse', text: 'Look through the crochet products.' },
  { number: '02', title: 'Check', text: 'Tap a product to see its picture, price, and notes.' },
  { number: '03', title: 'Choose', text: 'Take note of the product you want.' },
  { number: '04', title: 'Message', text: 'Click "Message to Order" to contact AXKN07 Crochet.' },
]

export default function Home() {
  const { settings, loading } = useSiteSettings()

  if (loading) return <Spinner label="Loading…" />

  const businessName = settings?.business_name || 'AXKN07 Crochet'
  const welcomeMessage =
    settings?.welcome_message ||
    'Browse our handmade crochet pieces, check their prices, and find something special for yourself or someone you love.'

  return (
    <div>
      <section className="bg-peach-fade">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="mb-4 text-5xl" aria-hidden="true">
            🌷
          </span>
          <h1 className="font-heading text-3xl font-semibold text-ink sm:text-4xl">
            Welcome to {businessName}
          </h1>
          {settings?.tagline && (
            <p className="mt-2 font-body text-base text-peach">{settings.tagline}</p>
          )}
          <p className="mt-4 max-w-xl font-body text-base text-ink-soft sm:text-lg">{welcomeMessage}</p>
          <Link to="/prices" className="btn-primary mt-8 !px-8 !py-4 text-base">
            View Price List
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="mb-8 text-center font-heading text-2xl font-semibold text-ink">
          How to Use This Price List
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="card flex flex-col gap-2 p-5">
              <span className="font-heading text-3xl font-semibold text-clover">{step.number}</span>
              <h3 className="font-heading text-lg font-semibold text-ink">{step.title}</h3>
              <p className="font-body text-sm text-ink-soft">{step.text}</p>
            </div>
          ))}
        </div>

        {settings?.tutorial_content && (
          <p className="mx-auto mt-8 max-w-2xl text-center font-body text-sm text-ink-soft">
            {settings.tutorial_content}
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/prices" className="btn-primary !px-8 !py-4 text-base">
            View Price List
          </Link>
        </div>
      </section>
    </div>
  )
}
