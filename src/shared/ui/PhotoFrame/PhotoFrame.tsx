import s from './PhotoFrame.module.css'

type Props = {
  src?: string
  alt: string
  label?: string
  className?: string
}

/** 사진이 아직 없을 때는 종이 톤 플레이스홀더를 보여준다 */
export function PhotoFrame({ src, alt, label, className }: Props) {
  return (
    <div className={`${s.frame} ${className ?? ''}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <span className={s.placeholder}>{label ?? 'Photo'}</span>
      )}
    </div>
  )
}
