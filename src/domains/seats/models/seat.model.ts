export class SeatModel {
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
