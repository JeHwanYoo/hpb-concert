import { Inject, Injectable } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './models/seat.model'

@Injectable()
export class SeatsService {
  constructor(
    @Inject(SeatsRepositoryToken)
    private readonly seatsRepository: SeatsRepository,
  ) {}

  create(creationModel: SeatCreationModel): Promise<SeatModel> {
    return
  }

  find(concertId: string): Promise<SeatModel[]> {
    return
  }

  reserve(updatingModel: SeatUpdatingModel): Promise<SeatModel> {
    return
  }
}
