export interface SeatCreationModel {
  holderId: string
  concertId: string
  seatNo: number
  reservedAt: Date
  deadline: Date
}

export type SeatUpdatingModel = Omit<
  Partial<SeatCreationModel>,
  'concertId' | 'seatNo'
> & { paidAt?: Date }

export interface SeatModel {
  /**
   * @description UUID
   *
   * if id === null, not reserved yet
   */
  id: string | null
  holderId: string | null
  concertId: string
  seatNo: number
  reservedAt: Date | null
  deadline: Date | null
  paidAt: Date | null
}
