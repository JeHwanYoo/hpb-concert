export interface SeatCreationModel {
  holderId: string
  concertId: string
  reservedAt: Date
  deadlineAt: Date
  paidAt: Date
}

export type SeatUpdatingModel = Partial<SeatCreationModel>

export interface SeatModel {
  /**
   * @description UUID
   *
   * if id === null, not reserved yet
   */
  id: string | null
  holderId: string | null
  concertId: string
  reservedAt: Date | null
  deadline: Date | null
  paidAt: Date | null
}
