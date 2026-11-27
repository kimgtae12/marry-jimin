import { useEffect, useRef, type RefObject } from 'react'
import { clamp } from '@/shared/lib'

/** 손목(맨 아래 띠)에서 앞뒤로 젖혀지는 최대 각도 (deg) */
const MAX_FLAP = 24
/** 종이가 휘는 최대 각도 — 맨 아래에서 맨 위까지 꺾이는 합 (deg) */
const MAX_BEND = 70

type Spring = { v: number; vel: number }

/** 감쇠 스프링 한 프레임 (step = 60fps 기준 프레임 수) */
const springTo = (s: Spring, target: number, k: number, damping: number, step: number) => {
  s.vel += ((target - s.v) * k - s.vel * damping) * step
  s.v += s.vel * step
}

/**
 * 즉석 사진을 인화할 때처럼 아래 테두리를 쥐고 흔드는 동작.
 * - 손가락을 좌우로 문지르면 그 속도만큼 앞뒤로(rotateX) 젖혀지고,
 *   위쪽은 한 박자 늦게 따라오며 종이처럼 휜다 (띠마다 조금씩 꺾음)
 * - 가로 드래그만 잡고(touch-action: pan-y), 세로는 그대로 페이지 스크롤
 * - React 리렌더 없이 requestAnimationFrame 으로 transform 만 갱신
 */
export function usePolaroidFlutter(ref: RefObject<HTMLElement | null>, onShake?: (speed: number) => void) {
  const onShakeRef = useRef(onShake)
  useEffect(() => {
    onShakeRef.current = onShake
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const slices = [...el.querySelectorAll<HTMLElement>('[data-slice]')]
    if (!slices.length) return
    const shades = slices.map((sl) => sl.firstElementChild?.querySelector<HTMLElement>('[data-shade]') ?? null)
    const joints = Math.max(1, slices.length - 1)
    // 바닥 그림자는 휘지 않으므로, 움직이는 동안엔 원래 자리 윤곽이 남지 않게 흐리게
    const shadow = el.querySelector<HTMLElement>('[data-shadow]')

    // 띠를 자르는 기준 높이 = 실제 내용 높이
    const measure = el.querySelector<HTMLElement>('[data-measure]')
    const ro = new ResizeObserver(() => {
      if (measure) el.style.setProperty('--h', `${measure.offsetHeight}px`)
    })
    if (measure) ro.observe(measure)

    const flap: Spring = { v: 0, vel: 0 } // 손목에서 젖혀지는 각도
    const bend: Spring = { v: 0, vel: 0 } // 종이가 휘는 정도

    let dragging = false
    let pointerId = -1
    let fingerX = 0
    let prevFingerX = 0
    let speed = 0 // 손가락 속도 (px/frame, 부드럽게)
    let raf = 0
    let last = 0

    const render = () => {
      const per = bend.v / joints
      slices.forEach((sl, i) => {
        const a = i === 0 ? flap.v : per
        sl.style.transform = `rotateX(${a.toFixed(2)}deg)`
        // 꺾인 만큼 살짝 어둡게 — 곡면에 빛이 다르게 닿는 느낌
        // 띠 경계가 줄무늬로 보이지 않을 만큼만 (띠 가운데 각도 기준)
        const total = Math.abs(flap.v + per * (i + 0.5))
        const shade = shades[i]
        if (shade) shade.style.opacity = String(Math.min(0.12, total / 420))
      })
      if (shadow) shadow.style.opacity = String(clamp(1 - (Math.abs(flap.v) + Math.abs(bend.v) * 0.5) / 6))
    }
    const reset = () => {
      slices.forEach((sl) => (sl.style.transform = ''))
      shades.forEach((sh) => sh && (sh.style.opacity = ''))
      if (shadow) shadow.style.opacity = ''
    }

    const tick = (now: number) => {
      const step = clamp((now - (last || now - 16.7)) / 16.7, 0.5, 3)
      last = now

      if (dragging) {
        const raw = (fingerX - prevFingerX) / step
        prevFingerX = fingerX
        speed += (raw - speed) * 0.5
        onShakeRef.current?.(Math.abs(speed))
        springTo(flap, clamp(speed * 1.8, -MAX_FLAP, MAX_FLAP), 0.16, 0.24, step)
      } else {
        speed = 0
        springTo(flap, 0, 0.1, 0.14, step)
      }
      // 위쪽은 관성으로 늦게 따라옴 → 손목이 움직이는 반대쪽으로 휨
      springTo(bend, clamp(-flap.vel * 9, -MAX_BEND, MAX_BEND), 0.14, 0.13, step)
      flap.v = clamp(flap.v, -MAX_FLAP, MAX_FLAP)
      bend.v = clamp(bend.v, -MAX_BEND, MAX_BEND)
      render()

      const settled =
        !dragging &&
        Math.abs(flap.v) < 0.05 && Math.abs(flap.vel) < 0.02 &&
        Math.abs(bend.v) < 0.05 && Math.abs(bend.vel) < 0.02
      if (settled) {
        raf = 0
        reset()
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
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [ref])
}
