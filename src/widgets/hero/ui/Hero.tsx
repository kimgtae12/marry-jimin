import { wedding } from '@/entities/wedding'
import { Heart, Ornament, PhotoFrame } from '@/shared/ui'
import { usePhotoDevelop } from '../model/usePhotoDevelop'
import { usePolaroidFlutter } from '../model/usePolaroidFlutter'
import s from './Hero.module.css'

/** 편지가 펼쳐진 뒤 처음 보이는 화면 — 큰 폴라로이드 */
export function Hero() {
  const { filmRef, tintRef, shake } = usePhotoDevelop()
  const polaroidRef = usePolaroidFlutter<HTMLElement>(shake)
  return (
    <section className={s.hero} id="main">
      <Ornament size={16} />
      <p className={s.kicker}>WITH LOVE</p>
      <h1 className={s.script}>{wedding.intro.title}</h1>

      <figure ref={polaroidRef} className={s.polaroid}>
        <div className={s.photo}>
          <PhotoFrame src={wedding.mainPhoto} alt="신랑 신부 메인 사진" label="Main Photo" eager className={s.photoImg} />
          {wedding.mainPhoto && (
            <>
              <div ref={tintRef} className={s.tint} aria-hidden="true" />
              <div ref={filmRef} className={s.film} aria-hidden="true">
                <span>shake it</span>
              </div>
            </>
          )}
        </div>
        <figcaption className={s.caption}>
          SEONGWOOK <Heart width={13} /> JIMIN
        </figcaption>
      </figure>

      <p className={s.venue}>
        {wedding.venue.name} {wedding.venue.hall}
      </p>
      <p className={s.date}>{wedding.dateLabel}</p>

      <span className={s.scroll} aria-hidden="true" />
    </section>
  )
}
