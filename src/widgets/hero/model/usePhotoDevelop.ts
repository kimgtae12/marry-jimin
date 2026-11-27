import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { clamp } from '@/shared/lib'

/**
 * 흔드는 속도(px/frame) 1 당 진행도.
 * 힘차게(≈10px/frame) 흔들면 3~4초 정도에 다 현상된다.
 */
const SHAKE_GAIN = 0.00045

const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * 즉석 사진 현상 효과 — 흔드는 동안에만 현상되고, 멈추면 그 상태로 멈춘다.
 * 어두운 필름 막 → 바랜 갈색 톤 → 원래 색 순서로 드러난다.
 * 진행도는 리렌더 없이 오버레이 opacity 로만 반영 (휘는 띠마다 같은 오버레이가 있어 전부 갱신)
 */
export function usePhotoDevelop(rootRef: RefObject<HTMLElement | null>) {
  const progress = useRef(0)
  const films = useRef<HTMLElement[]>([])
  const tints = useRef<HTMLElement[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    films.current = [...root.querySelectorAll<HTMLElement>('[data-film]')]
    tints.current = [...root.querySelectorAll<HTMLElement>('[data-tint]')]
  }, [rootRef])

  /** 흔드는 속도를 받아 현상을 진행한다 */
  const shake = useCallback((speed: number) => {
    if (progress.current >= 1) return
    progress.current = clamp(progress.current + speed * SHAKE_GAIN)
    const p = progress.current
    const film = String(1 - smooth(0, 0.75, p))
    const tint = String(1 - smooth(0.35, 1, p))
    films.current.forEach((el) => (el.style.opacity = film))
    tints.current.forEach((el) => (el.style.opacity = tint))
  }, [])

  return { shake }
}
