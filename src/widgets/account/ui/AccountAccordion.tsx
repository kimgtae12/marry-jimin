import { useState } from 'react'
import { wedding, type AccountGroup } from '@/entities/wedding'
import { CopyButton } from '@/features/copy-account'
import { Section } from '@/shared/ui'
import s from './AccountAccordion.module.css'

function Group({ group, open, onToggle }: { group: AccountGroup; open: boolean; onToggle: () => void }) {
  return (
    <div className={s.group} data-open={open}>
      <button type="button" className={s.head} onClick={onToggle} aria-expanded={open}>
        {group.label}에게
        <span className={s.chevron} aria-hidden="true" />
      </button>
      {/* grid-rows 0fr→1fr 로 접고 펼치는 애니메이션 */}
      <div className={s.body}>
        <ul className={s.items}>
          {group.accounts.map((a) => (
            <li key={`${a.role}-${a.name}`} className={s.item}>
              <div className={s.info}>
                <p className={s.who}>
                  <small>{a.role}</small> {a.name}
                </p>
                {a.number ? (
                  <p className={s.number}>
                    {a.bank} {a.number}
                    {a.holder && <small> (예금주 {a.holder})</small>}
                  </p>
                ) : (
                  <p className={s.number}>계좌 정보 준비 중</p>
                )}
              </div>
              {a.number && <CopyButton text={`${a.bank} ${a.number}`} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function AccountAccordion() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <Section id="account" title="With heart" subtitle="마음 전하실 곳">
      <p className={s.desc}>
        참석이 어려우신 분들을 위해 기재하였습니다.
        <br />
        너그러운 마음으로 양해 부탁드립니다.
      </p>
      <div className={s.groups}>
        {wedding.accounts.map((g) => (
          <Group key={g.side} group={g} open={open === g.side} onToggle={() => setOpen(open === g.side ? null : g.side)} />
        ))}
      </div>
    </Section>
  )
}
