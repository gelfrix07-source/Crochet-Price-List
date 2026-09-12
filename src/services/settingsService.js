import { supabase } from '../lib/supabase'

// The app expects exactly one site_settings row to exist (created by the migration script).
export async function fetchSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
  if (error) throw error
  return data
}

export async function updateSettings(id, updates) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Builds the "Message to Order" link. Supports Messenger-style URLs (appends ?ref=... isn't
// reliable across providers) so we append the pre-filled text as a query param recognized by
// Messenger's m.me links, and fall back to just opening the URL for anything else.
export function buildMessageLink(contactUrl, message) {
  if (!contactUrl) return null

  try {
    const url = new URL(contactUrl)
    if (url.hostname.includes('m.me') || url.hostname.includes('messenger.com')) {
      url.searchParams.set('text', message)
      return url.toString()
    }
    return contactUrl
  } catch {
    return contactUrl
  }
}
