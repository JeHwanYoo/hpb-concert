import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './models/seat.model'

export const SeatsRepositoryToken = 'SeatRepository'

export interface SeatsRepository {
  create(creationModel: SeatCreationModel): Promise<SeatModel>

  find(concertId: string): Promise<SeatModel[]>

  update(seatId: string, updatingModel: SeatUpdatingModel): Promise<SeatModel>
}
