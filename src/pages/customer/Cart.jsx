import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { useCart } from '../../contexts/CartContext.jsx'
import { useSiteSettings } from '../../contexts/SettingsContext.jsx'
import { getPublicImageUrl } from '../../services/storageService'
import { buildMessageLink } from '../../services/settingsService'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const { settings } = useSiteSettings()
  const receiptRef = useRef(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const buildOrderText = () => {
    const lines = items.map(
      (item) => `${item.name} x${item.quantity} - ₱${formatPrice(Number(item.price) * item.quantity)}`
    )
    lines.push('', `Total: ₱${formatPrice(totalPrice)}`)
    return lines.join('\n')
  }

  const handleCopyList = async () => {
    try {
      await navigator.clipboard.writeText(buildOrderText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleGenerateImage = async () => {
    if (!receiptRef.current) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(receiptRef.current, { backgroundColor: '#FBF6EE', scale: 2 })
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setGenerating(false)
          return
        }
        const fileName = `order-${Date.now()}.png`
        const file = new File([blob], fileName, { type: 'image/png' })

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'My Order', text: "Here's my order list!" })
          } catch {
            downloadBlob(blob, fileName)
          }
        } else {
          downloadBlob(blob, fileName)
        }
        setGenerating(false)
      }, 'image/png')
    } catch (err) {
      console.error(err)
      setGenerating(false)
    }
  }

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const messageLink = settings?.contact_url
    ? buildMessageLink(settings.contact_url, `Hi! Here's my order:\n${buildOrderText()}`)
    : null

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="text-5xl" aria-hidden="true">🧺</span>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-ink">Your cart is empty</h1>
        <p className="mt-2 font-body text-sm text-ink-soft">
          Browse the price list and add items you'd like to order.
        </p>
        <Link to="/prices" className="btn-primary mt-6 inline-flex">
          Browse Price List
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-heading text-2xl font-semibold text-ink">Your Order List</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="card flex items-center gap-3 p-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-cozy bg-daisy/40">
              {getPublicImageUrl(item.image_path) ? (
                <img
                  src={getPublicImageUrl(item.image_path)}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">🧶</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-heading text-sm font-semibold text-ink">{item.name}</p>
              <p className="font-body text-sm text-ink-soft">₱{formatPrice(item.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-7 w-7 rounded-full border border-ink/10 font-body text-sm text-ink hover:bg-daisy/40"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center font-body text-sm text-ink">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-7 w-7 rounded-full border border-ink/10 font-body text-sm text-ink hover:bg-daisy/40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-2 font-body text-xs font-semibold text-blush hover:underline"
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4">
        <span className="font-heading text-lg font-semibold text-ink">Total</span>
        <span className="font-heading text-xl font-semibold text-peach">₱{formatPrice(totalPrice)}</span>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {messageLink && (
          <a href={messageLink} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
            💬 Message to Order
          </a>
        )}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={handleCopyList} className="btn-secondary flex-1">
            {copied ? '✓ Copied!' : '📋 Copy List'}
          </button>
          <button onClick={handleGenerateImage} disabled={generating} className="btn-secondary flex-1">
            {generating ? 'Generating…' : '🖼️ Generate Image'}
          </button>
        </div>
        <button onClick={clearCart} className="font-body text-sm font-semibold text-blush hover:underline">
          Clear Cart
        </button>
      </div>

      <p className="mt-3 text-center font-body text-xs text-ink-soft">
        This creates a list of your order to send us — it's not a purchase or payment.
      </p>

      <div className="pointer-events-none fixed left-[-9999px] top-0">
        <div ref={receiptRef} className="w-[380px] bg-[#FBF6EE] p-6 font-body">
          <div className="mb-4 text-center">
            <h2 className="font-heading text-lg font-bold text-ink">
              {settings?.business_name || 'AXKN07 Crochet'}
            </h2>
            <p className="text-xs text-ink-soft">Order Summary</p>
            <p className="text-xs text-ink-soft">{new Date().toLocaleString()}</p>
          </div>
          <div className="border-t border-dashed border-ink/30 py-3">
            {items.map((item) => (
              <div key={item.id} className="mb-2 flex justify-between text-sm text-ink">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>₱{formatPrice(Number(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-dashed border-ink/30 pt-3 font-heading text-base font-bold text-ink">
            <span>Total</span>
            <span>₱{formatPrice(totalPrice)}</span>
          </div>
          <p className="mt-4 text-center text-[11px] text-ink-soft">
            Thank you! Send this list to confirm your order 🧡
          </p>
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
