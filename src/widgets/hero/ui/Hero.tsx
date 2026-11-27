import { wedding } from '@/entities/wedding'
import { Ornament } from '@/shared/ui'
import s from './Hero.module.css'
import { Polaroid } from './Polaroid'

/** 편지가 펼쳐진 뒤 처음 보이는 화면 — 큰 폴라로이드 */
export function Hero() {
  return (
    <section className={s.hero} id="main">
      <Ornament size={16} />
      <p className={s.kicker}>WITH LOVE</p>
      <h1 className={s.script}>{wedding.intro.title}</h1>

      <Polaroid photo={wedding.mainPhoto} alt="신랑 신부 메인 사진" />

      <p className={s.venue}>
        {wedding.venue.name} {wedding.venue.hall}
      </p>
      <p className={s.date}>{wedding.dateLabel}</p>

      <span className={s.scroll} aria-hidden="true" />
    </section>
  )
}
