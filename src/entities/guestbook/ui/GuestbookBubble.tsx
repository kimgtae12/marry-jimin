import type { GuestbookEntry } from '../model/types'
import s from './GuestbookBubble.module.css'

const fmt = new Intl.DateTimeFormat('ko-KR', { month: 'numeric', day: 'numeric' })

export function GuestbookBubble({ entry, align }: { entry: GuestbookEntry; align: 'left' | 'right' }) {
  return (
    <li className={s.row} data-align={align}>
      <p className={s.bubble}>{entry.message}</p>
      <span className={s.meta}>
        {entry.name} · {fmt.format(new Date(entry.created_at))}
      </span>
    </li>
  )
}
