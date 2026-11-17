import s from './LetterEnvelope.module.css'

/**
 * 봉투 앞주머니. 좌·우 날개 + 아래 날개 3장으로 V 자 입구를 만든다.
 * 입구(위쪽)는 투명해서 그 뒤로 편지지가 보인다.
 */
export function EnvelopeFront({ caption, captionSource }: { caption: string; captionSource?: string }) {
  return (
    <div className={s.frontInner}>
      <svg viewBox="0 0 390 440" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="env-shadow" x="-10%" y="-20%" width="120%" height="140%">
            <feDropShadow dx="0" dy="-3" stdDeviation="6" floodColor="#000" floodOpacity="0.28" />
          </filter>
        </defs>
        <g filter="url(#env-shadow)">
          {/* 왼쪽 날개 */}
          <path d="M0 168 L164 300 Q178 312 164 326 L0 440 Z" fill="var(--env-side)" />
          {/* 오른쪽 날개 */}
          <path d="M390 168 L226 300 Q212 312 226 326 L390 440 Z" fill="var(--env-side)" />
          {/* 아래 날개 — 가운데가 둥글게 솟음 */}
          <path d="M0 404 L176 290 Q195 278 214 290 L390 404 V440 H0 Z" fill="var(--env-bottom)" />
        </g>
      </svg>
      <p className={s.caption}>
        {caption}
        {captionSource && <span className={s.captionSource}>— {captionSource} —</span>}
      </p>
    </div>
  )
}
