import { useEffect, useState } from 'react'
import { fetchGuestbook, GuestbookBubble, type GuestbookEntry } from '@/entities/guestbook'
import { GuestbookForm } from '@/features/write-guestbook'
import { Section } from '@/shared/ui'
import s from './Guestbook.module.css'

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let alive = true
    fetchGuestbook()
      .then((list) => alive && (setEntries(list), setStatus('ready')))
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [])

  return (
    <Section id="guestbook" title="Guest book" subtitle="두 사람에게 따뜻한 마음을 남겨주세요">
      <GuestbookForm onCreated={(entry) => setEntries((prev) => [entry, ...prev])} />

      <ul className={s.list}>
        {status === 'loading' && <li className={s.empty}>불러오는 중...</li>}
        {status === 'error' && <li className={s.empty}>방명록을 불러오지 못했어요</li>}
        {status === 'ready' && entries.length === 0 && <li className={s.empty}>첫 번째 축하 메시지를 남겨주세요 ♥</li>}
        {entries.map((entry, i) => (
          <GuestbookBubble key={entry.id} entry={entry} align={i % 2 ? 'right' : 'left'} />
        ))}
      </ul>
    </Section>
  )
}
