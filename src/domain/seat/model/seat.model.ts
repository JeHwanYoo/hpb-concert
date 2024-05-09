export interface SeatModel {
  id: string | null
  holderId: string | null
  concertId: string
  seatNo: number
  reservedAt: Date | null
  deadline: Date | null
  paidAt: Date | null
}

export type SeatCreationModel = Pick<
  SeatModel,
  'holderId' | 'concertId' | 'seatNo' | 'reservedAt' | 'deadline'
>

export type SeatReservationModel = Omit<
  SeatCreationModel,
  'reservedAt' | 'deadline'
>

export type SeatUpdatingModel = Partial<
  Pick<SeatModel, 'holderId' | 'reservedAt' | 'deadline' | 'paidAt'>
>
