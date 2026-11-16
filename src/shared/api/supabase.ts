import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/shared/config'

/** env 가 비어 있으면 null — 호출부에서 localStorage 폴백을 사용한다. */
export const supabase: SupabaseClient | null =
  env.supabaseUrl && env.supabaseAnonKey
    ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
        auth: { persistSession: false },
      })
    : null
