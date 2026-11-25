import { useEffect, useRef, useState } from 'react'
import { publicUrl } from '@/shared/lib'
import s from './BgmToggle.module.css'

const SRC = publicUrl('audio/bgm.m4a')

/** 브라우저가 '사용자 동작'으로 인정해 재생을 허용하는 이벤트 */
const UNLOCK_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'] as const

/**
 * 배경음악 on/off 버튼.
 * 모바일 브라우저는 자동재생을 막으므로, 첫 터치 때 재생을 시작한다.
 * 사용자가 버튼으로 직접 끄거나 켜면 그 뒤로는 버튼만 따른다.
 */
export function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const touchedRef = useRef(false)
  const [playing, setPlaying] = useState(false)

  // 첫 터치에 재생 시도
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const unlock = (e: Event) => {
      if (touchedRef.current) return cleanup()
      // 버튼을 누른 경우는 toggle 이 처리 (여기서 켜면 곧바로 다시 꺼짐)
      if (buttonRef.current?.contains(e.target as Node)) return
      audio
        .play()
        .then(cleanup)
        .catch(() => {}) // 아직 허용 안 됨 — 다음 동작에서 재시도
    }
    const cleanup = () => UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, unlock))
    UNLOCK_EVENTS.forEach((e) => window.addEventListener(e, unlock, { passive: true }))
    return cleanup
  }, [])

  // 다른 앱/탭으로 나가면 멈췄다가, 돌아오면 이어서
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    let resume = false
    const onVisibility = () => {
      if (document.hidden) {
        resume = !audio.paused
        audio.pause()
      } else if (resume) {
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    touchedRef.current = true
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        ref={buttonRef}
        type="button"
        className={s.button}
        data-playing={playing}
        onClick={toggle}
        aria-label={playing ? '배경음악 끄기' : '배경음악 켜기'}
        aria-pressed={playing}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" />
          {playing ? (
            <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M15.2 9.2a4 4 0 0 1 0 5.6" />
              <path d="M17.6 6.8a7.4 7.4 0 0 1 0 10.4" />
            </g>
          ) : (
            <path d="M15.5 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </>
  )
}
