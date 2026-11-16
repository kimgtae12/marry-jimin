import type { CSSProperties } from 'react'

/** 레퍼런스의 ✷ 별 장식 */
export function Ornament({ size = 18, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={style}>
      <path
        fill="currentColor"
        d="M12 0l1.3 9.2L20.5 3.5l-5.7 7.2L24 12l-9.2 1.3 5.7 7.2-7.2-5.7L12 24l-1.3-9.2-7.2 5.7 5.7-7.2L0 12l9.2-1.3L3.5 3.5l7.2 5.7z"
      />
    </svg>
  )
}
