import { useCallback, useRef, useState, type ReactNode } from 'react'
import { ToastContext } from './toastContext'
import s from './Toast.module.css'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((msg: string) => {
    window.clearTimeout(timer.current)
    setMessage(msg)
    timer.current = window.setTimeout(() => setMessage(null), 1800)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={s.toast} data-show={message !== null} role="status" aria-live="polite">
        {message}
      </div>
    </ToastContext.Provider>
  )
}
