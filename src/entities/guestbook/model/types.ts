export type GuestbookEntry = {
  id: string
  name: string
  message: string
  created_at: string
}

export type NewGuestbookEntry = Pick<GuestbookEntry, 'name' | 'message'>
