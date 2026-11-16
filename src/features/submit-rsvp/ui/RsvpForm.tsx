import { useState, type FormEvent } from 'react'
import { submitRsvp, type RsvpMeal, type RsvpSide } from '@/entities/rsvp'
import { useToast } from '@/shared/ui'
import s from './RsvpForm.module.css'

type Option<T> = { value: T; label: string }

function Segmented<T extends string | boolean>({
  name,
  value,
  options,
  onChange,
}: {
  name: string
  value: T
  options: Option<T>[]
  onChange: (v: T) => void
}) {
  return (
    <div className={s.segmented} role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={s.segment}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function RsvpForm() {
  const toast = useToast()
  const [side, setSide] = useState<RsvpSide>('groom')
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(true)
  const [headcount, setHeadcount] = useState(1)
  const [meal, setMeal] = useState<RsvpMeal>('yes')
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || pending) return
    setPending(true)
    try {
      await submitRsvp({
        side,
        name: name.trim(),
        attending,
        headcount: attending ? headcount : 0,
        meal: attending ? meal : 'no',
      })
      setDone(true)
    } catch {
      toast('전송에 실패했어요. 잠시 후 다시 시도해 주세요')
    } finally {
      setPending(false)
    }
  }

  if (done) {
    return (
      <div className={s.done}>
        <p>소중한 회신 감사합니다.</p>
        <button type="button" className="ui-button ui-button--ghost" onClick={() => setDone(false)}>
          다시 작성하기
        </button>
      </div>
    )
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <label className={s.field}>
        <span>구분</span>
        <Segmented
          name="구분"
          value={side}
          onChange={setSide}
          options={[
            { value: 'groom', label: '신랑측' },
            { value: 'bride', label: '신부측' },
          ]}
        />
      </label>
      <label className={s.field}>
        <span>성함</span>
        <input
          className="ui-input"
          value={name}
          maxLength={20}
          onChange={(e) => setName(e.target.value)}
          placeholder="성함을 입력해 주세요"
        />
      </label>
      <label className={s.field}>
        <span>참석 여부</span>
        <Segmented
          name="참석 여부"
          value={attending}
          onChange={setAttending}
          options={[
            { value: true, label: '참석' },
            { value: false, label: '불참' },
          ]}
        />
      </label>
      {attending && (
        <>
          <label className={s.field}>
            <span>인원</span>
            <div className={s.stepper}>
              <button type="button" onClick={() => setHeadcount((n) => Math.max(1, n - 1))} aria-label="인원 줄이기">
                −
              </button>
              <output>{headcount}명</output>
              <button type="button" onClick={() => setHeadcount((n) => Math.min(10, n + 1))} aria-label="인원 늘리기">
                +
              </button>
            </div>
          </label>
          <label className={s.field}>
            <span>식사</span>
            <Segmented
              name="식사"
              value={meal}
              onChange={setMeal}
              options={[
                { value: 'yes', label: '예정' },
                { value: 'no', label: '안함' },
                { value: 'undecided', label: '미정' },
              ]}
            />
          </label>
        </>
      )}
      <button className="ui-button" disabled={pending || !name.trim()}>
        {pending ? '전송 중...' : '참석 의사 전달하기'}
      </button>
    </form>
  )
}
