export interface ConcertModel {
  id: string
  capacity: number
  price: number
  createdAt: Date
  updatedAt: Date
  openingAt: Date
  closingAt: Date
  eventDate: Date
}

export type ConcertCreationModel = Pick<
  ConcertModel,
  'capacity' | 'price' | 'openingAt' | 'closingAt' | 'eventDate'
>
