type Props = { className?: string }

/* 지도 앱 버튼용 간단한 아이콘 — 각 서비스 대표 색 + 이니셜 */
function Badge({ className, bg, fg, letter }: Props & { bg: string; fg: string; letter: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <rect width="20" height="20" rx="5" fill={bg} />
      <text
        x="10"
        y="14.6"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill={fg}
      >
        {letter}
      </text>
    </svg>
  )
}

export const NaverMapIcon = (p: Props) => <Badge {...p} bg="#03C75A" fg="#fff" letter="N" />
export const KakaoMapIcon = (p: Props) => <Badge {...p} bg="#FEE500" fg="#3A1D1D" letter="K" />
export const TmapIcon = (p: Props) => <Badge {...p} bg="#0064FF" fg="#fff" letter="T" />
