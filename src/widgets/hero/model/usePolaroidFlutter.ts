import { useEffect, useRef } from 'react'
import { clamp } from '@/shared/lib'

/** 평소 기울기 (deg) */
const BASE_ANGLE = -1.2
/** 손을 따라가는 최대 거리 (px) */
const MAX_X = 70
/** 손가락 이동 대비 실제 이동 비율 — 살짝 무겁게 */
const DRAG_RATIO = 0.55
/** 세게 흔들어도 넘지 않는 한계 (deg) — 옆면이 보일 만큼 돌지 않도록 */
const MAX_ANGLE = 14
const MAX_FLAP = 32

type Spring = { v: number; vel: number }

/** 감쇠 스프링 한 프레임 (step = 60fps 기준 프레임 수) */
const springTo = (s: Spring, target: number, k: number, damping: number, step: number) => {
  s.vel += ((target - s.v) * k - s.vel * damping) * step
  s.v += s.vel * step
}

/**
 * 폴라로이드를 좌우로 잡고 흔들면 종이처럼 팔랑이다가 제자리로 돌아온다.
 * - 가로 드래그만 잡고(touch-action: pan-y), 세로는 그대로 페이지 스크롤
 * - React 리렌더 없이 requestAnimationFrame 으로 transform 만 갱신
 */
export function usePolaroidFlutter<T extends HTMLElement>(onShake?: (speed: number) => void) {
  const ref = useRef<T>(null)
  const onShakeRef = useRef(onShake)
  useEffect(() => {
    onShakeRef.current = onShake
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const x: Spring = { v: 0, vel: 0 }
    const angle: Spring = { v: BASE_ANGLE, vel: 0 }
    const flap: Spring = { v: 0, vel: 0 } // rotateY — 종이가 펄럭이는 느낌

    let dragging = false
    let pointerId = -1
    let startX = 0
    let dragX = 0
    let raf = 0
    let last = 0

    const render = () => {
      el.style.transform =
        `perspective(700px) translate3d(${x.v.toFixed(2)}px,0,0) ` +
        `rotate(${angle.v.toFixed(2)}deg) rotateY(${flap.v.toFixed(2)}deg)`
    }

    const tick = (now: number) => {
      const step = clamp((now - (last || now - 16.7)) / 16.7, 0.5, 3)
      last = now
      const prevX = x.v

      if (dragging) {
        x.vel = 0
        x.v += (dragX - x.v) * Math.min(1, 0.45 * step)
      } else {
        springTo(x, 0, 0.09, 0.28, step)
      }
      // 프레임당 이동량 = 흔드는 속도
      const speed = (x.v - prevX) / step
      if (dragging) onShakeRef.current?.(Math.abs(speed))

      // 흔드는 방향으로 기울고, 놓으면 살랑살랑 진동하며 복귀
      springTo(angle, BASE_ANGLE + clamp(speed * 1.4 + x.v * 0.06, -10, 10), 0.12, 0.2, step)
      springTo(flap, clamp(-speed * 2.6, -24, 24), 0.1, 0.17, step)
      angle.v = clamp(angle.v, BASE_ANGLE - MAX_ANGLE, BASE_ANGLE + MAX_ANGLE)
      flap.v = clamp(flap.v, -MAX_FLAP, MAX_FLAP)

      render()

      const settled =
        !dragging &&
        Math.abs(x.v) < 0.1 && Math.abs(x.vel) < 0.05 &&
        Math.abs(angle.v - BASE_ANGLE) < 0.05 && Math.abs(angle.vel) < 0.02 &&
        Math.abs(flap.v) < 0.05 && Math.abs(flap.vel) < 0.02
      if (settled) {
        raf = 0
        el.style.transform = ''
        return
      }
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }

    const onDown = (e: PointerEvent) => {
      if (dragging) return
      dragging = true
      pointerId = e.pointerId
      startX = e.clientX - x.v / DRAG_RATIO
      dragX = x.v
      start()
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return
      const raw = (e.clientX - startX) * DRAG_RATIO
      // 끝으로 갈수록 저항
      dragX = MAX_X * Math.tanh(raw / MAX_X)
    }
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      dragging = false
      pointerId = -1
      start()
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return ref
}
