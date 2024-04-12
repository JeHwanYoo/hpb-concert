import { Inject, Injectable } from '@nestjs/common'
import { SeatsRepository, SeatsRepositoryToken } from './seats.repository'
import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './models/seat.model'
import { addMinutes } from 'date-fns'

@Injectable()
export class SeatsService {
  constructor(
    @Inject(SeatsRepositoryToken)
    private readonly seatsRepository: SeatsRepository,
  ) {}

  /**
   *
   * @param reservationModel
   * @description
   * create the seat when user reserve it
   */
  reserve(
    reservationModel: Omit<
      SeatCreationModel,
      'reservedAt' | 'deadline' | 'paidAt'
    >,
  ): Promise<SeatModel> {
    const reservedAt = new Date()
    const deadline = addMinutes(reservedAt, 5)
    return this.seatsRepository.create({
      ...reservationModel,
      reservedAt,
      deadline,
    })
  }

  pay(seatId: string, paymentModel: Pick<SeatUpdatingModel, 'paidAt'>) {
    return this.seatsRepository.update(seatId, paymentModel)
  }

  find(concertId: string): Promise<SeatModel[]> {
    return this.seatsRepository.find(concertId)
  }

  findOneBySeatNo(seatNo: number): Promise<SeatModel> {
    return this.seatsRepository.findOneBySeatNo(seatNo)
  }
}