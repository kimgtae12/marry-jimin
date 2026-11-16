import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EnvelopeFront } from './EnvelopeFront'
import s from './LetterEnvelope.module.css'

type Props = {
  children: ReactNode
  /** 상단 바 문구 */
  label?: string
  /** 앞주머니 하단 문구 */
  caption?: string
  /** 앞주머니 문구 출처 */
  captionSource?: string
  /** true 면 봉투 없이 일반 페이지로 렌더 (모션 최소화 등 폴백) */
  disabled?: boolean
}

/** 스크롤이 이만큼 내려가면 '편지를 꺼낸' 상태 */
const OPEN_THRESHOLD = 4

/**
 * 청첩장 본문 전체가 한 장의 긴 편지지.
 * - 최상단: 편지가 살짝 작게 봉투 주머니에 꽂혀 있음 (메인 폴라로이드가 바로 보임)
 * - 스크롤: 편지가 화면 폭으로 펼쳐지고 주머니가 내려가며,
 *   이후 편지가 하단에 고정된 주머니 뒤에서 계속 빠져나온다.
 * - 다시 최상단으로 오면 편지가 주머니에 꽂힌 모습으로 돌아간다.
 */
export function LetterEnvelope({ children, label = 'WE INVITE YOU', caption = '', captionSource, disabled }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const el = viewportRef.current
    if (!el || disabled) return
    const onScroll = () => setOpened(el.scrollTop > OPEN_THRESHOLD)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [disabled])

  if (disabled) {
    return (
      <div className={s.wrapper} data-disabled>
        <div className={s.viewport}>
          <div className={s.card}>{children}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={s.wrapper} data-opened={opened}>
      <div className={s.topBar} aria-hidden="true">
        {label}
      </div>

      <div ref={viewportRef} className={s.viewport}>
        <div className={s.card}>{children}</div>
      </div>

      <div className={s.front}>
        <EnvelopeFront caption={caption} captionSource={captionSource} />
      </div>
    </div>
  )
}
