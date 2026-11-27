import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Heart, PhotoFrame } from '@/shared/ui'
import { POLAROID_SLICES } from '../model/constants'
import { usePhotoDevelop } from '../model/usePhotoDevelop'
import { usePolaroidFlutter } from '../model/usePolaroidFlutter'
import s from './Polaroid.module.css'

type Props = { photo?: string; alt: string }

/**
 * 손에 쥐고 흔들면 현상되는 즉석 사진.
 * 종이가 휘어 보이도록 같은 내용을 가로 띠(slice) 여러 장으로 잘라
 * 아래에서부터 3D 로 이어 붙였다. 각 이음새가 조금씩 꺾이면 곡면처럼 보인다.
 * (맨 아래 띠가 손에 쥔 부분)
 */
export function Polaroid({ photo, alt }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { shake } = usePhotoDevelop(ref)
  usePolaroidFlutter(ref, shake)

  const content = (main: boolean) => (
    <>
      <div className={s.photo}>
        <PhotoFrame src={photo} alt={main ? alt : ''} label="Main Photo" eager className={s.photoImg} />
        {photo && (
          <>
            <div data-tint className={s.tint} />
            <div data-film className={s.film}>
              <span>shake it</span>
            </div>
          </>
        )}
      </div>
      <div className={s.caption}>
        SEONGWOOK <Heart width={13} /> JIMIN
      </div>
      <div data-shade className={s.shade} />
    </>
  )

  // 바깥(아래) 띠 안에 위쪽 띠가 중첩되는 사슬
  const slice = (i: number): ReactNode => (
    <div data-slice className={s.slice}>
      <div
        className={s.sliceContent}
        data-measure={i === 0 || undefined}
        aria-hidden={i === 0 ? undefined : true}
        style={{
          bottom: `calc(-${i} * var(--slice-h))`,
          // 자기 띠 구간만 남김 — 이음새가 벌어지지 않도록 위로 1px 겹침
          clipPath: `inset(calc(var(--h) - ${i + 1} * var(--slice-h) - 1px) 0 calc(${i} * var(--slice-h)) 0)`,
        }}
      >
        {content(i === 0)}
      </div>
      {i < POLAROID_SLICES - 1 && slice(i + 1)}
    </div>
  )

  return (
    <figure ref={ref} className={s.polaroid} style={{ '--n': POLAROID_SLICES } as CSSProperties}>
      <div className={s.shadow} aria-hidden="true" />
      {slice(0)}
    </figure>
  )
}
