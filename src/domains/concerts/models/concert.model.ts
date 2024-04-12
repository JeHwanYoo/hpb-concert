export interface ConcertCreationModel {
  capacity: number
  price: number
  openingAt: Date
  closingAt: Date
  eventDate: Date
}

export type ConcertUpdatingModel = Partial<ConcertCreationModel>

export interface ConcertModel {
  /**
   * @description UUID
   */
  id: string
  /**
   * @description The maximum capacity of seats
   */
  capacity: number
  /**
   * @description The seat's price
   */
  price: number
  /**
   * @description createdAt
   */
  createdAt: Date
  /**
   * @description updatedAt
   */
  updatedAt: Date
  /**
   * @description The opening time of the ticket sale
   */
  openingAt: Date
  /**
   * @description The closing time of the ticket sale
   */
  closingAt: Date
  /**
   * @description The date of the event
   */
  eventDate: Date
}
