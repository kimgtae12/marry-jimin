export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.trim() || undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || undefined,
} as const
