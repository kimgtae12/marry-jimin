import { localStore, supabase } from '@/shared/api'
import type { NewRsvp } from '../model/types'

const LOCAL_KEY = 'marry-jimin:rsvp'

/** 응답은 공개 조회하지 않으므로 insert 만 한다 (RLS: select 정책 없음) */
export async function submitRsvp(rsvp: NewRsvp): Promise<void> {
  if (!supabase) {
    localStore.prepend(LOCAL_KEY, { ...rsvp, created_at: new Date().toISOString() })
    return
  }
  const { error } = await supabase.from('rsvp').insert(rsvp)
  if (error) throw error
}
