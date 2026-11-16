import { useState, type FormEvent } from 'react'
import { createGuestbook, type GuestbookEntry } from '@/entities/guestbook'
import { useToast } from '@/shared/ui'
import s from './GuestbookForm.module.css'

const MAX = 200

export function GuestbookForm({ onCreated }: { onCreated: (entry: GuestbookEntry) => void }) {
  const toast = useToast()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || pending) return
    setPending(true)
    try {
      const entry = await createGuestbook({ name: name.trim(), message: message.trim() })
      onCreated(entry)
      setMessage('')
      toast('축하 메시지가 등록되었어요')
    } catch {
      toast('등록에 실패했어요. 잠시 후 다시 시도해 주세요')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <input
        className="ui-input"
        placeholder="이름"
        value={name}
        maxLength={20}
        onChange={(e) => setName(e.target.value)}
        aria-label="이름"
      />
      <div className={s.messageRow}>
        <textarea
          className="ui-input"
          placeholder="두 사람에게 축하의 말을 남겨주세요"
          value={message}
          maxLength={MAX}
          rows={2}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="메시지"
        />
        <button className="ui-button" disabled={pending || !name.trim() || !message.trim()}>
          {pending ? '...' : '남기기'}
        </button>
      </div>
    </form>
  )
}
