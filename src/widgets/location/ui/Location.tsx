import { wedding } from '@/entities/wedding'
import { Section } from '@/shared/ui'
import { KakaoMapIcon, NaverMapIcon, TmapIcon } from './MapIcons'
import s from './Location.module.css'

export function Location() {
  const { venue, transport } = wedding
  const q = encodeURIComponent(venue.mapQuery)
  const links = [
    { label: '네이버지도', href: venue.mapLinks.naver, Icon: NaverMapIcon },
    { label: '카카오맵', href: venue.mapLinks.kakao, Icon: KakaoMapIcon },
    { label: '티맵', href: venue.mapLinks.tmap, Icon: TmapIcon },
  ]

  return (
    <Section id="location" title="Location">
      <div className={s.venue}>
        <p className={s.name}>{venue.name}</p>
        <p className={s.hall}>{venue.hall}</p>
        {venue.address && <p className={s.address}>{venue.address}</p>}
      </div>

      <div className={s.map}>
        <iframe
          title={`${venue.name} 지도`}
          src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className={s.links}>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={`ui-button ui-button--ghost ${s.link}`}
          >
            <l.Icon className={s.icon} />
            {l.label}
          </a>
        ))}
      </div>

      <dl className={s.transport}>
        {transport.map((t) => (
          <div key={t.label}>
            <dt>{t.label}</dt>
            <dd>
              {t.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
