import { useEffect, useRef } from 'react'
import { clamp } from '@/shared/lib'

/** 평소 기울기 (deg) */
const BASE_ANGLE = -1.2
/** 앞뒤로 젖혀지는 최대 각도 (deg) */
const MAX_FLAP = 28

type Spring = { v: number; vel: number }

/** 감쇠 스프링 한 프레임 (step = 60fps 기준 프레임 수) */
const springTo = (s: Spring, target: number, k: number, damping: number, step: number) => {
  s.vel += ((target - s.v) * k - s.vel * damping) * step
  s.v += s.vel * step
}

/**
 * 즉석 사진을 인화할 때처럼, 아래 테두리를 손에 쥐고 흔들면
 * 폴라로이드가 앞뒤로(rotateX) 펄럭이다가 제자리로 돌아온다.
 * - 손가락을 좌우로 문지르면 그 속도만큼 앞뒤로 젖혀짐 (자리는 그대로)
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

    const flap: Spring = { v: 0, vel: 0 }

    let dragging = false
    let pointerId = -1
    let fingerX = 0
    let prevFingerX = 0
    let speed = 0 // 손가락 속도 (px/frame, 부드럽게)
    let raf = 0
    let last = 0

    const render = () => {
      el.style.transform = `perspective(600px) rotate(${BASE_ANGLE}deg) rotateX(${flap.v.toFixed(2)}deg)`
    }

    const tick = (now: number) => {
      const step = clamp((now - (last || now - 16.7)) / 16.7, 0.5, 3)
      last = now

      if (dragging) {
        const raw = (fingerX - prevFingerX) / step
        prevFingerX = fingerX
        speed += (raw - speed) * 0.5
        onShakeRef.current?.(Math.abs(speed))
        // 손을 흔드는 방향에 따라 앞/뒤로 젖혀짐
        springTo(flap, clamp(speed * 2.2, -MAX_FLAP, MAX_FLAP), 0.16, 0.22, step)
      } else {
        speed = 0
        // 놓으면 몇 번 펄럭이다 멈춤
        springTo(flap, 0, 0.1, 0.12, step)
      }
      flap.v = clamp(flap.v, -MAX_FLAP, MAX_FLAP)
      render()

      if (!dragging && Math.abs(flap.v) < 0.05 && Math.abs(flap.vel) < 0.02) {
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
      fingerX = prevFingerX = e.clientX
      start()
    }
    const onMove = (e: PointerEvent) => {
      if (dragging && e.pointerId === pointerId) fingerX = e.clientX
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
