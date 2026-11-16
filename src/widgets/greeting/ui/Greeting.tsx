import { wedding } from '@/entities/wedding'
import { Section } from '@/shared/ui'
import s from './Greeting.module.css'

export function Greeting() {
  const { intro, groom, bride } = wedding
  return (
    <Section id="greeting" title="Invitation">
      <blockquote className={s.quote}>
        {intro.quote.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <cite>— {intro.quoteSource} —</cite>
      </blockquote>

      <div className={s.body}>
        {intro.body.map((para, i) => (
          <p key={i}>
            {para.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        ))}
      </div>

      <dl className={s.parents}>
        <div>
          <dt>
            {groom.father} · {groom.mother}
            <small>의 아들</small>
          </dt>
          <dd>{groom.firstName}</dd>
        </div>
        <div>
          <dt>
            {bride.mother}
            <small>의 딸</small>
          </dt>
          <dd>{bride.firstName}</dd>
        </div>
      </dl>
    </Section>
  )
}
