import { wedding } from '@/entities/wedding'
import { buildMonthMatrix, getDday } from '@/shared/lib'
import { Section } from '@/shared/ui'
import s from './WeddingCalendar.module.css'

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_EN = new Intl.DateTimeFormat('en-US', { month: 'long' })

export function WeddingCalendar() {
  const { date } = wedding
  const weeks = buildMonthMatrix(date.getFullYear(), date.getMonth())
  const dday = getDday(date)
  const ddayLabel = dday > 0 ? `D-${dday}` : dday === 0 ? 'D-DAY' : `D+${-dday}`

  return (
    <Section id="date" title="Date" tone="brown">
      <p className={s.month}>{MONTH_EN.format(date)}.</p>

      <table className={s.calendar}>
        <thead>
          <tr>
            {WEEK.map((d, i) => (
              <th key={i} data-sun={i === 0}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, r) => (
            <tr key={r}>
              {week.map((day, c) => {
                const isDay = day === date.getDate()
                return (
                  <td key={c} data-sun={c === 0} data-day={isDay}>
                    <span>{day ?? ''}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className={s.full}>Sunday, 21 February 2027 · PM 2:00</p>

      <p className={s.dday}>{ddayLabel}</p>
      <p className={s.ddayCaption}>
        {wedding.groom.firstName} · {wedding.bride.firstName}의 결혼식이{' '}
        {dday > 0 ? (
          <>
            <b>{dday}일</b> 남았습니다
          </>
        ) : dday === 0 ? (
          '오늘입니다'
        ) : (
          '있었습니다'
        )}
      </p>
    </Section>
  )
}
