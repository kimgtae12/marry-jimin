import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Ornament } from '../Ornament/Ornament'
import s from './Section.module.css'

type Props = {
  id?: string
  title?: string
  subtitle?: string
  tone?: 'paper' | 'brown'
  className?: string
  children: ReactNode
}

/** 풀페이지 한 장. 화면에 들어오면 내용이 페이드업 된다 */
export function Section({ id, title, subtitle, tone = 'paper', className, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id={id}
      className={`${s.section} ${s[tone]} ${className ?? ''}`}
      data-visible={visible}
    >
      <div className={s.inner}>
        {title && (
          <header className={s.header}>
            <Ornament size={14} />
            <h2 className={s.title}>{title}</h2>
            {subtitle && <p className={s.subtitle}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
