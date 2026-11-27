import s from './PhotoFrame.module.css'

type Props = {
  src?: string
  alt: string
  label?: string
  className?: string
  /** 첫 화면 사진처럼 바로 불러와야 할 때 */
  eager?: boolean
}

/** 사진이 아직 없을 때는 종이 톤 플레이스홀더를 보여준다 */
export function PhotoFrame({ src, alt, label, className, eager }: Props) {
  return (
    <div className={`${s.frame} ${className ?? ''}`}>
      {src ? (
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      ) : (
        <span className={s.placeholder}>{label ?? 'Photo'}</span>
      )}
    </div>
  )
}
