import { RsvpForm } from '@/features/submit-rsvp'
import { Section } from '@/shared/ui'
import s from './Rsvp.module.css'

export function Rsvp() {
  return (
    <Section id="rsvp" title="R.S.V.P" subtitle="참석 여부">
      <p className={s.desc}>
        원활한 예식 준비를 위해
        <br />
        참석 여부를 미리 알려주시면 감사하겠습니다.
      </p>
      <div className={s.card}>
        <RsvpForm />
      </div>
      <footer className={s.footer}>
        <p className={s.script}>Thank you</p>
        <p>SUNGWOOK &amp; JIMIN</p>
      </footer>
    </Section>
  )
}
