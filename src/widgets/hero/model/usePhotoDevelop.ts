import { useCallback, useEffect, useRef } from 'react'
import { clamp } from '@/shared/lib'

/** 가만히 둬도 다 현상되는 시간 (ms) */
const AUTO_MS = 9000
/** 흔드는 속도(px/frame) 1 당 앞당겨지는 진행도 */
const SHAKE_GAIN = 0.0009

const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * 즉석 사진이 현상되는 효과.
 * - 사진이 로드되면 어두운 필름 상태에서 천천히 저절로 현상된다
 * - 폴라로이드를 흔들면(shake) 더 빨리 현상된다
 * - 진행도는 리렌더 없이 오버레이 opacity 로만 반영
 */
export function usePhotoDevelop() {
  const filmRef = useRef<HTMLDivElement>(null) // 현상 전 어두운 막
  const tintRef = useRef<HTMLDivElement>(null) // 색이 덜 올라온 바랜 톤
  const progress = useRef(0)
  const boost = useRef(0)
  const started = useRef(false)

  const apply = (p: number) => {
    if (filmRef.current) filmRef.current.style.opacity = String(1 - smooth(0, 0.75, p))
    if (tintRef.current) tintRef.current.style.opacity = String(1 - smooth(0.35, 1, p))
  }

  useEffect(() => {
    const film = filmRef.current
    const img = film?.parentElement?.querySelector('img')
    if (!img) return
    let raf = 0
    let last = 0

    const tick = (now: number) => {
      const dt = Math.min(64, now - (last || now))
      last = now
      progress.current = clamp(progress.current + dt / AUTO_MS + boost.current)
      boost.current = 0
      apply(progress.current)
      raf = progress.current < 1 ? requestAnimationFrame(tick) : 0
    }
    const begin = () => {
      started.current = true
      raf = requestAnimationFrame(tick)
    }

    apply(0)
    if (img.complete && img.naturalWidth) begin()
    else img.addEventListener('load', begin, { once: true })
    return () => {
      cancelAnimationFrame(raf)
      img.removeEventListener('load', begin)
    }
  }, [])

  /** 흔들기 속도를 받아 현상을 앞당긴다 */
  const shake = useCallback((speed: number) => {
    if (started.current) boost.current += speed * SHAKE_GAIN
  }, [])

  return { filmRef, tintRef, shake }
}
