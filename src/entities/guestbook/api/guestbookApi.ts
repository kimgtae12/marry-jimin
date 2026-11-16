import { localStore, supabase } from '@/shared/api'
import type { GuestbookEntry, NewGuestbookEntry } from '../model/types'

const TABLE = 'guestbook'
const LOCAL_KEY = 'marry-jimin:guestbook'

export async function fetchGuestbook(limit = 50): Promise<GuestbookEntry[]> {
  if (!supabase) return localStore.list<GuestbookEntry>(LOCAL_KEY).slice(0, limit)

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as GuestbookEntry[]
}

export async function createGuestbook(entry: NewGuestbookEntry): Promise<GuestbookEntry> {
  if (!supabase) {
    const local: GuestbookEntry = {
      ...entry,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    localStore.prepend(LOCAL_KEY, local)
    return local
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(entry)
    .select('id, name, message, created_at')
    .single()
  if (error) throw error
  return data as GuestbookEntry
}
