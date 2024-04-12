import { SeatCreationModel, SeatModel } from './models/seat.model'

export const SeatsRepositoryToken = 'SeatRepository'

export interface SeatsRepository {
  create(creationModel: SeatCreationModel): SeatModel

  find(concertId: string): SeatModel[]

  update(updatingModel: SeatModel): SeatModel
}
