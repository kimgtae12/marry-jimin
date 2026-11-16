export type Person = {
  name: string
  /** 이름(성 제외) — 문구에 사용 */
  firstName: string
}

export type BankAccount = {
  role: string
  name: string
  bank?: string
  number?: string
  holder?: string
}

export type AccountGroup = {
  side: 'groom' | 'bride'
  label: string
  accounts: BankAccount[]
}

export type WeddingInfo = {
  groom: Person & { father: string; mother: string }
  bride: Person & { father?: string; mother: string }
  date: Date
  dateLabel: string
  venue: { name: string; hall: string; mapQuery: string; address?: string }
  intro: { title: string; quote: string[]; quoteSource: string; body: string[][] }
  transport: { label: string; lines: string[] }[]
  accounts: AccountGroup[]
  mainPhoto?: string
  gallery: string[]
}
