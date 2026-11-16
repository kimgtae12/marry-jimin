import { wedding } from '@/entities/wedding'
import { usePrefersReducedMotion } from '@/shared/lib'
import { AccountAccordion } from '@/widgets/account'
import { Gallery } from '@/widgets/gallery'
import { Greeting } from '@/widgets/greeting'
import { Guestbook } from '@/widgets/guestbook'
import { Hero } from '@/widgets/hero'
import { LetterEnvelope } from '@/widgets/letter-envelope'
import { Location } from '@/widgets/location'
import { Rsvp } from '@/widgets/rsvp'
import { WeddingCalendar } from '@/widgets/wedding-calendar'

export function InvitationPage() {
  // 모션 최소화 환경에서는 봉투 없이 바로 메인 → 본문으로 진행
  const reducedMotion = usePrefersReducedMotion()

  return (
    <LetterEnvelope
      disabled={reducedMotion}
      caption={wedding.intro.quote.join('\n')}
      captionSource={wedding.intro.quoteSource}
    >
      <Hero />
      <Greeting />
      <WeddingCalendar />
      <Gallery />
      <Location />
      <Guestbook />
      <AccountAccordion />
      <Rsvp />
    </LetterEnvelope>
  )
}
