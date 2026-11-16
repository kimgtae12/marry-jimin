import { useEffect, useState } from 'react'
import { wedding } from '@/entities/wedding'
import { PhotoFrame, Section } from '@/shared/ui'
import s from './Gallery.module.css'

const PLACEHOLDER_COUNT = 9

export function Gallery() {
  const photos: (string | undefined)[] = wedding.gallery.length
    ? wedding.gallery
    : Array.from({ length: PLACEHOLDER_COUNT }, () => undefined)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive((i) => (i === null ? i : (i + 1) % photos.length))
      if (e.key === 'ArrowLeft') setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, photos.length])

  return (
    <Section id="gallery" title="Gallery">
      <ul className={s.grid}>
        {photos.map((src, i) => (
          <li key={i}>
            <button type="button" onClick={() => setActive(i)} aria-label={`사진 ${i + 1} 크게 보기`}>
              <PhotoFrame src={src} alt={`갤러리 사진 ${i + 1}`} label={`${i + 1}`} className={s.thumb} />
            </button>
          </li>
        ))}
      </ul>
      {!wedding.gallery.length && <p className={s.notice}>사진은 곧 업데이트 됩니다</p>}

      {active !== null && (
        <div className={s.lightbox} role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <PhotoFrame src={photos[active]} alt={`갤러리 사진 ${active + 1}`} label={`${active + 1}`} className={s.full} />
          <p className={s.counter}>
            {active + 1} / {photos.length}
          </p>
        </div>
      )}
    </Section>
  )
}
