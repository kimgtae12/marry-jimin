export type RsvpSide = 'groom' | 'bride'
export type RsvpMeal = 'yes' | 'no' | 'undecided'

export type NewRsvp = {
  side: RsvpSide
  name: string
  attending: boolean
  headcount: number
  meal: RsvpMeal
}
