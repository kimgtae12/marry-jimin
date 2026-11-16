/** Supabase 미연결 시 사용하는 데모용 저장소 */
export const localStore = {
  list<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T[]) : []
    } catch {
      return []
    }
  },
  prepend<T>(key: string, item: T): void {
    try {
      const next = [item, ...localStore.list<T>(key)]
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* storage 차단 환경 — 무시 */
    }
  },
}
